import React from "react";

interface ResumeSectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

export const ResumeSectionHeader: React.FC<ResumeSectionHeaderProps> = ({ icon, title }) => {
  return (
    <div className="flex items-center gap-1.5 mb-1.5 pb-0.5 border-b-[1.5px] border-[#259fc8]">
      <div className="w-4.5 h-4.5 rounded bg-[#259fc8] text-white flex items-center justify-center flex-shrink-0 text-xs">
        {icon}
      </div>
      <h2 className="text-[14.5px] font-bold tracking-wider text-neutral-900 font-serif-sc leading-none">
        {title}
      </h2>
    </div>
  );
};
