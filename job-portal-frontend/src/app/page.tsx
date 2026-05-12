"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Search, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

import { SectionHeading } from "@/components/common/SectionHeading";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { JobCard } from "@/components/jobs/JobCard";
import { Category, Job } from "@/lib/types";
import * as jobService from "@/services/jobService";

export default function HomePage() {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    Promise.all([jobService.getFeaturedJobs(), jobService.getCategories()]).then(([jobs, allCategories]) => {
      setFeaturedJobs(jobs);
      setCategories(allCategories);
    }).catch(() => undefined);
  }, []);

  return (
    <div>
      <Navbar />

      <main className="shell">
        <section className="grid gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-teal-400/10 px-4 py-2 text-sm text-teal-200">
              <Sparkles className="size-4" />
              End-to-end hiring and job discovery in one clean workspace
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight text-white md:text-7xl">
              Find better roles. Hire stronger talent. Move faster with AuraJobs.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A full-stack job portal for modern recruiting teams and ambitious candidates, with powerful search, application tracking, and resume workflows built in.
            </p>

            <div className="glass-panel mt-8 grid gap-4 p-4 md:grid-cols-[1fr_1fr_auto]">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-950/45 px-4 py-3">
                <Search className="size-4 text-teal-300" />
                <input className="w-full bg-transparent text-sm text-slate-100 outline-none" placeholder="Search roles, skills, companies" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-950/45 px-4 py-3">
                <Building2 className="size-4 text-amber-300" />
                <input className="w-full bg-transparent text-sm text-slate-100 outline-none" placeholder="Location or remote" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <Link href={`/jobs?keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`} className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-300">
                Search jobs
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="chip">Full-time</span>
              <span className="chip">Remote friendly</span>
              <span className="chip">Recruiter analytics</span>
              <span className="chip">Resume-ready applications</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="glass-panel p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <TrendingUp className="size-8 text-teal-300" />
                <h3 className="mt-4 text-lg font-semibold text-white">Recruiter momentum</h3>
                <p className="mt-2 text-sm text-slate-400">Post roles, track applicants, and move decisions without spreadsheet drift.</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <ShieldCheck className="size-8 text-amber-300" />
                <h3 className="mt-4 text-lg font-semibold text-white">Secure by default</h3>
                <p className="mt-2 text-sm text-slate-400">JWT auth, resume validation, rate limiting, and protected route flows.</p>
              </div>
            </div>
            <div className="mt-4 rounded-[28px] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-teal-300">Why teams switch</p>
              <div className="mt-4 grid gap-4 text-sm text-slate-200">
                <div className="flex items-start gap-3"><span className="mt-1 size-2 rounded-full bg-teal-300" /> Role-based dashboards that feel purpose-built instead of generic.</div>
                <div className="flex items-start gap-3"><span className="mt-1 size-2 rounded-full bg-teal-300" /> Search, application tracking, saved jobs, and resume management connected end to end.</div>
                <div className="flex items-start gap-3"><span className="mt-1 size-2 rounded-full bg-teal-300" /> Production-ready architecture for deployment on Vercel plus Railway or Render.</div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="py-6">
          <SectionHeading eyebrow="Categories" title="Explore high-signal hiring lanes" description="Curated categories help candidates browse faster and keep recruiter job metadata consistent." />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {categories.slice(0, 8).map((category) => (
              <Link key={category.id} href={`/jobs?categoryId=${category.id}`} className="glass-panel card-hover p-6">
                <div className="chip mb-4">{category.name}</div>
                <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                <p className="mt-2 text-sm text-slate-400">Browse active roles and recruiter-posted opportunities in {category.name}.</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="py-16">
          <SectionHeading eyebrow="Featured roles" title="Fresh opportunities from active recruiters" description="A preview of the latest highlighted jobs across the platform." action={<Link href="/jobs" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10">View all jobs <ArrowRight className="size-4" /></Link>} />
          <div className="grid gap-5 lg:grid-cols-3">
            {featuredJobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
