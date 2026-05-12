import { api } from "./api";

import { Analytics, ApiSuccess, User } from "@/lib/types";

export async function getProfile() {
  const response = await api.get<ApiSuccess<User>>("/users/profile");
  return response.data.data;
}

export async function updateProfile(payload: Record<string, unknown>) {
  const response = await api.patch<ApiSuccess<User>>("/users/profile", payload);
  return response.data.data;
}

export async function getRecruiterAnalytics() {
  const response = await api.get<ApiSuccess<Analytics>>("/analytics/recruiter");
  return response.data.data;
}
