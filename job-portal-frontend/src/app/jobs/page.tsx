"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { EmptyState } from "@/components/common/EmptyState";
import { LoadingCard } from "@/components/common/LoadingCard";
import { SectionHeading } from "@/components/common/SectionHeading";
import { JobCard } from "@/components/jobs/JobCard";
import { JobFilters } from "@/components/jobs/JobFilters";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { useDebounce } from "@/hooks/useDebounce";
import { Category, Job } from "@/lib/types";
import * as jobService from "@/services/jobService";

const defaultFilters = {
  keyword: "",
  location: "",
  categoryId: "",
  jobType: "",
  workplaceType: "",
  experienceLevel: "",
  salaryMin: "",
  sortBy: "",
};

export default function JobsPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    ...defaultFilters,
    keyword: searchParams.get("keyword") || "",
    location: searchParams.get("location") || "",
    categoryId: searchParams.get("categoryId") || "",
    workplaceType: searchParams.get("workplaceType") || "",
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const debouncedFilters = useDebounce(filters, 350);

  const loadJobs = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const jobsData = await jobService.getJobs({ ...debouncedFilters, page, limit: 9 });
      setJobs(jobsData.items);
      setPagination(jobsData.pagination);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedFilters]);

  useEffect(() => {
    jobService.getCategories().then(setCategories).catch(() => undefined);
  }, []);

  useEffect(() => {
    loadJobs().catch(() => undefined);
  }, [loadJobs]);

  return (
    <div>
      <Navbar />
      <main className="shell py-12">
        <SectionHeading eyebrow="Job Discovery" title="Search, filter, and shortlist roles with speed" description="Use advanced filters, salary thresholds, and structured categories to find the right opening faster." />

        <JobFilters
          filters={filters}
          categories={categories}
          onChange={(field, value) => setFilters((prev) => ({ ...prev, [field]: value }))}
          onReset={() => setFilters(defaultFilters)}
        />

        <div className="mt-8 flex items-center justify-between text-sm text-slate-400">
          <span>{pagination.total} jobs found</span>
          <span>Page {pagination.page}</span>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => <LoadingCard key={index} />)
          ) : jobs.length ? (
            jobs.map((job) => <JobCard key={job.id} job={job} onSaved={() => loadJobs(pagination.page)} />)
          ) : (
            <div className="lg:col-span-3">
              <EmptyState title="No matching jobs yet" description="Try broadening your filters, removing salary constraints, or switching workplace type." />
            </div>
          )}
        </div>

        {pagination.total > pagination.limit ? (
          <div className="mt-8 flex justify-center gap-3">
            <button
              disabled={pagination.page <= 1}
              onClick={() => loadJobs(pagination.page - 1)}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={pagination.page * pagination.limit >= pagination.total}
              onClick={() => loadJobs(pagination.page + 1)}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
