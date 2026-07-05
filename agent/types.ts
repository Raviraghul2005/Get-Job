export type AdzunaJob = {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  description: string;
  redirect_url: string;
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted: "0" | "1";
  contract_type?: string;
  created: string;
  category: { tag: string; label: string };
};

export type ScoredJob = {
  matchScore: number;
  matchReason: string;
  matchedSkills: string[];
  missingSkills: string[];
};

export type UserProfile = {
  id: string;
  full_name: string | null;
  current_title: string | null;
  experience_level: string | null;
  years_experience: number | null;
  skills: string[] | null;
  industries: string[] | null;
  work_experience: Record<string, unknown>[] | null;
  education: Record<string, unknown> | null;
  job_titles_seeking: string[] | null;
  remote_preference: string | null;
  preferred_locations: string[] | null;
  salary_expectation: string | null;
};

export type DiscoverJobsResult = {
  success: boolean;
  jobsFound: number;
  strongMatches: number;
  error?: string;
};

export type ResearchDossier = {
  companyOverview: string;
  techStack: string[];
  culture: string[];
  whyThisRole: string;
  yourEdge: string[];
  gapsToAddress: string[];
  smartQuestions: string[];
  interviewPrep: string[];
  sources: string[];
};

export type ResearchCompanyResult = {
  success: boolean;
  dossier?: ResearchDossier;
  error?: string;
};

