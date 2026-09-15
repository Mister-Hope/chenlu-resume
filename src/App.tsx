import React, { useRef, useState, useEffect } from "react";
import { initialResumeData } from "./data/resumeData";
import { ResumeHeader } from "./components/ResumeHeader";
import { EducationSection } from "./components/EducationSection";
import { HonorsSection } from "./components/HonorsSection";
import { TeachingSection } from "./components/TeachingSection";
import { ResearchSection } from "./components/ResearchSection";
import { LeadershipSection } from "./components/LeadershipSection";
import { EvaluationSection } from "./components/EvaluationSection";
import { PrintToolbar } from "./components/PrintToolbar";

export default function App() {
  const resumeData = initialResumeData;
  const sheetRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-neutral-300 text-neutral-800 flex flex-col font-sans-modern antialiased">
      {/* Print Control Action (Top Right Only) */}
      <PrintToolbar onPrint={handlePrint} />

      {/* Screen Canvas: Perfectly Centered A4 Sheet */}
      <main className="flex-1 overflow-auto flex items-start justify-center p-4 sm:p-6 a4-container-screen">
        <div
          ref={sheetRef}
          id="a4-resume-sheet"
          className="a4-page-root bg-white text-neutral-900 shadow-xl rounded-none mx-auto print:shadow-none print:m-0 print:p-0 print:border-none flex flex-col justify-between"
          style={{
            width: "210mm",
            height: "297mm",
            maxHeight: "297mm",
            minHeight: "297mm",
            boxSizing: "border-box",
            padding: "10.5mm 13mm 10.5mm 13mm",
          }}
        >
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
        </div>
      </main>
    </div>
  );
}
