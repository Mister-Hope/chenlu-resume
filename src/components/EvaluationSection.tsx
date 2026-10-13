import { UserCheck } from "lucide-react";
import React from "react";

import { ResumeSectionHeader } from "./ResumeSectionHeader";

interface EvaluationSectionProps {
  paragraphs: string[];
}

export const EvaluationSection: React.FC<EvaluationSectionProps> = ({ paragraphs }) => {
  return (
    <div className="mb-0">
      <ResumeSectionHeader icon={<UserCheck className="w-3.5 h-3.5" />} title="自我评价" />

      {/* Styled with cultured Noto Serif SC for an elegant, scholarly educator reflection */}
      <div className="font-serif-sc text-[12px] text-neutral-800 leading-[1.45] space-y-0.5 pl-1 tracking-wide">
        {paragraphs.map((p, idx) => (
          <p key={idx} className="flex items-start gap-1.5">
            <span className="text-nenu font-bold text-[10px] mt-0.5 flex-shrink-0 font-sans">
              ▪
            </span>
            <span className="font-medium">{p}</span>
          </p>
        ))}
      </div>
    </div>
  );
};
