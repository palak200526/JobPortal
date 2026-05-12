"use client";

import Link from "next/link";
import { Bookmark, MapPin, Timer, Wallet } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "@/hooks/useAuth";
import { Job } from "@/lib/types";
import { formatDate, formatSalaryRange } from "@/utils/formatters";
import * as savedJobService from "@/services/savedJobService";

export function JobCard({
  job,
  onSaved,
  compact = false,
}: {
  job: Job;
  onSaved?: () => void;
  compact?: boolean;
}) {
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user) {
      toast.error("Please log in as a job seeker to save jobs");
      return;
    }

    if (user.role !== "seeker") {
      toast.error("Only job seekers can save jobs");
      return;
    }

    await savedJobService.saveJob(job.id);
    toast.success("Job saved successfully");
    onSaved?.();
  };

  return (
    <article className="glass-panel card-hover flex h-full flex-col p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            {job.is_featured ? <span className="chip border-amber-300/20 bg-amber-300/10 text-amber-200">Featured</span> : null}
            {job.category_name ? <span className="chip">{job.category_name}</span> : null}
          </div>
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white">{job.title}</h3>
          <p className="mt-2 text-sm text-slate-300">{job.company}</p>
        </div>
        <button
          onClick={handleSave}
          className="rounded-full border border-white/10 bg-white/5 p-3 text-slate-200 transition hover:bg-white/10"
          aria-label={`Save ${job.title}`}
        >
          <Bookmark className="size-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-slate-300">
        <span className="chip"><MapPin className="mr-2 size-3.5" />{job.location}</span>
        <span className="chip"><Wallet className="mr-2 size-3.5" />{formatSalaryRange(job.salary_min, job.salary_max)}</span>
        <span className="chip"><Timer className="mr-2 size-3.5" />{job.job_type} · {job.workplace_type}</span>
      </div>

      {!compact && job.description ? (
        <p className="mt-5 line-clamp-3 text-sm leading-7 text-slate-300">{job.description}</p>
      ) : null}

      <div className="mt-auto flex items-center justify-between pt-6 text-sm text-slate-400">
        <span>Deadline: {formatDate(job.deadline)}</span>
        <Link
          href={`/jobs/${job.id}`}
          className="rounded-full bg-white px-4 py-2 font-semibold text-slate-950 transition hover:bg-teal-300"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
