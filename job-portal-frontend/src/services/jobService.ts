import { api } from "./api";

import { ApiSuccess, Application, Category, Job, Paginated } from "@/lib/types";

export async function getFeaturedJobs() {
  const response = await api.get<ApiSuccess<Job[]>>("/jobs/featured");
  return response.data.data;
}

export async function getCategories() {
  const response = await api.get<ApiSuccess<Category[]>>("/categories");
  return response.data.data;
}

export async function getJobs(params?: Record<string, string | number | undefined>) {
  const response = await api.get<ApiSuccess<Paginated<Job>>>("/jobs", { params });
  return response.data.data;
}

export async function getJobById(jobId: number) {
  const response = await api.get<ApiSuccess<Job>>(`/jobs/${jobId}`);
  return response.data.data;
}

export async function createJob(payload: Record<string, unknown>) {
  const response = await api.post<ApiSuccess<Job>>("/jobs", payload);
  return response.data.data;
}

export async function updateJob(jobId: number, payload: Record<string, unknown>) {
  const response = await api.put<ApiSuccess<Job>>(`/jobs/${jobId}`, payload);
  return response.data.data;
}

export async function closeJob(jobId: number) {
  const response = await api.patch<ApiSuccess<Job>>(`/jobs/${jobId}/close`);
  return response.data.data;
}

export async function deleteJob(jobId: number) {
  await api.delete(`/jobs/${jobId}`);
}

export async function featureJob(jobId: number, isFeatured: boolean) {
  const response = await api.patch<ApiSuccess<Job>>(`/jobs/${jobId}/feature`, { isFeatured });
  return response.data.data;
}

export async function getRecruiterJobs(params?: Record<string, string | number | undefined>) {
  const response = await api.get<ApiSuccess<Paginated<Job>>>("/jobs/recruiter/mine", { params });
  return response.data.data;
}

export async function getApplicants(jobId: number) {
  const response = await api.get<ApiSuccess<Application[]>>(`/jobs/${jobId}/applicants`);
  return response.data.data;
}
