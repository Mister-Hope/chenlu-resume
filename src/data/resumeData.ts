import type { ResumeData, ResumeVariant } from "../types.ts";
import { researchResume } from "./researchResume.ts";
import { teachingResume } from "./teachingResume.ts";

/**
 * 按构建方向取对应简历数据；教师方向为默认值。
 *
 * @param variant 教师 / 科研方向
 * @returns 对应方向的简历数据
 */
export const getResumeData = (variant: ResumeVariant): ResumeData =>
  variant === "research" ? researchResume : teachingResume;
