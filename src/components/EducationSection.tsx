import { GraduationCap } from "lucide-react";
import type { ReactElement } from "react";

import type { EducationItem } from "../types";
import { ResumeSectionHeader } from "./ResumeSectionHeader";

interface EducationSectionProps {
  education: EducationItem[];
}

export const EducationSection = ({ education }: EducationSectionProps): ReactElement => (
  <div className="mb-2">
    <ResumeSectionHeader icon={<GraduationCap className="w-3.5 h-3.5" />} title="教育背景" />

    <div className="space-y-1">
      {education.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-[100px_160px_1fr_auto] items-center gap-2 text-[12.5px] py-0.5"
        >
          {/* Col 1: School */}
          <span className="font-bold text-neutral-900 text-[13px] tracking-tight">
            {item.school}
          </span>

          {/* Col 2: Major */}
          <span className="font-bold text-neutral-800 text-[12.5px]">{item.major}</span>

          {/* Col 3: Degree / Track */}
          <div>
            <span className="inline-block font-semibold text-nenu-dark bg-nenu-tint px-2 rounded border border-nenu-line text-[11.5px]">
              {item.degree}
            </span>
          </div>

          {/* Col 4: Period (Right Aligned) */}
          <span className="text-[11.5px] font-medium text-neutral-500 font-mono-date text-right tracking-tight">
            {item.period}
          </span>
        </div>
      ))}
    </div>
  </div>
);
