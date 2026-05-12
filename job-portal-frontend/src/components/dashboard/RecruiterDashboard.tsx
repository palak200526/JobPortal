"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Briefcase, Star, Users } from "lucide-react";
import toast from "react-hot-toast";

import { APPLICATION_STATUSES, EXPERIENCE_LEVELS, JOB_TYPES, WORKPLACE_TYPES } from "@/lib/constants";
import { Analytics, Application, Category, Job } from "@/lib/types";
import { formatDate, formatSalaryRange } from "@/utils/formatters";
import { SectionHeading } from "@/components/common/SectionHeading";
import { StatCard } from "@/components/common/StatCard";
import { EmptyState } from "@/components/common/EmptyState";
import * as applicationService from "@/services/applicationService";
import * as jobService from "@/services/jobService";
import * as userService from "@/services/userService";

type RecruiterJobForm = {
  title: string;
  company: string;
  description: string;
  salaryMin: string;
  salaryMax: string;
  experienceLevel: string;
  experienceYears: string;
  jobType: string;
  workplaceType: string;
  skills: string;
  deadline: string;
  categoryId: string;
  location: string;
};

const initialJobForm: RecruiterJobForm = {
  title: "",
  company: "",
  description: "",
  salaryMin: "",
  salaryMax: "",
  experienceLevel: EXPERIENCE_LEVELS[1],
  experienceYears: "2",
  jobType: JOB_TYPES[0],
  workplaceType: WORKPLACE_TYPES[1],
  skills: "",
  deadline: "",
  categoryId: "",
  location: "",
};

