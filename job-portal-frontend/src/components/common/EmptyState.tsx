export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="glass-panel flex min-h-48 flex-col items-center justify-center p-8 text-center">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 max-w-md text-slate-400">{description}</p>
    </div>
  );
}
