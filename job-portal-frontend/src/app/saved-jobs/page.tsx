"use client";

import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

import { EmptyState } from "@/components/common/EmptyState";
import { ProtectedView } from "@/components/common/ProtectedView";
import { SectionHeading } from "@/components/common/SectionHeading";
import { JobCard } from "@/components/jobs/JobCard";
import { Navbar } from "@/components/layout/Navbar";
import { Job } from "@/lib/types";
import * as savedJobService from "@/services/savedJobService";

export default function SavedJobsPage() {
  const [, startTransition] = useTransition();
  const [jobs, setJobs] = useState<Job[]>([]);

  const loadSavedJobs = async () => {
    try {
      const nextJobs = await savedJobService.getSavedJobs();
      startTransition(() => {
        setJobs(nextJobs);
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load saved jobs");
    }
  };

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const nextJobs = await savedJobService.getSavedJobs();

        if (!active) {
          return;
        }

        startTransition(() => {
          setJobs(nextJobs);
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load saved jobs");
      }
    })();

    return () => {
      active = false;
    };
  }, [startTransition]);

  return (
    <ProtectedView roles={["seeker", "admin"]}>
      <Navbar />
      <main className="shell py-12">
        <SectionHeading eyebrow="Saved jobs" title="Your shortlist stays here" description="Return to bookmarked jobs, compare fit, and apply when your resume is ready." />
        <div className="grid gap-5 lg:grid-cols-3">
          {jobs.length ? jobs.map((job) => <JobCard key={job.job_id || job.id} job={{ ...job, id: job.job_id || job.id }} />) : <div className="lg:col-span-3"><EmptyState title="Nothing saved yet" description="Save jobs from the listings page to build a thoughtful shortlist." /></div>}
        </div>
        {jobs.length ? (
          <div className="mt-6 space-y-3">
            {jobs.map((job) => (
              <div key={`remove-${job.job_id || job.id}`} className="glass-panel flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-white">{job.title}</p>
                  <p className="text-sm text-slate-400">{job.company}</p>
                </div>
                <button
                  onClick={async () => {
                    await savedJobService.removeSavedJob(job.job_id || job.id);
                    toast.success("Removed from saved jobs");
                    await loadSavedJobs();
                  }}
                  className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </main>
    </ProtectedView>
  );
}
