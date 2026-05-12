"use client";

import { useEffect, useState } from "react";

import { ProtectedView } from "@/components/common/ProtectedView";
import RecruiterDashboard from "@/components/dashboard/RecruiterDashboard";
import SeekerDashboard from "@/components/dashboard/SeekerDashboard";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Category } from "@/lib/types";
import * as jobService from "@/services/jobService";

export default function DashboardPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    jobService.getCategories().then(setCategories).catch(() => undefined);
  }, []);

  return (
    <ProtectedView>
      <Navbar />
      <main className="shell py-12">
        {user?.role === "recruiter" ? <RecruiterDashboard categories={categories} /> : <SeekerDashboard />}
      </main>
    </ProtectedView>
  );
}
