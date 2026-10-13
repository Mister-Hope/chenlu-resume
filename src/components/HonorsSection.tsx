import { Trophy } from "lucide-react";
import React from "react";

import { AwardCategory } from "../types";
import { ResumeSectionHeader } from "./ResumeSectionHeader";

interface HonorsSectionProps {
  awards: AwardCategory[];
}

export const HonorsSection: React.FC<HonorsSectionProps> = ({ awards }) => {
  return (
    <div className="mb-2">
      <ResumeSectionHeader icon={<Trophy className="w-3.5 h-3.5" />} title="个人荣誉" />

      <div className="space-y-1 text-[12px]">
        {awards.map((category, idx) => (
          <div key={idx} className="flex items-baseline gap-1.5 py-0.5">
            <span className="font-serif-sc font-bold text-neutral-900 tracking-wide flex-shrink-0">
              {category.category}：
            </span>
            <span className="font-serif-sc font-medium text-neutral-800 tracking-wide leading-normal">
              {category.items.join("、")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
