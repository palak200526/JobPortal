"use client";

import { Category } from "@/lib/types";
import { EXPERIENCE_LEVELS, JOB_TYPES, WORKPLACE_TYPES } from "@/lib/constants";

interface JobFiltersProps {
  filters: {
    keyword: string;
    location: string;
    categoryId: string;
    jobType: string;
    workplaceType: string;
    experienceLevel: string;
    salaryMin: string;
    sortBy: string;
  };
  categories: Category[];
  onChange: (field: string, value: string) => void;
  onReset: () => void;
}

export function JobFilters({ filters, categories, onChange, onReset }: JobFiltersProps) {
  return (
    <div className="glass-panel p-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <input className="field" placeholder="Keyword, title, company" value={filters.keyword} onChange={(e) => onChange("keyword", e.target.value)} />
        <input className="field" placeholder="Location" value={filters.location} onChange={(e) => onChange("location", e.target.value)} />
        <select className="field" value={filters.categoryId} onChange={(e) => onChange("categoryId", e.target.value)}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={String(category.id)}>{category.name}</option>
          ))}
        </select>
        <select className="field" value={filters.jobType} onChange={(e) => onChange("jobType", e.target.value)}>
          <option value="">Any job type</option>
          {JOB_TYPES.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select className="field" value={filters.workplaceType} onChange={(e) => onChange("workplaceType", e.target.value)}>
          <option value="">Any workplace</option>
          {WORKPLACE_TYPES.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select className="field" value={filters.experienceLevel} onChange={(e) => onChange("experienceLevel", e.target.value)}>
          <option value="">Any level</option>
          {EXPERIENCE_LEVELS.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <input className="field" placeholder="Minimum salary" type="number" value={filters.salaryMin} onChange={(e) => onChange("salaryMin", e.target.value)} />
        <select className="field" value={filters.sortBy} onChange={(e) => onChange("sortBy", e.target.value)}>
          <option value="">Newest</option>
          <option value="salary">Highest salary</option>
          <option value="deadline">Closest deadline</option>
        </select>
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={onReset} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">
          Reset filters
        </button>
      </div>
    </div>
  );
}
