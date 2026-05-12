export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 py-10">
      <div className="shell flex flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <p>AuraJobs is built for modern recruiters and ambitious candidates.</p>
        <div className="flex gap-6">
          <span>Role-based dashboards</span>
          <span>Resume workflows</span>
          <span>Application tracking</span>
        </div>
      </div>
    </footer>
  );
}
