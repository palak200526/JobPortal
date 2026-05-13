import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Job } from "@/lib/types";
import * as savedJobService from "@/services/savedJobService";

import { JobCard } from "./JobCard";

const mocks = vi.hoisted(() => ({
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
  useAuth: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: mocks.toastSuccess,
    error: mocks.toastError,
  },
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => mocks.useAuth(),
}));

vi.mock("@/services/savedJobService", () => ({
  saveJob: vi.fn(),
}));

const job: Job = {
  id: 42,
  title: "Frontend Developer",
  company: "TechHire Solutions",
  location: "Bangalore, India",
  salary_min: 600000,
  salary_max: 1200000,
  experience_level: "Mid",
  experience_years: 2,
  job_type: "Full-time",
  workplace_type: "Hybrid",
  category_id: 1,
  category_name: "Engineering",
  is_featured: true,
  is_saved: false,
  has_applied: false,
  status: "active",
  deadline: "2026-06-30T00:00:00.000Z",
  created_at: "2026-05-12T00:00:00.000Z",
  description: "Build polished recruiting experiences for job seekers and recruiters.",
  company_website: "https://techhire.example",
  recruiter_name: "Hiring Lead",
  company_name: "TechHire Solutions",
  applicant_count: 3,
  skills: "React, TypeScript",
};

describe("JobCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useAuth.mockReturnValue({ user: null });
  });

  it("renders the job details and details link", () => {
    render(<JobCard job={job} />);

    expect(screen.getByRole("heading", { name: "Frontend Developer" })).toBeInTheDocument();
    expect(screen.getByText("TechHire Solutions")).toBeInTheDocument();
    expect(screen.getByText("Bangalore, India")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Featured")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View details" })).toHaveAttribute("href", "/jobs/42");
  });

  it("lets a job seeker save a job", async () => {
    const user = userEvent.setup();
    const onSaved = vi.fn();
    vi.mocked(savedJobService.saveJob).mockResolvedValue(undefined);
    mocks.useAuth.mockReturnValue({ user: { id: 7, role: "seeker" } });

    render(<JobCard job={job} onSaved={onSaved} />);

    await user.click(screen.getByRole("button", { name: "Save Frontend Developer" }));

    expect(savedJobService.saveJob).toHaveBeenCalledWith(42);
    expect(mocks.toastSuccess).toHaveBeenCalledWith("Job saved successfully");
    expect(onSaved).toHaveBeenCalledTimes(1);
  });
});
