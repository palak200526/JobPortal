"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [role, setRole] = useState<"seeker" | "recruiter">("seeker");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    headline: "",
    location: "",
    skills: "",
    companyName: "",
    companyWebsite: "",
    roleTitle: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: Record<string, string> = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        headline: form.headline.trim(),
        location: form.location.trim(),
        role,
      };

      if (role === "seeker") {
        payload.skills = form.skills.trim();
      } else {
        payload.companyName = form.companyName.trim();
        payload.companyWebsite = form.companyWebsite.trim();
        payload.roleTitle = form.roleTitle.trim();
      }

      await signup(payload);
      toast.success("Welcome to AuraJobs");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="shell py-12">
        <div className="mx-auto max-w-3xl glass-panel p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-teal-300">Signup</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold text-white">Create a production-ready recruiting profile</h1>
          <p className="mt-3 text-slate-300">Choose your role and we’ll route you into the right workspace immediately after signup.</p>

          <div className="mt-8 inline-flex rounded-full border border-white/10 bg-white/5 p-1">
            <button onClick={() => setRole("seeker")} className={`rounded-full px-5 py-2 text-sm transition ${role === "seeker" ? "bg-white text-slate-950" : "text-slate-200"}`}>Job seeker</button>
            <button onClick={() => setRole("recruiter")} className={`rounded-full px-5 py-2 text-sm transition ${role === "recruiter" ? "bg-white text-slate-950" : "text-slate-200"}`}>Recruiter</button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
            <input className="field" placeholder="Full name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
            <input className="field" type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
            <input className="field" type="password" placeholder="Strong password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} required />
            <input className="field" placeholder="Location" value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))} />
            <input className="field md:col-span-2" placeholder="Headline" value={form.headline} onChange={(e) => setForm((prev) => ({ ...prev, headline: e.target.value }))} />

            {role === "seeker" ? (
              <textarea className="field md:col-span-2 min-h-32" placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm((prev) => ({ ...prev, skills: e.target.value }))} />
            ) : (
              <>
                <input className="field" placeholder="Company name" value={form.companyName} onChange={(e) => setForm((prev) => ({ ...prev, companyName: e.target.value }))} required />
                <input className="field" placeholder="Role title" value={form.roleTitle} onChange={(e) => setForm((prev) => ({ ...prev, roleTitle: e.target.value }))} required />
                <input className="field md:col-span-2" placeholder="Company website" value={form.companyWebsite} onChange={(e) => setForm((prev) => ({ ...prev, companyWebsite: e.target.value }))} />
              </>
            )}

            <button disabled={isSubmitting} className="md:col-span-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-teal-300 disabled:opacity-70">
              {isSubmitting ? "Creating account..." : `Create ${role} account`}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Already registered?{" "}
            <Link href="/login" className="text-teal-300 hover:text-teal-200">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
