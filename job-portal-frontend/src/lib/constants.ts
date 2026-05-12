export const APP_NAME = "AuraJobs";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const ASSET_BASE_URL = process.env.NEXT_PUBLIC_ASSET_URL || "http://localhost:5000";

export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"] as const;
export const WORKPLACE_TYPES = ["Remote", "Hybrid", "On-site"] as const;
export const EXPERIENCE_LEVELS = ["Entry", "Mid", "Senior", "Lead"] as const;
export const APPLICATION_STATUSES = ["Applied", "Under Review", "Shortlisted", "Accepted", "Rejected", "Withdrawn"] as const;
