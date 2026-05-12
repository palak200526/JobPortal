import { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="mb-2 text-xs uppercase tracking-[0.32em] text-teal-300">{eyebrow}</p> : null}
        <h2 className="section-title">{title}</h2>
        {description ? <p className="mt-3 text-slate-300">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
