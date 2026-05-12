"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const user = await login({ email, password });
      toast.success(`Welcome back, ${user.name}`);
      router.push(searchParams.get("redirect") || "/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="shell grid min-h-[calc(100vh-88px)] place-items-center py-12">
        <div className="glass-panel w-full max-w-xl p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-teal-300">Login</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold text-white">Continue your hiring or job search</h1>
          <p className="mt-3 text-slate-300">Access role-specific dashboards, saved jobs, applications, and resume tools.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input className="field" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button disabled={isSubmitting} className="w-full rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-teal-300 disabled:opacity-70">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Need an account?{" "}
            <Link href="/signup" className="text-teal-300 hover:text-teal-200">
              Create one here
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
