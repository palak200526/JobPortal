import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AuraJobs | Find Your Dream Career",
  description: "The most advanced platform to discover opportunities and accelerate your career. Find jobs, research companies, and get hired.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
      >
        <ThemeProvider attribute="data-theme" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
