"use client";

import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@/context/AuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#101a2c",
            color: "#f8fafc",
            border: "1px solid rgba(148, 163, 184, 0.18)",
          },
        }}
      />
    </AuthProvider>
  );
}
