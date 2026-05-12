import { api } from "./api";

import { ApiSuccess } from "@/lib/types";
import type { Job } from "@/lib/types";

export async function getSavedJobs() {
  const response = await api.get<ApiSuccess<Job[]>>("/saved-jobs");
  return response.data.data;
}

export async function saveJob(jobId: number) {
  await api.post(`/saved-jobs/${jobId}`);
}

export async function removeSavedJob(jobId: number) {
  await api.delete(`/saved-jobs/${jobId}`);
}
