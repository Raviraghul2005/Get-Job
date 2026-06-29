import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAuthActions } from "@insforge/sdk/ssr";
import { randomUUID } from "crypto";
import { getPostHogClient } from "@/lib/posthog-server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("insforge_code");
  const error = searchParams.get("error");

  const origin = request.nextUrl.origin;

  if (error) {
    console.error("OAuth callback returned error parameter:", error);
    getPostHogClient().capture({
      distinctId: randomUUID(),
      event: "auth_callback_failed",
      properties: { reason: "error_param", error },
    });
    return NextResponse.redirect(new URL("/login?error=auth_failed", origin));
  }

  if (code) {
    try {
      const cookieStore = await cookies();
      const verifier = cookieStore.get("insforge_oauth_verifier")?.value;

      const authActions = createAuthActions({
        baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
        anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
        cookies: cookieStore,
      });

      const { error: exchangeError } = await authActions.exchangeOAuthCode(code, verifier);
      
      // Clean up the temporary verifier cookie
      try {
        cookieStore.delete("insforge_oauth_verifier");
      } catch {
        // Ignore deletion errors
      }

      if (exchangeError) {
        console.error("OAuth code exchange failed:", exchangeError);
        getPostHogClient().capture({
          distinctId: randomUUID(),
          event: "auth_callback_failed",
          properties: { reason: "exchange_failed", error: (exchangeError as { message?: string }).message ?? String(exchangeError) },
        });
        return NextResponse.redirect(new URL("/login?error=auth_failed", origin));
      }
    } catch (err) {
      console.error("Exception during OAuth code exchange:", err);
      getPostHogClient().capture({
        distinctId: randomUUID(),
        event: "auth_callback_failed",
        properties: { reason: "exception", error: err instanceof Error ? err.message : String(err) },
      });
      return NextResponse.redirect(new URL("/login?error=auth_failed", origin));
    }
  } else {
    // If no code, check if we're already authenticated
    const cookieStore = await cookies();
    const token = cookieStore.get("insforge_access_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", origin));
    }
  }

  // Redirect to profile page per user's request
  return NextResponse.redirect(new URL("/profile", origin));
}
