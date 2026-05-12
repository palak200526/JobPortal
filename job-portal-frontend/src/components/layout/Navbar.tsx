"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

import { APP_NAME } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("You have been logged out");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/65 backdrop-blur-xl">
      <div className="shell flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-2xl border border-teal-400/30 bg-teal-400/10 p-2 text-teal-300">
            <Sparkles className="size-5" />
          </div>
          <div>
            <div className="font-[family-name:var(--font-display)] text-xl font-semibold text-white">{APP_NAME}</div>
            <div className="text-xs text-slate-400">Hiring, refined.</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href="/jobs" className="transition hover:text-white">
            Browse Jobs
          </Link>
          {user?.role === "seeker" ? (
            <Link href="/saved-jobs" className="transition hover:text-white">
              Saved Jobs
            </Link>
          ) : null}
          {user ? (
            <Link href="/profile" className="transition hover:text-white">
              Profile
            </Link>
          ) : null}
          <Link href="/jobs?workplaceType=Remote" className="transition hover:text-white">
            Remote
          </Link>
          <Link href="/dashboard" className="transition hover:text-white">
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 sm:block">
                {user.name}
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10"
              >
                <LayoutDashboard className="size-4" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/8">
                Login
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-300"
              >
                <BriefcaseBusiness className="size-4" />
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
