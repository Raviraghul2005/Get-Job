"use client";

import { useState } from "react";
import { Plus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { TagInput } from "@/components/profile/TagInput";
import { WorkExperienceCard } from "@/components/profile/WorkExperienceCard";
import { saveProfile } from "@/actions/profile";

type WorkRole = {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  responsibilities: string;
};

type ProfileFormProps = {
  email: string;
  initialData: {
    full_name?: string | null;
    phone?: string | null;
    location?: string | null;
    linkedin_url?: string | null;
    portfolio_url?: string | null;
    work_authorization?: string | null;
    current_title?: string | null;
    experience_level?: string | null;
    years_experience?: number | null;
    skills?: string[] | null;
    industries?: string[] | null;
    work_experience?: any;
    education?: any;
    job_titles_seeking?: string[] | null;
    remote_preference?: string | null;
    salary_expectation?: string | null;
    preferred_locations?: string[] | null;
  } | null;
};

export function ProfileForm({ email, initialData }: ProfileFormProps) {
  // Personal Info
  const [fullName, setFullName] = useState(initialData?.full_name || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [linkedinUrl, setLinkedinUrl] = useState(initialData?.linkedin_url || "");
  const [portfolioUrl, setPortfolioUrl] = useState(initialData?.portfolio_url || "");
  const [workAuthorization, setWorkAuthorization] = useState(initialData?.work_authorization || "citizen");

  // Professional Info
  const [currentTitle, setCurrentTitle] = useState(initialData?.current_title || "");
  const [experienceLevel, setExperienceLevel] = useState(initialData?.experience_level || "junior");
  const [yearsExperience, setYearsExperience] = useState(
    initialData?.years_experience !== null && initialData?.years_experience !== undefined
      ? String(initialData.years_experience)
      : ""
  );
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  const [industries, setIndustries] = useState<string[]>(initialData?.industries || []);

  // Work Experience
  const [roles, setRoles] = useState<WorkRole[]>(() => {
    if (Array.isArray(initialData?.work_experience) && initialData.work_experience.length > 0) {
      return initialData.work_experience;
    }
    return [
      {
        company: "",
        title: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        responsibilities: "",
      },
    ];
  });

  // Education
  const eduObj =
    Array.isArray(initialData?.education) && initialData.education.length > 0
      ? initialData.education[0]
      : null;
  const [degree, setDegree] = useState(eduObj?.degree || "high_school");
  const [fieldOfStudy, setFieldOfStudy] = useState(eduObj?.fieldOfStudy || "");
  const [institution, setInstitution] = useState(eduObj?.institution || "");
  const [graduationYear, setGraduationYear] = useState(eduObj?.graduationYear || "");

  // Job Preferences
  const [jobTitlesSeeking, setJobTitlesSeeking] = useState(
    initialData?.job_titles_seeking?.join(", ") || ""
  );
  const [remotePreference, setRemotePreference] = useState(initialData?.remote_preference || "any");
  const [salaryExpectation, setSalaryExpectation] = useState(initialData?.salary_expectation || "");
  const [preferredLocations, setPreferredLocations] = useState(
    initialData?.preferred_locations?.join(", ") || ""
  );

  // Status States
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleRoleUpdate(index: number, field: string, value: string | boolean): void {
    setRoles((prev) =>
      prev.map((role, i) => (i === index ? { ...role, [field]: value } : role))
    );
  }

  function handleRoleRemove(index: number): void {
    setRoles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAddRole(): void {
    if (roles.length >= 3) return;
    setRoles((prev) => [
      ...prev,
      {
        company: "",
        title: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        responsibilities: "",
      },
    ]);
  }

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    // Parse array fields
    const parsedJobTitles = jobTitlesSeeking
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedLocations = preferredLocations
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const result = await saveProfile({
      fullName,
      phone,
      location,
      linkedinUrl,
      portfolioUrl,
      workAuthorization,
      currentTitle,
      experienceLevel,
      yearsExperience: yearsExperience ? parseInt(yearsExperience, 10) : 0,
      skills,
      industries,
      workExperience: roles.filter((r) => r.company.trim() || r.title.trim()),
      education: {
        degree,
        fieldOfStudy,
        institution,
        graduationYear,
      },
      jobTitlesSeeking: parsedJobTitles,
      remotePreference,
      salaryExpectation,
      preferredLocations: parsedLocations,
    });

    if (result.success) {
      setSuccess(true);
      // Auto clear success banner after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Failed to save profile.");
    }
    setIsSaving(false);
  };

  const inputClasses =
    "w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors";

  const selectClasses =
    "w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors appearance-none cursor-pointer";

  const labelClasses =
    "block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5";

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-text-primary">Profile Information</h2>
        <p className="text-sm text-text-secondary mt-1">
          This context is used to accurately represent you in agent interactions.
        </p>
      </div>

      {/* ── Personal Info ── */}
      <section className="mb-10 pb-10 border-b border-border">
        <h3 className="text-base font-semibold text-text-primary mb-5">Personal Info</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Email</label>
            <input
              type="email"
              value={email}
              disabled
              className={`${inputClasses} bg-surface-secondary text-text-muted cursor-not-allowed`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClasses}>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClasses}>LinkedIn URL</label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/yourname"
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Portfolio / GitHub</label>
            <input
              type="url"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://github.com/yourname"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="mt-4 max-w-[calc(50%-0.5rem)]">
          <label className={labelClasses}>Work Authorization</label>
          <div className="relative">
            <select
              value={workAuthorization}
              onChange={(e) => setWorkAuthorization(e.target.value)}
              className={selectClasses}
            >
              <option value="citizen">Citizen</option>
              <option value="permanent_resident">Permanent Resident</option>
              <option value="visa_required">Visa Required</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── Professional Info ── */}
      <section className="mb-10 pb-10 border-b border-border">
        <h3 className="text-base font-semibold text-text-primary mb-5">Professional Info</h3>

        <div>
          <label className={labelClasses}>Current/Recent Job Title</label>
          <input
            type="text"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            placeholder="E.g. Frontend Engineer"
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClasses}>Experience Level</label>
            <div className="relative">
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className={selectClasses}
              >
                <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label className={labelClasses}>Years of Experience</label>
            <input
              type="number"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
              placeholder="0"
              min="0"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className={labelClasses}>Skills</label>
          <TagInput tags={skills} onTagsChange={setSkills} placeholder="Add a skill" />
        </div>

        <div className="mt-4">
          <label className={labelClasses}>Industries Worked In (Optional)</label>
          <TagInput tags={industries} onTagsChange={setIndustries} placeholder="E.g. FinTech, Healthcare" />
        </div>
      </section>

      {/* ── Work Experience ── */}
      <section className="mb-10 pb-10 border-b border-border">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-text-primary">Work Experience</h3>
          {roles.length < 3 && (
            <button
              type="button"
              onClick={handleAddRole}
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add role
            </button>
          )}
        </div>

        <div className="space-y-4">
          {roles.map((role, index) => (
            <WorkExperienceCard
              key={index}
              index={index}
              role={role}
              onUpdate={handleRoleUpdate}
              onRemove={handleRoleRemove}
              canRemove={roles.length > 1}
            />
          ))}
        </div>
      </section>

      {/* ── Education ── */}
      <section className="mb-10 pb-10 border-b border-border">
        <h3 className="text-base font-semibold text-text-primary mb-5">Education</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Highest Degree</label>
            <div className="relative">
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className={selectClasses}
              >
                <option value="high_school">High School</option>
                <option value="associate">Associate&apos;s</option>
                <option value="bachelor">Bachelor&apos;s</option>
                <option value="master">Master&apos;s</option>
                <option value="doctorate">Doctorate</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label className={labelClasses}>Field of Study</label>
            <input
              type="text"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              placeholder="E.g. Computer Science"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClasses}>Institution Name</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="E.g. State University"
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Graduation Year</label>
            <input
              type="text"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              placeholder="YYYY"
              className={inputClasses}
            />
          </div>
        </div>
      </section>

      {/* ── Job Preferences ── */}
      <section className="mb-8">
        <h3 className="text-base font-semibold text-text-primary mb-5">Job Preferences</h3>

        <div>
          <label className={labelClasses}>Job Titles Seeking</label>
          <input
            type="text"
            value={jobTitlesSeeking}
            onChange={(e) => setJobTitlesSeeking(e.target.value)}
            placeholder="E.g. Frontend Engineer, React Developer"
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClasses}>Remote Preference</label>
            <div className="relative">
              <select
                value={remotePreference}
                onChange={(e) => setRemotePreference(e.target.value)}
                className={selectClasses}
              >
                <option value="any">Any</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">Onsite</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label className={labelClasses}>Salary Expectation (Optional)</label>
            <input
              type="text"
              value={salaryExpectation}
              onChange={(e) => setSalaryExpectation(e.target.value)}
              placeholder="E.g. $120k+"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className={labelClasses}>Preferred Locations (Optional)</label>
          <input
            type="text"
            value={preferredLocations}
            onChange={(e) => setPreferredLocations(e.target.value)}
            placeholder="E.g. New York, London"
            className={inputClasses}
          />
        </div>
      </section>

      {/* ── Status Messages ── */}
      {error && (
        <div className="mb-4 flex items-center gap-2 text-error text-sm bg-error/5 border border-error/10 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center gap-2 text-success text-sm bg-success/5 border border-success/10 p-3 rounded-lg">
          <CheckCircle2 className="h-4 w-4" />
          <span>Profile saved successfully!</span>
        </div>
      )}

      {/* ── Save Button ── */}
      <button
        type="button"
        disabled={isSaving}
        onClick={handleSave}
        className="w-full bg-accent text-accent-foreground rounded-md px-4 py-3 text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSaving ? "Saving Profile..." : "Save Profile"}
      </button>
    </div>
  );
}
