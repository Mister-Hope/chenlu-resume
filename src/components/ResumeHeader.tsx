import type { ReactElement } from "react";

import type { EducationItem, PersonalInfo } from "../types";
import { CandidateProfile } from "./CandidateProfile";
import { ResumeHeaderBar } from "./ResumeHeaderBar";

interface ResumeHeaderProps {
  info: PersonalInfo;
  education: EducationItem[];
}

/** 简历页眉：首行放校徽 / 资质标签 / 二维码，次行放证件照、候选人信息与教育背景 */
export const ResumeHeader = ({ info, education }: ResumeHeaderProps): ReactElement => (
  <header className="mb-2">
    <ResumeHeaderBar info={info} />
    <CandidateProfile info={info} education={education} />
  </header>
);
