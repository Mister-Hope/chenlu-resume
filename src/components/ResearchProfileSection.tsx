import { FlaskConical } from "lucide-react";
import type { ReactElement } from "react";

import type { ResearchProfile } from "../types";
import { ResumeSectionHeader } from "./ResumeSectionHeader";

interface ResearchProfileSectionProps {
  profile: ResearchProfile;
}

/** 科研简历的「研究内容」：毕业课题、研究方向与研究亮点 */
export const ResearchProfileSection = ({ profile }: ResearchProfileSectionProps): ReactElement => (
  <div className="mb-2">
    <ResumeSectionHeader icon={<FlaskConical className="w-3.5 h-3.5" />} title="研究内容" />

    <div className="space-y-1 text-[12px] leading-[1.45] text-neutral-800">
      <p>
        <span className="font-bold text-neutral-900">毕业课题：</span>
        <span className="font-serif-sc font-medium tracking-wide">{profile.thesis}</span>
      </p>

      <div className="flex items-start gap-2.5">
        <div className="flex w-[140px] flex-shrink-0 flex-col gap-0.5 pt-[1px]">
          <span className="font-bold whitespace-nowrap text-neutral-900">研究方向：</span>
          <div className="flex items-center gap-1">
            {profile.directions.map((direction) => (
              <span
                key={direction}
                className="whitespace-nowrap rounded-full border border-nenu-line bg-nenu-tint px-1.5 py-[1px] text-[9.5px] font-semibold text-nenu-dark"
              >
                {direction}
              </span>
            ))}
          </div>
        </div>

        <ul className="min-w-0 flex-1 list-disc space-y-0.5 pl-4 font-serif-sc text-[11px] font-medium leading-[1.45] tracking-wide marker:text-nenu">
          {profile.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
