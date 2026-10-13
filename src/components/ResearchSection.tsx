import { Microscope } from "lucide-react";
import React from "react";

import { ResearchPaper } from "../types";
import { ResumeSectionHeader } from "./ResumeSectionHeader";

interface ResearchSectionProps {
  papers: ResearchPaper[];
  otherPublications: string;
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({ papers, otherPublications }) => {
  const getTierBadgeStyle = (tier: string, badgeType?: string) => {
    if (tier.includes("一区") || tier.includes("TOP") || badgeType === "gold") {
      return "bg-amber-50 text-amber-900 border border-amber-300 font-bold";
    }
    if (tier.includes("二区") || badgeType === "blue") {
      return "bg-nenu-tint text-nenu-dark border border-nenu-line font-semibold";
    }
    return "bg-neutral-50 text-neutral-700 border border-neutral-200 font-medium";
  };

  return (
    <div className="mb-2">
      <ResumeSectionHeader icon={<Microscope className="w-3.5 h-3.5" />} title="科研成果" />

      <div className="space-y-1 text-[12px]">
        {papers.map((paper) => (
          <div key={paper.id} className="flex items-center justify-between py-0.5 gap-2">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <span
                className={`font-bold px-1.5 rounded text-[11px] flex-shrink-0 ${
                  paper.authorship === "第一作者"
                    ? "bg-nenu-tint text-nenu-dark border border-nenu-line"
                    : "bg-neutral-100 text-neutral-700 border border-neutral-200"
                }`}
              >
                {paper.authorship}
              </span>
              <span className="font-bold text-neutral-900 font-serif">{paper.journal}</span>
              <span className="text-neutral-600 text-[11.5px]">({paper.description})</span>
            </div>

            {/* Academic tier badge - prominently styled with gold/amber for Q1 TOP */}
            <span
              className={`text-[11px] px-1.5 rounded border flex-shrink-0 ${getTierBadgeStyle(
                paper.tier,
                paper.badgeType,
              )}`}
            >
              {paper.tier}
            </span>
          </div>
        ))}

        <div className="pt-0.5 text-[11.5px] text-neutral-700 font-medium flex items-center gap-1.5">
          {otherPublications}
        </div>
      </div>
    </div>
  );
};
