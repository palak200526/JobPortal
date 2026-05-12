export type UserRole = "recruiter" | "seeker" | "admin";

export interface Resume {
  id: number;
  file_name: string;
  file_path: string;
  mime_type: string;
  file_size: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  headline?: string | null;
  location?: string | null;
  bio?: string | null;
  skills?: string | null;
  companyName?: string | null;
  companyWebsite?: string | null;
  roleTitle?: string | null;
  resume?: Resume | null;
  createdAt?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Job {
  id: number;
  job_id?: number;
  recruiter_id?: number;
  title: string;
  company: string;
  description?: string;
  location: string;
  salary_min?: number | null;
  salary_max?: number | null;
  experience_level?: string | null;
  experience_years?: number | null;
  category_name?: string | null;
  category_id?: number | null;
  job_type: string;
  workplace_type: string;
  skills?: string | null;
  deadline?: string | null;
  status?: string;
  is_featured?: boolean;
  is_saved?: boolean;
  has_applied?: boolean;
  applicant_count?: number;
  created_at?: string;
  recruiter_name?: string;
  company_name?: string;
  company_website?: string;
}

export interface ApplicationHistoryItem {
  id: number;
  status: string;
  note?: string | null;
  created_at: string;
  changed_by_name: string;
}

export interface Application {
  id: number;
  status: string;
  cover_letter?: string | null;
  created_at: string;
  updated_at: string;
  job_id?: number;
  title?: string;
  company?: string;
  location?: string;
  job_type?: string;
  workplace_type?: string;
  history?: ApplicationHistoryItem[];
  user_id?: number;
  name?: string;
  email?: string;
  headline?: string | null;
  skills?: string | null;
  file_name?: string | null;
  file_path?: string | null;
}

export interface Analytics {
  totals: {
    totalJobs: number;
    activeJobs: number;
    closedJobs: number;
    totalApplicants: number;
  };
  recentApplications: Array<{
    id: number;
    status: string;
    created_at: string;
    name: string;
    title: string;
  }>;
}

export interface Paginated<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}
