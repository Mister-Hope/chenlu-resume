import { FileText } from "lucide-react";
import type { ReactElement } from "react";

import type { PublicationSummary, ResearchPaper } from "../types";
import { PAPER_LEVEL_BADGE_STYLE } from "./paperLevelStyles";
import { ResumeSectionHeader } from "./ResumeSectionHeader";

interface PublicationsSectionProps {
  papers: ResearchPaper[];
  participation?: PublicationSummary;
}

/** 学术成果的分组顺序：一作在前，共同一作其次；参与作者合并为一行汇总 */
const AUTHORSHIP_GROUPS = ["第一作者", "共同一作"] as const;

/** 科研简历的「学术成果」：按署名位次分组，展示作者、期刊、年份与影响因子 */
export const PublicationsSection = ({
  papers,
  participation,
}: PublicationsSectionProps): ReactElement => (
  <div className="mb-2">
    <ResumeSectionHeader icon={<FileText className="w-3.5 h-3.5" />} title="学术成果" />

    <div className="space-y-1.5">
      {AUTHORSHIP_GROUPS.map((authorship) => {
        const group = papers.filter((paper) => paper.authorship === authorship);

        if (group.length === 0) return null;

        return (
          <div key={authorship}>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-nenu">{authorship}</span>
              <span className="text-[10px] font-medium text-neutral-500">{group.length} 篇</span>
              <span className="h-px flex-1 bg-neutral-200" />
            </div>

            {group.map((paper) => (
              <article
                key={paper.id}
                className="mt-0.5 flex items-baseline justify-between gap-2 py-0.5"
              >
                <p className="min-w-0 text-[10.5px] leading-[1.4] text-neutral-600">
                  {paper.authors ? (
                    <span className="font-semibold text-neutral-900">{paper.authors}</span>
                  ) : null}
                  {paper.authors ? " · " : null}
                  <span className="font-serif font-semibold italic text-neutral-900">
                    {paper.journal}
                  </span>
                  {paper.year ? `, ${paper.year}` : null}
                  {paper.impactFactor ? ` · IF ${paper.impactFactor}` : null}
                </p>
                <span
                  className={`flex-shrink-0 rounded px-1.5 text-[10.5px] ${
                    PAPER_LEVEL_BADGE_STYLE[paper.level]
                  }`}
                >
                  {paper.tier}
                </span>
              </article>
            ))}
          </div>
        );
      })}

      {participation ? (
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-dashed border-neutral-200 pt-1">
          <span className="text-[11px] font-bold text-nenu">参与作者</span>
          <span className="text-[10.5px] font-medium text-neutral-600">
            作为参与作者发表论文 {participation.count} 篇
          </span>
          {participation.badges.map((badge, index) => (
            <span
              key={badge.label}
              className={`${index === 0 ? "ml-auto" : ""} rounded px-1.5 text-[10px] ${
                PAPER_LEVEL_BADGE_STYLE[badge.level]
              }`}
            >
              {badge.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  </div>
);
