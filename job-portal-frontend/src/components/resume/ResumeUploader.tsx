"use client";

import { useRef, useState } from "react";
import { FileText, Trash2, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";

import { Resume } from "@/lib/types";
import { getAssetUrl } from "@/utils/formatters";
import * as resumeService from "@/services/resumeService";

export function ResumeUploader({
  resume,
  onUploaded,
}: {
  resume?: Resume | null;
  onUploaded: () => Promise<void> | void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file?: File) => {
    if (!file) {
      return;
    }

    const allowedExtensions = ["pdf", "doc", "docx"];
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!extension || !allowedExtensions.includes(extension)) {
      toast.error("Please upload a PDF, DOC, or DOCX file");
      return;
    }

    setIsUploading(true);

    try {
      await resumeService.uploadResume(file, setProgress);
      toast.success("Resume uploaded successfully");
      await onUploaded();
      setProgress(0);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    await resumeService.deleteResume();
    toast.success("Resume deleted");
    await onUploaded();
  };

  return (
    <div className="glass-panel p-6">
      <div
        className={`rounded-[26px] border border-dashed p-8 text-center transition ${isDragging ? "border-teal-300 bg-teal-400/8" : "border-white/15 bg-slate-950/35"}`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          uploadFile(event.dataTransfer.files?.[0]);
        }}
      >
        <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-teal-400/10 text-teal-300">
          <UploadCloud className="size-7" />
        </div>
        <h3 className="mt-5 text-xl font-semibold text-white">Upload or replace your resume</h3>
        <p className="mt-3 text-sm text-slate-400">Drag and drop a resume or browse from your device. Max file size: 5MB.</p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(event) => uploadFile(event.target.files?.[0])}
        />

        <button
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="mt-6 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isUploading ? `Uploading ${progress}%` : resume ? "Replace resume" : "Select resume"}
        </button>

        {isUploading ? (
          <div className="mx-auto mt-4 h-2 max-w-md rounded-full bg-white/10">
            <div className="h-2 rounded-full bg-teal-300 transition-all" style={{ width: `${progress}%` }} />
          </div>
        ) : null}
      </div>

      {resume ? (
        <div className="mt-5 flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/10 p-3 text-slate-100">
              <FileText className="size-5" />
            </div>
            <div>
              <div className="font-medium text-white">{resume.file_name}</div>
              <div className="text-sm text-slate-400">{Math.round(resume.file_size / 1024)} KB</div>
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href={getAssetUrl(resume.file_path)}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10"
            >
              Preview
            </a>
            <button onClick={handleDelete} className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400">
              <span className="inline-flex items-center gap-2"><Trash2 className="size-4" /> Delete</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
