"use client";

import { useState, useEffect } from "react";
import { ResumeUpload } from "@/components/profile/ResumeUpload";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AlertCircle, CheckCircle2 } from "lucide-react";

type ProfileContainerProps = {
  email: string;
  initialProfile: any;
  initialPercentage: number;
  initialMissingFields: string[];
};

export function ProfileContainer({
  email,
  initialProfile,
  initialPercentage,
  initialMissingFields,
}: ProfileContainerProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [resumeUrl, setResumeUrl] = useState<string | null>(initialProfile?.resume_pdf_url ?? null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  
  // PDF Generation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState(false);
  
  // Progress/Completeness States
  const [percentage, setPercentage] = useState(initialPercentage);
  const [missingFields, setMissingFields] = useState(initialMissingFields);
  const [formKey, setFormKey] = useState(0);

  // Sync state if server component revalidates (e.g. after a profile save or upload)
  useEffect(() => {
    setProfile(initialProfile);
    setResumeUrl(initialProfile?.resume_pdf_url ?? null);
    setPercentage(initialPercentage);
    setMissingFields(initialMissingFields);
  }, [initialProfile, initialPercentage, initialMissingFields]);

  const handleUploadSuccess = (url: string) => {
    setResumeUrl(url);
    setExtractError(null);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerateError(null);
    setGenerateSuccess(false);

    try {
      const response = await fetch("/api/resume/generate", {
        method: "POST",
      });

      const result = await response.json();

      if (result.success && result.url) {
        setResumeUrl(result.url);
        setGenerateSuccess(true);
        // Automatically clear success state after 5 seconds
        setTimeout(() => setGenerateSuccess(false), 5000);
      } else {
        setGenerateError(result.error || "Failed to generate resume.");
      }
    } catch (err) {
      console.error("[ProfileContainer] Resume generation error:", err);
      setGenerateError("An unexpected error occurred during resume generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExtract = async () => {
    setIsExtracting(true);
    setExtractError(null);

    try {
      const response = await fetch("/api/resume/extract", {
        method: "POST",
      });

      const result = await response.json();

      if (result.success && result.data) {
        const extracted = result.data;
        
        // Map the API camelCase results back to the database schema that ProfileForm expects as initialData.
        const newProfileData = {
          ...profile,
          full_name: extracted.fullName || profile?.full_name,
          phone: extracted.phone || profile?.phone,
          location: extracted.location || profile?.location,
          linkedin_url: extracted.linkedinUrl || profile?.linkedin_url,
          portfolio_url: extracted.portfolioUrl || profile?.portfolio_url,
          work_authorization: extracted.workAuthorization || profile?.work_authorization || "citizen",
          current_title: extracted.currentTitle || profile?.current_title,
          experience_level: extracted.experienceLevel || profile?.experience_level || "junior",
          years_experience: extracted.yearsExperience !== undefined && extracted.yearsExperience !== null ? extracted.yearsExperience : profile?.years_experience,
          skills: extracted.skills || profile?.skills || [],
          industries: extracted.industries || profile?.industries || [],
          work_experience: extracted.workExperience || profile?.work_experience || [],
          education: extracted.education ? [extracted.education] : profile?.education || [],
          job_titles_seeking: extracted.jobTitlesSeeking || profile?.job_titles_seeking || [],
          remote_preference: extracted.remotePreference || profile?.remote_preference || "any",
          salary_expectation: extracted.salaryExpectation || profile?.salary_expectation,
          preferred_locations: extracted.preferredLocations || profile?.preferred_locations || [],
          resume_pdf_url: resumeUrl, // Keep current resume URL
        };

        setProfile(newProfileData);
        setFormKey((prev) => prev + 1); // remount ProfileForm with the new values
      } else {
        setExtractError(result.error || "Failed to extract profile information from resume.");
      }
    } catch (err) {
      console.error("[ProfileContainer] Extraction error:", err);
      setExtractError("An unexpected error occurred during extraction.");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ResumeUpload
        initialResumeUrl={resumeUrl}
        onUploadSuccess={handleUploadSuccess}
        isExtracting={isExtracting}
        onExtract={handleExtract}
        isGenerating={isGenerating}
        onGenerate={handleGenerate}
        percentage={percentage}
        missingFields={missingFields}
      />

      {extractError && (
        <div className="flex items-center gap-2 text-error text-xs bg-error/5 border border-error/10 p-3 rounded-lg animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{extractError}</span>
        </div>
      )}

      {generateError && (
        <div className="flex items-center gap-2 text-error text-xs bg-error/5 border border-error/10 p-3 rounded-lg animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{generateError}</span>
        </div>
      )}

      {generateSuccess && (
        <div className="flex items-center gap-2 text-success text-xs bg-success/5 border border-success/10 p-3 rounded-lg animate-in fade-in slide-in-from-top-1 duration-200">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-success" />
          <span>Resume PDF generated and saved successfully!</span>
        </div>
      )}

      <ProfileForm
        key={formKey}
        email={email}
        initialData={profile}
      />
    </div>
  );
}
