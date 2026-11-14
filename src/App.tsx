import type { ReactElement } from "react";

import { A4Page } from "./components/A4Page";
import { ConferenceSection } from "./components/ConferenceSection";
import { EvaluationSection } from "./components/EvaluationSection";
import { HonorsSection } from "./components/HonorsSection";
import { LeadershipSection } from "./components/LeadershipSection";
import { PrintToolbar } from "./components/PrintToolbar";
import { PublicationsSection } from "./components/PublicationsSection";
import { ResearchProfileSection } from "./components/ResearchProfileSection";
import { ResearchSection } from "./components/ResearchSection";
import { ResumeHeader } from "./components/ResumeHeader";
import { TeachingSection } from "./components/TeachingSection";
import { getResumeData } from "./data/resumeData";

/** 打印 / 导出 PDF：交给浏览器打印对话框处理 A4 排版 */
const handlePrint = (): void => {
  globalThis.print();
};

const App = (): ReactElement => {
  const resumeData = getResumeData(import.meta.env.MODE === "research" ? "research" : "teaching");

  return (
    <div className="a4-app-shell h-dvh overflow-hidden bg-neutral-300 text-neutral-800 flex flex-col font-sans-modern antialiased">
      {/* Print Control Action (Top Right Only) */}
      <PrintToolbar onPrint={handlePrint} />

      {/* Screen Canvas: A4 sheet, scaled down proportionally on narrow screens */}
      <A4Page>
        {/* Main Printable Content Container */}
        <div>
          {/* 1. Header: School Logo, Badges, Candidate Portrait, Full Contact & Education */}
          <ResumeHeader info={resumeData.personalInfo} education={resumeData.education} />

          {resumeData.variant === "teaching" ? (
            <>
              {/* 教师方向：个人荣誉 → 教学实践 → 科研成果 */}
              <HonorsSection awards={resumeData.awards} />
              <TeachingSection experiences={resumeData.teachingExperience} />
              <ResearchSection
                papers={resumeData.researchPapers}
                otherPublications={resumeData.otherPublications}
              />
            </>
          ) : (
            <>
              {/* 科研方向：研究内容 → 学术成果 → 学术会议 → 个人荣誉 */}
              <ResearchProfileSection profile={resumeData.researchProfile} />
              <PublicationsSection
                papers={resumeData.researchPapers}
                participation={resumeData.publicationSummary}
              />
              <ConferenceSection items={resumeData.conferences} />
              <HonorsSection awards={resumeData.awards} />
            </>
          )}

          {/* 主要学生工作（含本科四年朋辈辅导员） */}
          <LeadershipSection items={resumeData.studentWork} />

          {/* 自我评价（按教师 / 科研方向分别撰写） */}
          <EvaluationSection paragraphs={resumeData.selfEvaluation} />
        </div>
      </A4Page>
    </div>
  );
};

export default App;
