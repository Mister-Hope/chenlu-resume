import type { ReactElement } from "react";

import { A4Page } from "./components/A4Page";
import { EducationSection } from "./components/EducationSection";
import { EvaluationSection } from "./components/EvaluationSection";
import { HonorsSection } from "./components/HonorsSection";
import { LeadershipSection } from "./components/LeadershipSection";
import { PrintToolbar } from "./components/PrintToolbar";
import { ResearchSection } from "./components/ResearchSection";
import { ResumeHeader } from "./components/ResumeHeader";
import { TeachingSection } from "./components/TeachingSection";
import { resumeData } from "./data/resumeData";

/** 打印 / 导出 PDF：交给浏览器打印对话框处理 A4 排版 */
const handlePrint = (): void => {
  globalThis.print();
};

const App = (): ReactElement => (
  <div className="a4-app-shell h-dvh overflow-hidden bg-neutral-300 text-neutral-800 flex flex-col font-sans-modern antialiased">
    {/* Print Control Action (Top Right Only) */}
    <PrintToolbar onPrint={handlePrint} />

    {/* Screen Canvas: A4 sheet, scaled down proportionally on narrow screens */}
    <A4Page>
      {/* Main Printable Content Container */}
      <div>
        {/* 1. Header: School Logo, Badges, Candidate Portrait & Full Contact */}
        <ResumeHeader info={resumeData.personalInfo} />

        {/* 2. 教育背景 */}
        <EducationSection education={resumeData.education} />

        {/* 3. 个人荣誉 (前置展示: 奖学金、校级荣誉称号、省挑战杯与互联网+) */}
        <HonorsSection awards={resumeData.awards} />

        {/* 4. 实践经验 (新凯旋高考一线教学4年、学而思教研备课、兰考支教、重点科研) */}
        <TeachingSection experiences={resumeData.teachingExperience} />

        {/* 5. 科研成果 (一区TOP领军期刊、二区物理权威、三区经典、APC口头报告、卓越期刊、SCI 5篇) */}
        <ResearchSection
          papers={resumeData.researchPapers}
          otherPublications={resumeData.otherPublications}
        />

        {/* 6. 主要学生工作 (完整展示全部3项经历: 研究生年级负责人、物理学院学生会秘书长、本科年级长) */}
        <LeadershipSection items={resumeData.studentWork} />

        {/* 7. 自我评价 (完整展示全部3个维度: 【专业与学术】、【教学与实战】、【德育与管理】) */}
        <EvaluationSection paragraphs={resumeData.selfEvaluation} />
      </div>
    </A4Page>
  </div>
);

export default App;
