import { Trophy } from "lucide-react";
import React from "react";

import { AwardCategory } from "../types";
import { ResumeSectionHeader } from "./ResumeSectionHeader";

interface HonorsSectionProps {
  awards: AwardCategory[];
}

/** 奖项名以「 ×N」结尾表示获得 N 次，这里把它拆出来单独高亮 */
const TIMES_SUFFIX = /\s*×(\d+)$/;

const splitTimes = (item: string): { name: string; times: string | null } => {
  const match = item.match(TIMES_SUFFIX);
  return match
    ? { name: item.slice(0, match.index), times: match[1] }
    : { name: item, times: null };
};

export const HonorsSection: React.FC<HonorsSectionProps> = ({ awards }) => {
  return (
    <div className="mb-2">
      <ResumeSectionHeader icon={<Trophy className="w-3.5 h-3.5" />} title="个人荣誉" />

      <div className="space-y-1 text-[12px] leading-[1.4]">
        {awards.map((category, idx) => (
          <div key={idx} className="flex items-baseline gap-1.5 py-0.5">
            <span className="font-serif-sc font-bold text-neutral-900 tracking-wide flex-shrink-0">
              {category.category}：
            </span>
            <span className="font-serif-sc font-medium text-neutral-800 tracking-wide">
              {category.items.map((item, itemIdx) => {
                const { name, times } = splitTimes(item);
                return (
                  <React.Fragment key={item}>
                    {itemIdx > 0 ? "、" : null}
                    {name}
                    {times ? <span className="text-nenu font-bold">×{times}</span> : null}
                  </React.Fragment>
                );
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
