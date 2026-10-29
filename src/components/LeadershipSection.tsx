import { Users } from "lucide-react";
import type { ReactElement } from "react";

import type { StudentWorkItem } from "../types";
import { ResumeSectionHeader } from "./ResumeSectionHeader";

interface LeadershipSectionProps {
  items: StudentWorkItem[];
}

export const LeadershipSection = ({ items }: LeadershipSectionProps): ReactElement => (
  <div className="mb-2">
    <ResumeSectionHeader icon={<Users className="w-3.5 h-3.5" />} title="主要学生工作" />

    <div className="space-y-1 text-[12px]">
      {items.map((item) => (
        <div key={item.id} className="py-0.5">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-neutral-900 text-[12.5px]">{item.role}</span>
              <span className="text-neutral-300">｜</span>
              <span className="text-neutral-800 font-medium">{item.organization}</span>
            </div>
            <span className="text-[11.5px] font-medium text-neutral-500 font-mono-date flex-shrink-0 tracking-tight">
              {item.period}
            </span>
          </div>
          {item.department && (
            <p className="font-serif-sc font-medium text-neutral-800 text-[11.5px] tracking-wide leading-[1.35] pl-1">
              {item.department}
            </p>
          )}
        </div>
      ))}
    </div>
  </div>
);
