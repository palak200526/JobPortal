"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { EmptyState } from "@/components/common/EmptyState";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ResumeUploader } from "@/components/resume/ResumeUploader";
import { Application, Job, User } from "@/lib/types";
import { formatDate } from "@/utils/formatters";
import * as applicationService from "@/services/applicationService";
import * as jobService from "@/services/jobService";
import * as userService from "@/services/userService";

export default function SeekerDashboard() {
  const [, startTransition] = useTransition();
  const [profile, setProfile] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  const loadDashboard = async () => {
    const [profileData, applicationsData, jobsData] = await Promise.all([
      userService.getProfile(),
      applicationService.getMyApplications(),
      jobService.getJobs({ limit: 6 }),
    ]);

    startTransition(() => {
      setProfile(profileData);
      setApplications(applicationsData);
      setJobs(jobsData.items);
    });
  };

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [profileData, applicationsData, jobsData] = await Promise.all([
          userService.getProfile(),
          applicationService.getMyApplications(),
          jobService.getJobs({ limit: 6 }),
        ]);

        if (!active) {
          return;
        }

        startTransition(() => {
          setProfile(profileData);
          setApplications(applicationsData);
          setJobs(jobsData.items);
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load dashboard");
      }
    })();

    return () => {
      active = false;
    };
  }, [startTransition]);

  return (
    <div className="space-y-10">
      <SectionHeading eyebrow="Career Console" title="Track every application in one place" description="Keep your resume fresh, monitor recruiter decisions, and stay close to the next strong fit." />

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel p-6">
          <SectionHeading title="Resume vault" description="Recruiters can only review complete applications, so keeping your resume current matters." />
          <ResumeUploader resume={profile?.resume || null} onUploaded={loadDashboard} />
        </div>

        <div className="glass-panel p-6">
          <SectionHeading title="Quick profile summary" description="A clean profile makes your applications easier to evaluate." />
          {profile ? (
            <div className="space-y-3 rounded-[24px] border border-white/10 bg-white/5 p-5">
              <h3 className="text-xl font-semibold text-white">{profile.name}</h3>
              <p className="text-sm text-slate-300">{profile.headline || "Add a headline to stand out to recruiters."}</p>
              <p className="text-sm text-slate-400">{profile.location || "Location not added yet"}</p>
              <p className="text-sm text-slate-300">{profile.skills || "No skills listed yet"}</p>
              <Link href="/profile" className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-300">
                Edit profile
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      <div className="glass-panel p-6">
        <SectionHeading title="Application tracker" description="See recruiter movement, status history, and the jobs you’re progressing through." />
        <div className="space-y-4">
          {applications.length ? applications.map((application) => (
            <div key={application.id} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">{application.title}</h3>
                  <p className="mt-1 text-sm text-slate-300">{application.company} · {application.location}</p>
                  <p className="mt-2 text-sm text-slate-400">Applied on {formatDate(application.created_at)}</p>
                </div>
                <span className="chip">{application.status}</span>
              </div>

              {application.history?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {application.history.map((historyItem) => (
                    <span key={historyItem.id} className="chip">
                      {historyItem.status} · {formatDate(historyItem.created_at)}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          )) : <EmptyState title="No applications yet" description="Once you apply to jobs, your statuses and recruiter updates will appear here." />}
        </div>
      </div>

      <div className="glass-panel p-6">
        <SectionHeading title="Fresh opportunities" description="A few currently active roles to keep your pipeline moving." action={<Link href="/jobs" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10">Explore all jobs</Link>} />
        <div className="grid gap-4 lg:grid-cols-3">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <h3 className="text-xl font-semibold text-white">{job.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{job.company}</p>
              <p className="mt-1 text-sm text-slate-400">{job.location} · {job.job_type}</p>
              <Link href={`/jobs/${job.id}`} className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-300">
                Review job
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
