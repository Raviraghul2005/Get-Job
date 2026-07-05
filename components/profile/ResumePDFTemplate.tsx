import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Stylesheet for professional single-page resume layout
const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 9,
    lineHeight: 1.4,
    color: "#334155", // slate-700
    backgroundColor: "#ffffff",
  },
  header: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#4f46e5", // indigo-600
    paddingBottom: 10,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a", // slate-900
    marginBottom: 3,
  },
  title: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#4f46e5", // indigo-600
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    fontSize: 8,
    color: "#64748b", // slate-500
  },
  contactSeparator: {
    color: "#cbd5e1", // slate-300
  },
  mainLayout: {
    flexDirection: "row",
    gap: 18,
  },
  leftColumn: {
    flex: 1.8,
  },
  rightColumn: {
    flex: 1,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a", // slate-900
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0", // slate-200
    paddingBottom: 2,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  summaryText: {
    fontSize: 8.5,
    lineHeight: 1.4,
    color: "#334155",
  },
  jobEntry: {
    marginBottom: 8,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 1,
  },
  companyName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  dateRange: {
    fontSize: 8,
    color: "#64748b",
  },
  jobTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Oblique",
    color: "#4f46e5",
    marginBottom: 3,
  },
  bulletList: {
    marginLeft: 6,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 2.5,
  },
  bulletDot: {
    width: 6,
    fontSize: 8,
    color: "#4f46e5",
  },
  bulletText: {
    flex: 1,
    fontSize: 8,
    lineHeight: 1.3,
  },
  skillGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  skillBadge: {
    backgroundColor: "#f8fafc", // slate-50
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2.5,
    fontSize: 7.5,
    color: "#334155",
    borderWidth: 0.5,
    borderColor: "#e2e8f0", // slate-200
  },
  educationEntry: {
    marginBottom: 6,
  },
  eduInstitution: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  eduDegree: {
    fontSize: 8,
    fontFamily: "Helvetica-Oblique",
    color: "#4f46e5",
  },
  eduDate: {
    fontSize: 7.5,
    color: "#64748b",
    marginTop: 1,
  },
  preferenceItem: {
    marginBottom: 5,
  },
  preferenceLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 1,
  },
  preferenceValue: {
    fontSize: 8,
    color: "#334155",
  },
});

export type PolishedResumeData = {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  currentTitle?: string;
  workAuthorization?: string;
  summary: string;
  workExperience: Array<{
    company: string;
    title: string;
    dateRange: string;
    bullets: string[];
  }>;
  education: {
    institution: string;
    degree: string;
    date: string;
  };
  skills: string[];
  jobTitlesSeeking?: string[];
  remotePreference?: string;
  salaryExpectation?: string;
  preferredLocations?: string[];
};

interface ResumePDFTemplateProps {
  data: PolishedResumeData;
}

export const ResumePDFTemplate: React.FC<ResumePDFTemplateProps> = ({ data }) => {
  const formatWorkAuth = (auth?: string) => {
    if (!auth) return "";
    switch (auth) {
      case "citizen":
        return "Citizen";
      case "permanent_resident":
        return "Permanent Resident";
      case "visa_required":
        return "Visa Sponsorship Required";
      default:
        return auth;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Block */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.fullName}</Text>
          {data.currentTitle && (
            <Text style={styles.title}>{data.currentTitle}</Text>
          )}
          <View style={styles.contactRow}>
            <Text>{data.email}</Text>
            {data.phone && (
              <>
                <Text style={styles.contactSeparator}>|</Text>
                <Text>{data.phone}</Text>
              </>
            )}
            {data.location && (
              <>
                <Text style={styles.contactSeparator}>|</Text>
                <Text>{data.location}</Text>
              </>
            )}
            {data.linkedinUrl && (
              <>
                <Text style={styles.contactSeparator}>|</Text>
                <Text>{data.linkedinUrl}</Text>
              </>
            )}
            {data.portfolioUrl && (
              <>
                <Text style={styles.contactSeparator}>|</Text>
                <Text>{data.portfolioUrl}</Text>
              </>
            )}
          </View>
        </View>

        {/* Two-Column Body Layout */}
        <View style={styles.mainLayout}>
          {/* Main Content Column */}
          <View style={styles.leftColumn}>
            {/* Professional Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Summary</Text>
              <Text style={styles.summaryText}>{data.summary}</Text>
            </View>

            {/* Work Experience */}
            {data.workExperience && data.workExperience.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Work Experience</Text>
                {data.workExperience.map((job, index) => (
                  <View key={index} style={styles.jobEntry}>
                    <View style={styles.jobHeader}>
                      <Text style={styles.companyName}>{job.company}</Text>
                      <Text style={styles.dateRange}>{job.dateRange}</Text>
                    </View>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <View style={styles.bulletList}>
                      {job.bullets.map((bullet, idx) => (
                        <View key={idx} style={styles.bulletItem}>
                          <Text style={styles.bulletDot}>•</Text>
                          <Text style={styles.bulletText}>{bullet}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Sidebar Column */}
          <View style={styles.rightColumn}>
            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.skillGrid}>
                  {data.skills.map((skill, index) => (
                    <Text key={index} style={styles.skillBadge}>
                      {skill}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* Education */}
            {data.education && data.education.institution && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                <View style={styles.educationEntry}>
                  <Text style={styles.eduInstitution}>
                    {data.education.institution}
                  </Text>
                  <Text style={styles.eduDegree}>{data.education.degree}</Text>
                  <Text style={styles.eduDate}>{data.education.date}</Text>
                </View>
              </View>
            )}

            {/* Preferences & Eligibility */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Job Preferences</Text>

              {data.workAuthorization && (
                <View style={styles.preferenceItem}>
                  <Text style={styles.preferenceLabel}>Work Authorization</Text>
                  <Text style={styles.preferenceValue}>
                    {formatWorkAuth(data.workAuthorization)}
                  </Text>
                </View>
              )}

              {data.remotePreference && (
                <View style={styles.preferenceItem}>
                  <Text style={styles.preferenceLabel}>Remote Preference</Text>
                  <Text style={styles.preferenceValue}>
                    {data.remotePreference.toUpperCase()}
                  </Text>
                </View>
              )}

              {data.jobTitlesSeeking && data.jobTitlesSeeking.length > 0 && (
                <View style={styles.preferenceItem}>
                  <Text style={styles.preferenceLabel}>Target Roles</Text>
                  <Text style={styles.preferenceValue}>
                    {data.jobTitlesSeeking.join(", ")}
                  </Text>
                </View>
              )}

              {data.preferredLocations && data.preferredLocations.length > 0 && (
                <View style={styles.preferenceItem}>
                  <Text style={styles.preferenceLabel}>Preferred Locations</Text>
                  <Text style={styles.preferenceValue}>
                    {data.preferredLocations.join(", ")}
                  </Text>
                </View>
              )}

              {data.salaryExpectation && (
                <View style={styles.preferenceItem}>
                  <Text style={styles.preferenceLabel}>Target Salary</Text>
                  <Text style={styles.preferenceValue}>
                    {data.salaryExpectation}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
