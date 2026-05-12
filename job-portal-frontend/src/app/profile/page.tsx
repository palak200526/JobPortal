"use client";

import { useEffect, useState } from "react";

import { ProtectedView } from "@/components/common/ProtectedView";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Navbar } from "@/components/layout/Navbar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { User } from "@/lib/types";
import * as userService from "@/services/userService";

export default function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    userService.getProfile().then(setProfile).catch(() => undefined);
  }, []);

  return (
    <ProtectedView>
      <Navbar />
      <main className="shell py-12">
        <SectionHeading eyebrow="Profile" title="Keep your account sharp" description="Update your candidate or recruiter profile so jobs, applications, and outreach stay accurate." />
        {profile ? <ProfileForm initialProfile={profile} /> : <div className="glass-panel h-72 animate-pulse" />}
      </main>
    </ProtectedView>
  );
}