export default function RecruiterDashboard({ categories }: { categories: Category[] }) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState<RecruiterJobForm>(initialJobForm);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [applicantsByJob, setApplicantsByJob] = useState<Record<number, Application[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  const stats = useMemo(
    () => [
      { label: "Total jobs", value: analytics?.totals.totalJobs || 0, icon: <Briefcase className="size-5" /> },
      { label: "Active jobs", value: analytics?.totals.activeJobs || 0, icon: <Activity className="size-5" />, accent: "bg-emerald-400/10 text-emerald-300" },
      { label: "Closed jobs", value: analytics?.totals.closedJobs || 0, icon: <Star className="size-5" />, accent: "bg-amber-400/10 text-amber-300" },
      { label: "Applicants", value: analytics?.totals.totalApplicants || 0, icon: <Users className="size-5" />, accent: "bg-sky-400/10 text-sky-300" },
    ],
    [analytics]
  );

  const loadDashboard = async () => {
    const [analyticsData, jobsData] = await Promise.all([
      userService.getRecruiterAnalytics(),
      jobService.getRecruiterJobs({ limit: 20 }),
    ]);

    setAnalytics(analyticsData);
    setJobs(jobsData.items);
  };

  useEffect(() => {
    loadDashboard().catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load recruiter dashboard"));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        ...form,
        categoryId: form.categoryId ? Number(form.categoryId) : undefined,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        experienceYears: form.experienceYears ? Number(form.experienceYears) : undefined,
      };

      if (editingJobId) {
        await jobService.updateJob(editingJobId, payload);
        toast.success("Job updated");
      } else {
        await jobService.createJob(payload);
        toast.success("Job posted successfully");
      }

      setEditingJobId(null);
      setForm(initialJobForm);
      await loadDashboard();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save job");
    } finally {
      setIsSaving(false);
    }
  };

  const populateForm = (job: Job) => {
    setEditingJobId(job.id);
    setForm({
      title: job.title,
      company: job.company,
      description: job.description || "",
      salaryMin: job.salary_min ? String(job.salary_min) : "",
      salaryMax: job.salary_max ? String(job.salary_max) : "",
      experienceLevel: job.experience_level || EXPERIENCE_LEVELS[1],
      experienceYears: job.experience_years ? String(job.experience_years) : "",
      jobType: job.job_type,
      workplaceType: job.workplace_type,
      skills: job.skills || "",
      deadline: job.deadline ? job.deadline.slice(0, 10) : "",
      categoryId: job.category_id ? String(job.category_id) : "",
      location: job.location,
    });
  };

  const loadApplicants = async (jobId: number) => {
    const applicants = await jobService.getApplicants(jobId);
    setApplicantsByJob((prev) => ({ ...prev, [jobId]: applicants }));
  };

  return (
    <div className="space-y-10">
      <SectionHeading eyebrow="Recruiter Workspace" title="Own your hiring pipeline" description="Create jobs, monitor applicant flow, and move candidates through a trackable hiring process." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="glass-panel p-6">
          <SectionHeading title={editingJobId ? "Edit job" : "Post a new job"} description="Use a structured job brief so the search system and candidate matching stay precise." />
          <div className="grid gap-4 md:grid-cols-2">
            <input className="field" placeholder="Job title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
            <input className="field" placeholder="Company" value={form.company} onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))} required />
            <input className="field" placeholder="Location" value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))} required />
            <select className="field" value={form.categoryId} onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}>
              <option value="">Select category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <select className="field" value={form.jobType} onChange={(e) => setForm((prev) => ({ ...prev, jobType: e.target.value }))}>
              {JOB_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select className="field" value={form.workplaceType} onChange={(e) => setForm((prev) => ({ ...prev, workplaceType: e.target.value }))}>
              {WORKPLACE_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <input className="field" type="number" placeholder="Salary min" value={form.salaryMin} onChange={(e) => setForm((prev) => ({ ...prev, salaryMin: e.target.value }))} />
            <input className="field" type="number" placeholder="Salary max" value={form.salaryMax} onChange={(e) => setForm((prev) => ({ ...prev, salaryMax: e.target.value }))} />
            <select className="field" value={form.experienceLevel} onChange={(e) => setForm((prev) => ({ ...prev, experienceLevel: e.target.value }))}>
              {EXPERIENCE_LEVELS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <input className="field" type="number" placeholder="Years of experience" value={form.experienceYears} onChange={(e) => setForm((prev) => ({ ...prev, experienceYears: e.target.value }))} />
            <input className="field md:col-span-2" placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm((prev) => ({ ...prev, skills: e.target.value }))} />
            <input className="field md:col-span-2" type="date" value={form.deadline} onChange={(e) => setForm((prev) => ({ ...prev, deadline: e.target.value }))} />
          </div>
          <textarea className="field mt-4 min-h-40" placeholder="Describe responsibilities, expectations, and the hiring context..." value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} required />
          <div className="mt-5 flex flex-wrap gap-3">
            <button disabled={isSaving} className="rounded-full bg-white px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-teal-300 disabled:opacity-70">
              {isSaving ? "Saving..." : editingJobId ? "Update job" : "Publish job"}
            </button>
            {editingJobId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingJobId(null);
                  setForm(initialJobForm);
                }}
                className="rounded-full border border-white/10 px-5 py-2.5 text-slate-100 transition hover:bg-white/10"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>

        <div className="glass-panel p-6">
          <SectionHeading title="Recent applicant activity" description="Quick signal on who is moving through your funnel right now." />
          <div className="space-y-4">
            {analytics?.recentApplications.length ? analytics.recentApplications.map((item) => (
              <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-slate-400">{item.title}</p>
                  </div>
                  <div className="text-right">
                    <div className="chip">{item.status}</div>
                    <p className="mt-2 text-xs text-slate-500">{formatDate(item.created_at)}</p>
                  </div>
                </div>
              </div>
            )) : <EmptyState title="No applicants yet" description="Once candidates apply, their status changes and activity will show here." />}
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <SectionHeading title="Manage your jobs" description="Edit, feature, close, or inspect applications for every job you publish." />
        <div className="space-y-5">
          {jobs.length ? jobs.map((job) => (
            <div key={job.id} className="rounded-[26px] border border-white/10 bg-white/5 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className="chip">{job.status}</span>
                    {job.is_featured ? <span className="chip border-amber-300/20 bg-amber-300/10 text-amber-200">Featured</span> : null}
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{job.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{job.company} · {job.location}</p>
                  <p className="mt-3 text-sm text-slate-400">{formatSalaryRange(job.salary_min, job.salary_max)} · {job.applicant_count || 0} applicants</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button onClick={() => populateForm(job)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10">Edit</button>
                  <button onClick={async () => { await jobService.featureJob(job.id, !job.is_featured); toast.success("Job highlight updated"); await loadDashboard(); }} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10">
                    {job.is_featured ? "Unfeature" : "Feature"}
                  </button>
                  <button onClick={async () => { await jobService.closeJob(job.id); toast.success("Job closed"); await loadDashboard(); }} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10">
                    Close
                  </button>
                  <button onClick={async () => { await jobService.deleteJob(job.id); toast.success("Job deleted"); await loadDashboard(); }} className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400">
                    Delete
                  </button>
                  <button onClick={() => loadApplicants(job.id)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-300">
                    View applicants
                  </button>
                </div>
              </div>

              {applicantsByJob[job.id]?.length ? (
                <div className="mt-5 space-y-4">
                  {applicantsByJob[job.id].map((applicant) => (
                    <div key={applicant.id} className="rounded-3xl border border-white/10 bg-slate-950/35 p-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="font-semibold text-white">{applicant.name}</p>
                          <p className="text-sm text-slate-300">{applicant.email}</p>
                          <p className="mt-1 text-sm text-slate-400">{applicant.headline || "Candidate profile available in portal"}</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <select
                            className="field min-w-44"
                            defaultValue={applicant.status}
                            onChange={async (event) => {
                              const nextStatus = event.target.value;
                              await applicationService.updateApplicationStatus(applicant.id, { status: nextStatus });
                              toast.success("Application status updated");
                              await loadApplicants(job.id);
                              await loadDashboard();
                            }}
                          >
                            {APPLICATION_STATUSES.filter((status) => status !== "Withdrawn").map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                          {applicant.file_path ? (
                            <a href={`${process.env.NEXT_PUBLIC_ASSET_URL || "http://localhost:5000"}${applicant.file_path}`} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10">
                              Resume
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )) : <EmptyState title="No jobs posted yet" description="Your first job post will start populating analytics and candidate flow here." />}
        </div>
      </div>
    </div>
  );
}
