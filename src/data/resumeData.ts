import { DEFAULT_AVATAR, DEFAULT_LOGO } from "../assets/defaultAssets";
import { ResumeData } from "../types";

export const initialResumeData: ResumeData = {
  personalInfo: {
    name: "陈璐",
    age: 26,
    gender: "女",
    politicalStatus: "中共党员",
    targetPosition: "高中物理教师",
    university: "东北师范大学",
    degreeSummary: "本硕博贯通培养（硕博连读）",
    phone: "15604480425",
    wechat: "Mistress-Hope",
    email: "chenl987@nenu.edu.cn",
    certificates: ["高中物理教师资格证", "普通话等级二级甲等", "大学英语六级 (CET-6)"],
    photoUrl: DEFAULT_AVATAR,
    schoolBadges: ["教育部直属高校", "国家“双一流”建设高校"],
    schoolLogoUrl: DEFAULT_LOGO,
  },
  education: [
    {
      id: "edu-1",
      period: "2021.09 — 2027.06 (预计)",
      school: "东北师范大学",
      major: "凝聚态物理",
      degree: "硕博连读·推免保送",
    },
    {
      id: "edu-2",
      period: "2017.09 — 2021.06",
      school: "东北师范大学",
      major: "物理学（师范/理学）",
      degree: "理学学士",
    },
  ],
  awards: [
    {
      category: "奖学金",
      items: [
        "国家奖学金（2026.10.10）",
        "二等奖学金",
        "三等奖学金",
        "优秀学生干部奖学金",
        "创新创业专项奖学金",
      ],
    },
    {
      category: "荣誉称号",
      items: ["校级优秀学生干部", "校五四优秀团员", "校五四红旗团干部"],
    },
    {
      category: "竞赛与学术",
      items: ["“互联网+”省级铜奖", "“挑战杯”吉林省三等奖", "“光·未来”学术论坛优秀报告奖"],
    },
  ],
  teachingExperience: [
    {
      id: "exp-1",
      institution: "新凯旋教育学校",
      role: "高中物理兼职教师",
      period: "2020.05 — 2024.08",
      description:
        "承担高中物理兼职授课与个性化辅导，注重物理模型与解题方法引导，所带学生物理成绩有很大提高。",
    },
    {
      id: "exp-2",
      institution: "北京学而思网络科技有限公司",
      role: "高中物理实习教师",
      period: "2018.11 — 2019.06",
      description:
        "参与高中物理教研、讲义编撰与课堂互动教学设计，系统梳理高考高频考点与学生易错题型。",
    },
    {
      id: "exp-3",
      institution: "北京益微青年公益发展中心",
      role: "基层支教志愿者 (河南省开封市兰考县)",
      period: "2019 暑期",
      description:
        "深入基层乡村学校开展暑期支教，主讲“趣味物理科普与动手小实验”系列课程，践行师范生从教初心。",
    },
    {
      id: "exp-4",
      institution: "中央高校基本科研业务专项资金",
      role: "重点培育项目负责人",
      period: "2021",
      description:
        "主持重点课题《紫外 B 波段余辉发光的谱学及应用研究》，全面统筹方案设计、课题分工并圆满通过结项验收。",
    },
  ],
  researchPapers: [
    {
      id: "paper-1",
      authorship: "第一作者",
      journal: "Light: Science & Applications",
      tier: "中科院一区 TOP",
      description: "光学领域国际顶刊，入选中国科技期刊卓越行动计划「领军期刊」",
      badgeType: "gold",
    },
    {
      id: "paper-2",
      authorship: "第一作者",
      journal: "Physical Review Research",
      tier: "中科院二区",
      description: "美国物理学会 (APS) 旗下物理权威刊物",
      badgeType: "blue",
    },
    {
      id: "paper-3",
      authorship: "第一作者",
      journal: "J. Mater. Chem. C",
      tier: "中科院三区",
      description: "英国皇家化学会 (RSC) 光功能材料经典期刊",
      badgeType: "blue",
    },
    {
      id: "paper-4",
      authorship: "第一作者",
      journal: "APC 国际光子学学术会议",
      tier: "国际重要学术会议",
      description: "作学术汇报交流并收录高水平学术会议成果",
      badgeType: "slate",
    },
    {
      id: "paper-5",
      authorship: "共同一作",
      journal: "National Materials",
      tier: "卓越期刊",
      description: "入选中国科技期刊卓越行动计划高水平重点期刊",
      badgeType: "slate",
    },
  ],
  otherPublications: "另以主要合作者身份在知名国际 SCI 刊物署名发表学术论文 5 篇",
  studentWork: [
    {
      id: "work-1",
      period: "2021 — 2023",
      organization: "东北师范大学物理学院",
      role: "研究生年级负责人",
      department: "统筹年级日常学风建设、思政教育与学生管理事务，具备突出的班级组织协调能力",
    },
    {
      id: "work-2",
      period: "2019 — 2020",
      organization: "东北师范大学物理学院学生会",
      role: "学生会秘书长",
      department: "负责学院大型学术文化节、科技讲座策划统筹及团学评优工作，获评校级优秀干部",
    },
    {
      id: "work-3",
      period: "2017 — 2021",
      organization: "东北师范大学物理学院",
      role: "本科年级长",
      department: "连续4年担任本科年级长，具备深厚扎实的学生工作与青年德育沟通经验",
    },
  ],
  selfEvaluation: [
    "东北师范大学物理学本硕博贯通培养，中共党员，热爱基础教育事业，具有扎实的物理学科功底与严谨的科学思维；",
    "具备四年高中物理教学实践与教研备课经验，熟悉高中物理知识体系与高考考查重点，善于启发式与模型化教学;",
    "连续六年担任本科年级长、研究生年级负责人及学生会秘书长，组织协调与沟通表达能力强，富有责任心与亲和力；",
    "作风踏实谦逊，工作敬业负责，愿以从教报国之初心，全力投入高中物理教学与班主任德育管理工作。",
  ],
};
