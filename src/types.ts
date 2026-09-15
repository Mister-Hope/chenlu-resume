export interface PersonalInfo {
  name: string;
  age: number;
  gender?: string;
  politicalStatus: string;
  targetPosition: string;
  university: string;
  degreeSummary: string;
  phone: string;
  wechat: string;
  email: string;
  certificates: string[];
  photoUrl: string;
  schoolBadges: string[];
  schoolLogoUrl?: string;
}

export interface EducationItem {
  id: string;
  period: string;
  school: string;
  major: string;
  degree: string;
}

export interface AwardCategory {
  category: string;
  items: string[];
}

export interface TeachingExperienceItem {
  id: string;
  institution: string;
  role: string;
  period: string;
  description: string;
}

export interface ResearchPaper {
  id: string;
  authorship: string; // "第一作者" | "共同一作"
  journal: string;
  tier: string; // "中科院一区 TOP" | "二区" etc.
  description: string;
  badgeType?: "gold" | "blue" | "slate";
}

export interface StudentWorkItem {
  id: string;
  period: string;
  organization: string;
  role: string;
  department?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: EducationItem[];
  teachingExperience: TeachingExperienceItem[];
  researchPapers: ResearchPaper[];
  otherPublications: string;
  awards: AwardCategory[];
  studentWork: StudentWorkItem[];
  selfEvaluation: string[];
}
