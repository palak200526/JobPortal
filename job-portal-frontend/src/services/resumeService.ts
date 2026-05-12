import { api } from "./api";

import { ApiSuccess, Resume } from "@/lib/types";

export async function getResume() {
  const response = await api.get<ApiSuccess<Resume | null>>("/resume");
  return response.data.data;
}

export async function uploadResume(file: File, onProgress?: (progress: number) => void) {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await api.post<ApiSuccess<Resume>>("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress(event) {
      if (!event.total || !onProgress) {
        return;
      }

      onProgress(Math.round((event.loaded * 100) / event.total));
    },
  });

  return response.data.data;
}

export async function deleteResume() {
  await api.delete("/resume");
}
