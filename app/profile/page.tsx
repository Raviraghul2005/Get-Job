import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { redirect } from "next/navigation";
import { PostHogPageView } from "@/components/PostHogPageView";

export default async function ProfilePage() {
  let user = null;
  try {
    const insforge = await createInsforgeServer();
    const { data } = await insforge.auth.getCurrentUser();
    user = data?.user ?? null;
  } catch {
    // Fail-safe redirect handled by middleware proxy
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen bg-background bg-stripes">
      <PostHogPageView eventName="profile_viewed" />
      <Navbar />
      
      <main className="flex-grow max-w-[1400px] mx-auto w-full px-6 md:px-8 py-10">
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center text-white text-2xl font-semibold">
              {(user.profile?.name ?? user.email ?? "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">
                {user.profile?.name ?? "User Profile"}
              </h1>
              <p className="text-sm text-text-secondary">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Profile Details (Under Construction)</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Your account has been successfully created and linked with {user.providers?.join(" & ") || "OAuth"}.
              This page is a placeholder for your career profile details, work experience, resume upload, and preference form (Phase 2).
            </p>
            <div className="bg-surface-secondary border border-border-light rounded-xl p-4 mt-6">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider block mb-1">Developer Notice</span>
              <p className="text-xs text-text-secondary">
                Authentication completed successfully. Cookie-based sessions are fully wired.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
