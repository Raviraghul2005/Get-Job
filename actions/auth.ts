"use server";

import { createAuthActions } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOut() {
  const cookieStore = await cookies();

  const authActions = createAuthActions({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: cookieStore,
  });

  await authActions.signOut();
  redirect("/");
}

export async function getOAuthUrl(provider: "google" | "github", redirectTo: string) {
  const cookieStore = await cookies();

  const authActions = createAuthActions({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: cookieStore,
  });

  const { data, error } = await authActions.signInWithOAuth(provider, {
    redirectTo,
    skipBrowserRedirect: true,
  });

  if (error || !data?.url) {
    throw new Error(error?.message || "Failed to generate OAuth URL");
  }

  if (data.codeVerifier) {
    cookieStore.set("insforge_oauth_verifier", data.codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10, // 10 minutes
      sameSite: "lax",
    });
  }

  return data.url;
}
