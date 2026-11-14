import type { PaperLevel } from "../types";

/** 成果级别 → 标签样式：一区 TOP 用金色突出，二区用主题蓝，其余保持中性 */
export const PAPER_LEVEL_BADGE_STYLE: Record<PaperLevel, string> = {
  top: "bg-amber-50 text-amber-900 border border-amber-300 font-bold",
  q2: "bg-nenu-tint text-nenu-dark border border-nenu-line font-semibold",
  q3: "bg-neutral-50 text-neutral-700 border border-neutral-200 font-medium",
  excellent: "bg-neutral-50 text-neutral-700 border border-neutral-200 font-medium",
  conference: "bg-neutral-50 text-neutral-700 border border-neutral-200 font-medium",
};
