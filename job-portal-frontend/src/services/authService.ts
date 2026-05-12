import { api } from "./api";

import { ApiSuccess, User } from "@/lib/types";

interface AuthPayload {
  token: string;
  user: User;
}

export async function signup(payload: Record<string, unknown>) {
  const response = await api.post<ApiSuccess<AuthPayload>>("/auth/signup", payload);
  return response.data.data;
}

export async function login(payload: { email: string; password: string }) {
  const response = await api.post<ApiSuccess<AuthPayload>>("/auth/login", payload);
  return response.data.data;
}

export async function fetchCurrentUser() {
  const response = await api.get<ApiSuccess<User>>("/auth/me");
  return response.data.data;
}

export async function logout() {
  await api.post("/auth/logout");
}
