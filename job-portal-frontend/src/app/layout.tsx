import type { Metadata } from "next";

import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "AuraJobs",
  description: "Production-ready job portal for recruiters and job seekers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-[var(--color-bg)] text-[var(--color-text)] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
