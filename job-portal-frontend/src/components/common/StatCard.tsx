import { ReactNode } from "react";

export function StatCard({ label, value, icon, accent }: { label: string; value: string | number; icon: ReactNode; accent?: string }) {
  return (
    <div className="glass-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <div className={`rounded-2xl p-3 ${accent || "bg-teal-400/10 text-teal-300"}`}>{icon}</div>
      </div>
      <div className="font-[family-name:var(--font-display)] text-3xl font-semibold text-white">{value}</div>
    </div>
  );
}
