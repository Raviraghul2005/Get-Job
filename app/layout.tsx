import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://get-job-eta.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "JobPilot - AI-Powered Job Hunting Assistant",
    template: "%s | JobPilot",
  },
  description: "Stop applying blind. JobPilot finds the jobs, researches the companies, and matches your profile in seconds.",
  openGraph: {
    title: "JobPilot - AI-Powered Job Hunting Assistant",
    description: "Stop applying blind. JobPilot finds the jobs, researches the companies, and matches your profile in seconds.",
    siteName: "JobPilot",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "JobPilot Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JobPilot - AI-Powered Job Hunting Assistant",
    description: "Stop applying blind. JobPilot finds the jobs, researches the companies, and matches your profile in seconds.",
    images: ["/images/dashboard-demo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

