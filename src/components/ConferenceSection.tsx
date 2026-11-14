import { Presentation } from "lucide-react";
import type { ReactElement } from "react";

import type { ConferenceItem } from "../types";
import { ResumeSectionHeader } from "./ResumeSectionHeader";

interface ConferenceSectionProps {
  items: ConferenceItem[];
}

/** 获奖类角色用金色，普通参会用主题蓝 */
const getRoleStyle = (role: string): string =>
  role.includes("奖")
    ? "border-amber-300 bg-amber-50 text-amber-900 font-bold"
    : "border-nenu-line bg-nenu-tint text-nenu-dark font-semibold";

/** 科研简历的「学术会议」：会议名称、地点、参会角色与时间 */
export const ConferenceSection = ({ items }: ConferenceSectionProps): ReactElement => (
  <div className="mb-2">
    <ResumeSectionHeader icon={<Presentation className="w-3.5 h-3.5" />} title="学术会议" />

    <div className="space-y-0.5 text-[12px]">
      {items.map((item) => (
        <div key={item.id} className="flex items-baseline justify-between gap-2 py-0.5">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-[12px] font-bold text-neutral-900">{item.name}</span>
            {item.location ? (
              <span className="text-[11px] font-medium text-neutral-500">{item.location}</span>
            ) : null}
            <span className={`rounded border px-1.5 text-[10.5px] ${getRoleStyle(item.role)}`}>
              {item.role}
            </span>
          </div>
          <span className="flex-shrink-0 font-mono-date text-[11.5px] font-medium tracking-tight text-neutral-500">
            {item.period}
          </span>
        </div>
      ))}
    </div>
  </div>
);
