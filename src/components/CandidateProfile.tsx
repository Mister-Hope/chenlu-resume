import { Phone, Mail, MessageSquare, Award } from "lucide-react";
import { Fragment } from "react";
import type { ReactElement } from "react";

import { DEFAULT_AVATAR } from "../assets/defaultAssets";
import type { EducationItem, PersonalInfo } from "../types";

interface CandidateProfileProps {
  info: PersonalInfo;
  education: EducationItem[];
}

/** 候选人信息区：证件照在左，姓名 / 学历 / 联系方式 / 资格证书 / 教育背景在右 */
export const CandidateProfile = ({ info, education }: CandidateProfileProps): ReactElement => (
  <div className="relative flex items-center gap-3.5 pb-2 border-b border-neutral-200">
    {/* Photo: Clean 1-inch portrait, static and crisp */}
    <div className="w-[100px] h-[136px] flex-shrink-0 rounded overflow-hidden border border-neutral-300">
      <img
        src={info.photoUrl ?? DEFAULT_AVATAR}
        alt={info.name}
        className="w-full h-full object-cover object-top"
      />
    </div>

    {/* Info Area: Stretches across the rest of the page */}
    <div className="flex-1 min-w-0 space-y-1">
      {/* Row 1: Name, Tags, Target Job */}
      <div className="flex items-start justify-between">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-[25px] font-bold text-neutral-900 tracking-wider font-serif-sc leading-none">
            {info.name}
          </h1>
          <div className="flex items-center gap-1.5 text-[12.5px] text-neutral-700 font-medium">
            <span>{info.gender ?? "女"}</span>
            <span className="text-neutral-300">/</span>
            <span>{info.age}岁</span>
            <span className="text-neutral-300">/</span>
            <span className="font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 rounded text-[11px]">
              ★ {info.politicalStatus}
            </span>
          </div>
        </div>

        {/* 求职意向：绝对定位，避免撑高姓名行；下移到二维码下方 */}
        {info.targetPosition ? (
          <div className="absolute top-3 right-0 rounded bg-nenu px-3.5 py-1 text-[14px] font-bold tracking-wide text-white">
            求职意向：{info.targetPosition}
          </div>
        ) : null}
      </div>

      {/* Row 2: University & Track */}
      <div className="text-[12.5px] text-neutral-800 flex items-center gap-2">
        <span className="font-bold text-neutral-900">毕业院校：</span>
        <span className="font-bold text-nenu-dark">{info.university}</span>
        <span className="text-neutral-300">｜</span>
        <span className="font-medium text-neutral-800">{info.degreeSummary}</span>
      </div>

      {/* Row 3: Contacts：允许换行，避免邮箱变长时溢出纸张 */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-0.5 text-[12px] text-neutral-800 pt-0.5">
        <div className="flex items-center gap-1">
          <Phone className="w-3.5 h-3.5 text-nenu flex-shrink-0" />
          <span className="font-bold text-neutral-900">电话：</span>
          <span className="font-medium tracking-wide">{info.phone}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="w-3.5 h-3.5 text-nenu flex-shrink-0" />
          <span className="font-bold text-neutral-900">微信：</span>
          <span className="font-medium">{info.wechat}</span>
        </div>
        <div className="flex items-center gap-1">
          <Mail className="w-3.5 h-3.5 text-nenu flex-shrink-0" />
          <span className="font-bold text-neutral-900">邮箱：</span>
          <span className="font-medium">{info.email}</span>
        </div>
      </div>

      {/* Row 4: Professional Qualifications */}
      <div className="flex items-center gap-1.5 text-[11.5px] pt-0.5">
        <div className="flex items-center gap-1 text-neutral-900 font-bold flex-shrink-0">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>资格证书：</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap text-neutral-800">
          {info.certificates.map((cert) => (
            <span
              key={cert}
              className="inline-flex items-center rounded-full bg-nenu-tint px-2 py-[2px] text-[11px] font-medium text-nenu-dark"
            >
              {cert}
            </span>
          ))}
        </div>
      </div>

      {/* Row 5: Education：并入照片右侧，按列对齐两段学历 */}
      <div className="grid grid-cols-[auto_auto_auto_auto_auto] justify-between items-baseline gap-x-2 gap-y-0.5 border-t border-dashed border-neutral-200 pt-1 text-[12.5px]">
        {education.map((item, index) => (
          <Fragment key={item.id}>
            <span className="text-[12.5px] font-bold text-neutral-900">
              {index === 0 ? "教育背景" : null}
            </span>
            <span className="text-[12.5px] font-bold text-neutral-900">{item.school}</span>
            <span className="font-semibold text-neutral-800">{item.major}</span>
            <span className="font-semibold text-nenu-dark">{item.degree}</span>
            <span className="text-right font-mono-date text-[12.5px] font-medium text-neutral-500 whitespace-nowrap">
              {item.period}
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  </div>
);
