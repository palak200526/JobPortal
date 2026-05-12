"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Job } from "@/lib/types";
import { formatDate, formatSalaryRange, toSkillList } from "@/utils/formatters";
import * as applicationService from "@/services/applicationService";
import * as jobService from "@/services/jobService";

export default function JobDetailPage() {
  const params = useParams<{ jobId: string }>();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    jobService.getJobById(Number(params.jobId)).then(setJob).catch((error) => {
      toast.error(error instanceof Error ? error.message : "Failed to load job");
    });
  }, [params.jobId]);

  const apply = async () => {
    if (!user) {
      toast.error("Please sign in to apply");
      return;
    }

    if (user.role !== "seeker") {
      toast.error("Only job seekers can apply to jobs");
      return;
    }

    setIsApplying(true);

    try {
      await applicationService.applyToJob({ jobId: Number(params.jobId), coverLetter });
      toast.success("Application submitted");
      setJob((prev) => (prev ? { ...prev, has_applied: true } : prev));
      setCoverLetter("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit application");
    } finally {
      setIsApplying(false);
    }
  };

  if (!job) {
    return (
      <div>
        <Navbar />
        <main className="shell py-16">
          <div className="glass-panel h-96 animate-pulse" />
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="shell py-12">
        <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
          <section className="glass-panel p-8">
            <div className="flex flex-wrap gap-3">
              {job.is_featured ? <span className="chip border-amber-300/20 bg-amber-300/10 text-amber-200">Featured</span> : null}
              {job.category_name ? <span className="chip">{job.category_name}</span> : null}
              <span className="chip">{job.job_type}</span>
              <span className="chip">{job.workplace_type}</span>
            </div>
            <h1 className="mt-5 font-[family-name:var(--font-display)] text-5xl font-semibold text-white">{job.title}</h1>
            <p className="mt-4 text-lg text-slate-300">{job.company} · {job.location}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="chip">{formatSalaryRange(job.salary_min, job.salary_max)}</span>
              <span className="chip">Deadline {formatDate(job.deadline)}</span>
              <span className="chip">{job.experience_level || "Flexible"} experience</span>
            </div>

            <div className="mt-8 space-y-6 text-slate-300">
              <div>
                <h2 className="text-xl font-semibold text-white">Role overview</h2>
                <p className="mt-3 whitespace-pre-line leading-8">{job.description}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Skills</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {toSkillList(job.skills).map((skill) => <span key={skill} className="chip">{skill}</span>)}
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-semibold text-white">Apply now</h2>
              <p className="mt-3 text-sm text-slate-400">Your application is tracked in the dashboard and recruiters can update its status in real time.</p>

              {job.has_applied ? (
                <div className="mt-5 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
                  You already applied to this job. Track status from your dashboard.
                </div>
              ) : (
                <>
                  <textarea className="field mt-5 min-h-40" placeholder="Optional cover letter" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
                  <button onClick={apply} disabled={isApplying} className="mt-5 w-full rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-teal-300 disabled:opacity-70">
                    {isApplying ? "Submitting..." : "Submit application"}
                  </button>
                </>
              )}
            </div>

            <div className="glass-panel p-6">
              <h2 className="text-2xl font-semibold text-white">Recruiter context</h2>
              <p className="mt-3 text-slate-300">{job.recruiter_name || "AuraJobs recruiter"}</p>
              {job.company_website ? (
                <a href={job.company_website} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm text-teal-300 hover:text-teal-200">
                  Visit company website
                </a>
              ) : null}
            </div>

            <Link href="/jobs" className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10">
              Back to all jobs
            </Link>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
