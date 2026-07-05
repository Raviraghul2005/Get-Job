import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { redirect } from "next/navigation";
import { PostHogPageView } from "@/components/PostHogPageView";
import { CompletionBanner } from "@/components/profile/CompletionBanner";
import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { calculateCompletion } from "@/actions/profile";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  let user = null;
  let profile = null;

  try {
    const insforge = await createInsforgeServer();
    const { data: userData } = await insforge.auth.getCurrentUser();
    user = userData?.user ?? null;

    if (user) {
      const { data: profileData } = await insforge.database
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      
      profile = profileData;
    }
  } catch (error) {
    console.error("[profile/page] Error fetching profile data:", error);
  }

  if (!user) {
    redirect("/login");
  }

  const { percentage, missingFields } = await calculateCompletion(profile || {});

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PostHogPageView eventName="profile_viewed" />
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto w-full px-6 md:px-8 py-10">
        <div className="space-y-6">
          <CompletionBanner
            percentage={percentage}
            missingFields={missingFields}
          />

          <ProfileContainer
            email={user.email ?? ""}
            initialProfile={profile}
            initialPercentage={percentage}
            initialMissingFields={missingFields}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
