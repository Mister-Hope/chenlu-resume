export interface PersonalInfo {
  name: string;
  age: number;
  gender?: string;
  politicalStatus: string;
  targetPosition?: string;
  university: string;
  degreeSummary: string;
  phone: string;
  wechat: string;
  email: string;
  certificates: string[];
  /** 证件照地址，未提供时回退到内置默认头像 */
  photoUrl?: string;
  schoolBadges: string[];
  /** 校徽地址，未提供时回退到内置默认校徽 */
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
  /** 奖项名称。以「 ×N」结尾表示该奖项获得过 N 次（例如「优秀学生干部奖学金 ×2」）， 渲染时会把 ×N 高亮成主题蓝加粗，用于突出重复获奖。 */
  items: string[];
}

export interface TeachingExperienceItem {
  id: string;
  institution: string;
  role: string;
  period: string;
  description: string;
}

/** 论文 / 成果的级别，仅用于决定右侧标签的配色 */
export type PaperLevel = "top" | "q2" | "q3" | "excellent" | "conference";

export interface ResearchPaper {
  id: string;
  /** 作者署名情况，直接作为标签文案渲染。常见值：「第一作者」「共同一作」「第二作者」「通讯作者」等， 不限定枚举，方便后续补充其它署名位次。 */
  authorship: string;
  journal: string;
  /** 展示用的级别文案，例如「中科院一区 TOP」「卓越期刊」 */
  tier: string;
  /** 级别的语义标识，与 tier 的文案解耦，避免改文案导致样式错位 */
  level: PaperLevel;
  description: string;
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
