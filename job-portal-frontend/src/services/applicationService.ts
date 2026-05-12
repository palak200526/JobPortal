import { api } from "./api";

import { ApiSuccess, Application } from "@/lib/types";

export async function applyToJob(payload: { jobId: number; coverLetter?: string }) {
  const response = await api.post<ApiSuccess<Application>>("/applications", payload);
  return response.data.data;
}

export async function getMyApplications(status?: string) {
  const response = await api.get<ApiSuccess<Application[]>>("/applications/my", {
    params: { status },
  });
  return response.data.data;
}

export async function withdrawApplication(applicationId: number) {
  await api.patch(`/applications/${applicationId}/withdraw`);
}

export async function updateApplicationStatus(applicationId: number, payload: { status: string; note?: string }) {
  const response = await api.patch<ApiSuccess<Application>>(`/applications/${applicationId}/status`, payload);
  return response.data.data;
}
