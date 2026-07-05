import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";

export async function GET(req: NextRequest) {
  try {
    const insforge = await createInsforgeServer();
    const { data: userData, error: authError } = await insforge.auth.getCurrentUser();

    if (authError || !userData?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = userData.user.id;

    // Download the PDF from private resumes bucket
    const { data: fileBlob, error: downloadError } = await insforge.storage
      .from("resumes")
      .download(`resumes/${userId}/resume.pdf`);

    if (downloadError || !fileBlob) {
      console.error("[api/resume/download] Download error:", downloadError);
      return NextResponse.json(
        { success: false, error: "Resume file not found" },
        { status: 404 }
      );
    }

    // Stream the PDF back to the browser
    return new Response(fileBlob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=\"resume.pdf\"",
      },
    });
  } catch (error) {
    console.error("[api/resume/download] Unexpected error downloading resume:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
