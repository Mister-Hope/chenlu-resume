import type { ReactElement, ReactNode } from "react";

interface ResumeSectionHeaderProps {
  icon: ReactNode;
  title: string;
}

export const ResumeSectionHeader = ({ icon, title }: ResumeSectionHeaderProps): ReactElement => (
  <div className="flex items-center gap-1.5 mb-1.5 pb-0.5 border-b-[1.5px] border-nenu">
    <div className="w-4.5 h-4.5 rounded bg-nenu text-white flex items-center justify-center flex-shrink-0 text-xs">
      {icon}
    </div>
    <h2 className="text-[14.5px] font-bold tracking-wider text-neutral-900 font-serif-sc leading-none">
      {title}
    </h2>
  </div>
);
