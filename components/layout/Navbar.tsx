import Link from "next/link";
import Image from "next/image";
import { createInsforgeServer } from "@/lib/insforge-server";
import { SignOutButton } from "./SignOutButton";
import { PostHogIdentify } from "@/components/PostHogUser";

export async function Navbar() {
  let user = null;

  try {
    const insforge = await createInsforgeServer();
    const { data } = await insforge.auth.getCurrentUser();
    user = data?.user ?? null;
  } catch {
    // Not authenticated — user stays null
  }

  return (
    <header className="w-full bg-surface border-b border-border h-16 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto h-full px-6 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <Image
            src="/images/logo.png"
            alt="JobPilot"
            width={106}
            height={36}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-text-dark hover:text-accent transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/find-jobs"
            className="text-sm font-medium text-text-dark hover:text-accent transition-colors"
          >
            Find Jobs
          </Link>
          <Link
            href="/profile"
            className="text-sm font-medium text-text-dark hover:text-accent transition-colors"
          >
            Profile
          </Link>
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <PostHogIdentify
                userId={user.email}
                email={user.email}
                name={user.profile?.name}
              />
              {/* User info */}
              <div className="hidden sm:flex items-center gap-2">
                {user.profile?.avatar_url ? (
                  <Image
                    src={user.profile.avatar_url}
                    alt={user.profile?.name ?? "User"}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-medium">
                    {(user.profile?.name ?? user.email ?? "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-text-primary max-w-[120px] truncate">
                  {user.profile?.name ?? user.email}
                </span>
              </div>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center bg-text-darkest hover:bg-overlay-dark text-white text-sm font-medium rounded-md px-4 py-2 transition-colors h-9"
            >
              Start for free
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
