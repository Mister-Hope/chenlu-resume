import { Microscope } from "lucide-react";
import type { ReactElement } from "react";

import type { PaperLevel, ResearchPaper } from "../types";
import { ResumeSectionHeader } from "./ResumeSectionHeader";

interface ResearchSectionProps {
  papers: ResearchPaper[];
  otherPublications: string;
}

/** 成果级别 → 标签样式：一区 TOP 用金色突出，二区用主题蓝，其余保持中性 */
const LEVEL_BADGE_STYLE: Record<PaperLevel, string> = {
  top: "bg-amber-50 text-amber-900 border border-amber-300 font-bold",
  q2: "bg-nenu-tint text-nenu-dark border border-nenu-line font-semibold",
  q3: "bg-neutral-50 text-neutral-700 border border-neutral-200 font-medium",
  excellent: "bg-neutral-50 text-neutral-700 border border-neutral-200 font-medium",
  conference: "bg-neutral-50 text-neutral-700 border border-neutral-200 font-medium",
};

/** 需要突出显示的署名位次：一作与共同一作用主题蓝，其余（二作、通讯等）用中性色 */
const FIRST_AUTHOR_LABELS = new Set(["第一作者", "共同一作"]);

/**
 * 作者标签样式：突出第一作者与共同一作，其余署名保持中性。
 *
 * @param authorship 署名文案
 * @returns 对应的样式类名
 */
const getAuthorshipStyle = (authorship: string): string =>
  FIRST_AUTHOR_LABELS.has(authorship)
    ? "bg-nenu-tint text-nenu-dark border border-nenu-line"
    : "bg-neutral-100 text-neutral-700 border border-neutral-200";

export const ResearchSection = ({
  papers,
  otherPublications,
}: ResearchSectionProps): ReactElement => (
  <div className="mb-2">
    <ResumeSectionHeader icon={<Microscope className="w-3.5 h-3.5" />} title="科研成果" />

    <div className="space-y-1 text-[12px]">
      {papers.map((paper) => (
        <div key={paper.id} className="flex items-center justify-between py-0.5 gap-2">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span
              className={`font-bold px-1.5 rounded text-[11px] flex-shrink-0 ${getAuthorshipStyle(
                paper.authorship,
              )}`}
            >
              {paper.authorship}
            </span>
            <span className="font-bold text-neutral-900 font-serif">{paper.journal}</span>
            <span className="text-neutral-600 text-[11.5px]">({paper.description})</span>
          </div>

          {/* 学术级别标签：配色只取决于 level，改 tier 文案不会影响样式 */}
          <span
            className={`text-[11px] px-1.5 rounded border flex-shrink-0 ${
              LEVEL_BADGE_STYLE[paper.level]
            }`}
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
