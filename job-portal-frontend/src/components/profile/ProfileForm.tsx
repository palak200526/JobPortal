"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "@/hooks/useAuth";
import { User } from "@/lib/types";
import * as userService from "@/services/userService";

export function ProfileForm({ initialProfile }: { initialProfile: User }) {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState<Record<string, string>>({
    name: "",
    phone: "",
    headline: "",
    location: "",
    bio: "",
    skills: "",
    companyName: "",
    companyWebsite: "",
    roleTitle: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: initialProfile.name || "",
      phone: initialProfile.phone || "",
      headline: initialProfile.headline || "",
      location: initialProfile.location || "",
      bio: initialProfile.bio || "",
      skills: initialProfile.skills || "",
      companyName: initialProfile.companyName || "",
      companyWebsite: initialProfile.companyWebsite || "",
      roleTitle: initialProfile.roleTitle || "",
    });
  }, [initialProfile]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]));

      if (user?.role !== "recruiter") {
        delete payload.companyWebsite;
        delete payload.companyName;
        delete payload.roleTitle;
      }

      if (user?.role !== "seeker") {
        delete payload.skills;
      }

      await userService.updateProfile(payload);
      await refreshUser();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Profile update failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <input className="field" placeholder="Full name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
        <input className="field" placeholder="Phone number" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
        <input className="field" placeholder="Professional headline" value={form.headline} onChange={(e) => setForm((prev) => ({ ...prev, headline: e.target.value }))} />
        <input className="field" placeholder="Location" value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))} />
      </div>

      <textarea className="field mt-4 min-h-32" placeholder="Bio" value={form.bio} onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))} />

      {user?.role === "seeker" ? (
        <textarea className="field mt-4 min-h-28" placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm((prev) => ({ ...prev, skills: e.target.value }))} />
      ) : null}

      {user?.role === "recruiter" ? (
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <input className="field" placeholder="Company name" value={form.companyName} onChange={(e) => setForm((prev) => ({ ...prev, companyName: e.target.value }))} />
          <input className="field" placeholder="Company website" value={form.companyWebsite} onChange={(e) => setForm((prev) => ({ ...prev, companyWebsite: e.target.value }))} />
          <input className="field" placeholder="Role title" value={form.roleTitle} onChange={(e) => setForm((prev) => ({ ...prev, roleTitle: e.target.value }))} />
        </div>
      ) : null}

      <div className="mt-6 flex justify-end">
        <button disabled={isSaving} className="rounded-full bg-white px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-teal-300 disabled:opacity-70">
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
