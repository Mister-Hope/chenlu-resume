import { BookOpen } from "lucide-react";
import React from "react";

import { TeachingExperienceItem } from "../types";
import { ResumeSectionHeader } from "./ResumeSectionHeader";

interface TeachingSectionProps {
  experiences: TeachingExperienceItem[];
}

export const TeachingSection: React.FC<TeachingSectionProps> = ({ experiences }) => {
  return (
    <div className="mb-2">
      <ResumeSectionHeader icon={<BookOpen className="w-3.5 h-3.5" />} title="实践经验" />

      <div className="space-y-1.5 text-[12px]">
        {experiences.map((item) => (
          <div key={item.id} className="py-0.5">
            {/* Header: Organization | Role | Date */}
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-neutral-900 text-[12.5px]">{item.institution}</span>
                <span className="text-neutral-300">｜</span>
                <span className="font-bold text-nenu-dark">{item.role}</span>
              </div>
              <span className="text-[11.5px] font-medium text-neutral-500 font-mono-date flex-shrink-0 tracking-tight">
                {item.period}
              </span>
            </div>

            {/* Description: 与「个人荣誉」「自我评价」同款衬线正文 */}
            <p className="font-serif-sc font-medium text-neutral-800 tracking-wide leading-normal pl-1 mt-0.5">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
