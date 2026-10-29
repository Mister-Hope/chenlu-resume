import type { ReactElement } from "react";

import type { PersonalInfo } from "../types";
import { CandidateProfile } from "./CandidateProfile";
import { ResumeHeaderBar } from "./ResumeHeaderBar";

interface ResumeHeaderProps {
  info: PersonalInfo;
}

/** 简历页眉：首行放校徽 / 资质标签 / 二维码，次行放证件照与候选人信息 */
export const ResumeHeader = ({ info }: ResumeHeaderProps): ReactElement => (
  <header className="mb-2">
    <ResumeHeaderBar info={info} />
    <CandidateProfile info={info} />
  </header>
);
