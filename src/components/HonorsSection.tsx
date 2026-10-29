import { Trophy } from "lucide-react";
import { Fragment } from "react";
import type { ReactElement } from "react";

import type { AwardCategory } from "../types";
import { ResumeSectionHeader } from "./ResumeSectionHeader";

interface HonorsSectionProps {
  awards: AwardCategory[];
}

/** 奖项名以「 ×N」结尾表示获得 N 次，这里把它拆出来单独高亮 */
const TIMES_SUFFIX = /\s*×(?<times>\d+)$/u;

const splitTimes = (item: string): { name: string; times: string | null } => {
  const match = TIMES_SUFFIX.exec(item);

  return match?.groups
    ? { name: item.slice(0, match.index), times: match.groups.times }
    : { name: item, times: null };
};

export const HonorsSection = ({ awards }: HonorsSectionProps): ReactElement => (
  <div className="mb-2">
    <ResumeSectionHeader icon={<Trophy className="w-3.5 h-3.5" />} title="个人荣誉" />

    <div className="space-y-1 text-[12px] leading-[1.4]">
      {awards.map((category) => (
        <div key={category.category} className="flex items-baseline gap-1.5 py-0.5">
          <span className="font-serif-sc font-bold text-neutral-900 tracking-wide flex-shrink-0">
            {category.category}：
          </span>
          <span className="font-serif-sc font-medium text-neutral-800 tracking-wide">
            {category.items.map((item, itemIdx) => {
              const { name, times } = splitTimes(item);
              return (
                <Fragment key={item}>
                  {itemIdx > 0 ? "、" : null}
                  {name}
                  {times ? <span className="text-nenu font-bold">×{times}</span> : null}
                </Fragment>
              );
            })}
          </span>
        </div>
      ))}
    </div>
  </div>
);
