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
  /** 需要用红字突出的奖项名（不含「 ×N」后缀），例如教师简历中的国家奖学金 */
  highlight?: string[];
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
  /** 教师简历用的简短说明；科研简历改为展示作者、期刊年份与影响因子 */
  description?: string;
  /** 作者列表，科研简历展示用 */
  authors?: string;
  /** 发表年份，科研简历展示用 */
  year?: string;
  /** 影响因子，科研简历展示用 */
  impactFactor?: string;
}

/** 参与作者论文的汇总徽章，例如「中科院二区 ×2」 */
export interface PublicationSummaryBadge {
  label: string;
  level: PaperLevel;
}

/** 科研简历里不再逐条列出的参与作者论文，只保留篇数与分区汇总 */
export interface PublicationSummary {
  count: number;
  badges: PublicationSummaryBadge[];
}

/** 科研简历的毕业课题与研究亮点 */
export interface ResearchProfile {
  thesis: string;
  directions: string[];
  highlights: string[];
}

/** 学术会议 / 论坛经历 */
export interface ConferenceItem {
  id: string;
  name: string;
  period: string;
  location?: string;
  role: string;
}

export interface StudentWorkItem {
  id: string;
  period: string;
  organization: string;
  role: string;
  department?: string;
}

/** 两种简历方向：教师岗与高校科研岗 */
export type ResumeVariant = "teaching" | "research";

interface ResumeDataBase {
  personalInfo: PersonalInfo;
  education: EducationItem[];
  awards: AwardCategory[];
  researchPapers: ResearchPaper[];
  studentWork: StudentWorkItem[];
  selfEvaluation: string[];
}

export interface TeachingResumeData extends ResumeDataBase {
  variant: "teaching";
  teachingExperience: TeachingExperienceItem[];
  otherPublications: string;
}

export interface ResearchResumeData extends ResumeDataBase {
  variant: "research";
  researchProfile: ResearchProfile;
  /** 参与作者论文的合并展示；为空的论文仍逐条列在 researchPapers 中 */
  publicationSummary?: PublicationSummary;
  conferences: ConferenceItem[];
}

export type ResumeData = TeachingResumeData | ResearchResumeData;
