"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/lib/types";

export function ProtectedView({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: UserRole[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!isLoading && user && roles && !roles.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [isLoading, pathname, roles, router, user]);

  if (isLoading || !user || (roles && !roles.includes(user.role))) {
    return (
      <div className="shell py-16">
        <div className="glass-panel animate-pulse p-10">
          <div className="h-6 w-56 rounded-full bg-white/10" />
          <div className="mt-4 h-24 rounded-3xl bg-white/5" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
