"use server";

import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";

export type ProfileUpdateData = {
  fullName: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  portfolioUrl: string;
  workAuthorization: string;
  currentTitle: string;
  experienceLevel: string;
  yearsExperience: number;
  skills: string[];
  industries: string[];
  workExperience: Array<{
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    responsibilities: string;
  }>;
  education: {
    degree: string;
    fieldOfStudy: string;
    institution: string;
    graduationYear: string;
  };
  jobTitlesSeeking: string[];
  remotePreference: string;
  salaryExpectation: string;
  preferredLocations: string[];
};

export async function calculateCompletion(profile: {
  full_name?: string | null;
  phone?: string | null;
  location?: string | null;
  current_title?: string | null;
  experience_level?: string | null;
  years_experience?: number | null;
  skills?: string[] | null;
  education?: any;
  job_titles_seeking?: string[] | null;
}) {
  const missing: string[] = [];
  let score = 0;

  // 1. Full name
  if (profile.full_name?.trim()) {
    score += 10;
  } else {
    missing.push("FULL NAME");
  }

  // 2. Phone
  if (profile.phone?.trim()) {
    score += 10;
  } else {
    missing.push("PHONE");
  }

  // 3. Location
  if (profile.location?.trim()) {
    score += 10;
  } else {
    missing.push("LOCATION");
  }

  // 4. Current Title
  if (profile.current_title?.trim()) {
    score += 10;
  } else {
    missing.push("CURRENT JOB TITLE");
  }

  // 5. Experience Level
  if (profile.experience_level?.trim()) {
    score += 10;
  } else {
    missing.push("EXPERIENCE LEVEL");
  }

  // 6. Years of Experience
  if (profile.years_experience !== null && profile.years_experience !== undefined) {
    score += 10;
  } else {
    missing.push("YEARS OF EXPERIENCE");
  }

  // 7. Skills
  if (Array.isArray(profile.skills) && profile.skills.length > 0) {
    score += 10;
  } else {
    missing.push("SKILLS");
  }

  // 8. Education
  const hasEducation = Array.isArray(profile.education) &&
    profile.education.length > 0 &&
    profile.education[0]?.institution?.trim();
  if (hasEducation) {
    score += 10;
  } else {
    missing.push("EDUCATION");
  }

  // 9. Job Titles Seeking
  if (Array.isArray(profile.job_titles_seeking) && profile.job_titles_seeking.length > 0) {
    score += 10;
  } else {
    missing.push("JOB PREFERENCES");
  }

  // 10. Remote Preference (always present in form dropdown, but check anyway)
  score += 10;

  return {
    percentage: score,
    missingFields: missing,
    isComplete: score === 100,
  };
}

export async function saveProfile(data: ProfileUpdateData) {
  try {
    const insforge = await createInsforgeServer();
    const { data: userData, error: authError } = await insforge.auth.getCurrentUser();
    
    if (authError || !userData?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = userData.user.id;

    // Build profile object for calculation
    const profileData = {
      full_name: data.fullName,
      phone: data.phone,
      location: data.location,
      current_title: data.currentTitle,
      experience_level: data.experienceLevel,
      years_experience: data.yearsExperience,
      skills: data.skills,
      education: [data.education],
      job_titles_seeking: data.jobTitlesSeeking,
    };

    const { percentage, isComplete } = await calculateCompletion(profileData);

    const { error: dbError } = await insforge.database
      .from("profiles")
      .upsert({
        id: userId,
        email: userData.user.email,
        full_name: data.fullName,
        phone: data.phone,
        location: data.location,
        linkedin_url: data.linkedinUrl,
        portfolio_url: data.portfolioUrl,
        work_authorization: data.workAuthorization,
        current_title: data.currentTitle,
        experience_level: data.experienceLevel,
        years_experience: data.yearsExperience,
        skills: data.skills,
        industries: data.industries,
        work_experience: data.workExperience,
        education: [data.education],
        job_titles_seeking: data.jobTitlesSeeking,
        remote_preference: data.remotePreference,
        salary_expectation: data.salaryExpectation,
        preferred_locations: data.preferredLocations,
        is_complete: isComplete,
      });

    if (dbError) {
      console.error("[actions/profile] DB update error:", dbError);
      return { success: false, error: dbError.message };
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("[actions/profile] Unexpected error saving profile:", error);
    return { success: false, error: "Failed to save profile" };
  }
}

export async function uploadResume(formData: FormData) {
  try {
    const insforge = await createInsforgeServer();
    const { data: userData, error: authError } = await insforge.auth.getCurrentUser();

    if (authError || !userData?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = userData.user.id;
    const file = formData.get("resume") as File | null;

    if (!file) {
      return { success: false, error: "No file uploaded" };
    }

    if (file.type !== "application/pdf") {
      return { success: false, error: "Only PDF files are supported" };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "File exceeds 5MB size limit" };
    }

    // Delete old resume from storage first to maintain consistency
    try {
      await insforge.storage.from("resumes").remove(`resumes/${userId}/resume.pdf`);
    } catch (removeError) {
      console.warn("[actions/profile] Failed to remove old resume (it may not exist):", removeError);
    }

    // Upload to InsForge Storage resumes bucket
    const { data: uploadData, error: uploadError } = await insforge.storage
      .from("resumes")
      .upload(`resumes/${userId}/resume.pdf`, file);

    if (uploadError || !uploadData?.url) {
      console.error("[actions/profile] Upload error:", uploadError);
      return { success: false, error: uploadError?.message || "Upload failed" };
    }

    const downloadUrl = "/api/resume/download";

    const { error: dbError } = await insforge.database
      .from("profiles")
      .upsert({
        id: userId,
        email: userData.user.email,
        resume_pdf_url: downloadUrl,
      });

    if (dbError) {
      console.error("[actions/profile] DB update error after upload:", dbError);
      return { success: false, error: dbError.message };
    }

    revalidatePath("/profile");
    return { success: true, url: downloadUrl };
  } catch (error) {
    console.error("[actions/profile] Unexpected error uploading resume:", error);
    return { success: false, error: "Failed to upload resume" };
  }
}
