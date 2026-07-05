"use client";

import { useState, useRef, useEffect } from "react";
import { CloudUpload, FileText, CheckCircle2, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { uploadResume } from "@/actions/profile";

type ResumeUploadProps = {
  initialResumeUrl: string | null;
  onUploadSuccess?: (url: string) => void;
  isExtracting?: boolean;
  onExtract?: () => void;
  isGenerating?: boolean;
  onGenerate?: () => void;
  percentage?: number;
  missingFields?: string[];
};

export function ResumeUpload({
  initialResumeUrl,
  onUploadSuccess,
  isExtracting = false,
  onExtract,
  isGenerating = false,
  onGenerate,
  percentage,
  missingFields,
}: ResumeUploadProps) {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(initialResumeUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUploadedUrl(initialResumeUrl);
  }, [initialResumeUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processUpload(file);
    }
  };

  const processUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File exceeds 5MB size limit.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);

    const result = await uploadResume(formData);

    if (result.success && result.url) {
      setUploadedUrl(result.url);
      onUploadSuccess?.(result.url);
    } else {
      setError(result.error || "Failed to upload resume.");
    }
    setIsUploading(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processUpload(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-5">
      <div>
        <h2 className="text-base font-semibold text-text-primary">Resume</h2>
        <p className="text-sm text-text-secondary mt-1">
          Upload an existing resume to auto-fill the profile, or generate a new tailored one from your details below.
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
      />

      {isUploading ? (
        <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center bg-surface-secondary/20">
          <Loader2 className="h-10 w-10 text-accent animate-spin mb-3" />
          <p className="text-sm font-medium text-text-primary">Uploading your resume...</p>
          <p className="text-xs text-text-muted mt-1">Saving file to storage bucket</p>
        </div>
      ) : uploadedUrl ? (
        <div className="border border-success/30 bg-success-lightest/30 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-success-light flex items-center justify-center text-success">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-text-primary">resume.pdf</p>
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <a
                href="/api/resume/download"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline font-medium block mt-0.5"
              >
                View Uploaded Resume
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onExtract}
              disabled={isExtracting}
              className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground rounded-md px-4 py-2 text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isExtracting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isExtracting ? "Extracting..." : "Extract from Resume"}
            </button>
            <button
              type="button"
              onClick={triggerFileSelect}
              disabled={isExtracting}
              className="bg-surface border border-border rounded-md px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Replace Resume
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
          className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-accent/50 hover:bg-surface-secondary/50 transition-colors"
        >
          <CloudUpload className="h-10 w-10 text-accent mb-3" />
          <p className="text-sm font-medium text-text-primary">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-text-muted mt-1">
            PDF formatting only. Maximum file size 5MB.
          </p>
          <button
            type="button"
            className="mt-4 bg-surface border border-border rounded-md px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              triggerFileSelect();
            }}
          >
            Select Resume
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-error text-xs bg-error/5 border border-error/10 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Generate from profile */}
      <div className="pt-4 border-t border-border/60 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-text-primary">
              Generate PDF from Profile
            </p>
            <p className="text-xs text-text-secondary">
              Synthesize and format your saved profile details using Gemini AI.
            </p>
          </div>
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating || isExtracting || (percentage !== undefined && percentage < 70)}
            className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground rounded-md px-4 py-2.5 text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isGenerating ? "Generating PDF..." : "Generate Resume"}
          </button>
        </div>

        {percentage !== undefined && percentage < 70 ? (
          <div className="flex items-start gap-2 text-warning-dark text-xs bg-warning/5 border border-warning/10 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-warning" />
            <div>
              <p className="font-semibold text-warning-dark">Profile is incomplete ({percentage}%)</p>
              <p className="mt-0.5 text-text-secondary">
                To generate a resume, complete at least 70% of your profile. Missing: {missingFields?.join(", ") || "Key fields"}.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-text-muted italic">
            Note: This will overwrite your existing resume.pdf using your saved details. If you made changes below, please click "Save Profile" at the bottom first.
          </p>
        )}
      </div>
    </div>
  );
}
