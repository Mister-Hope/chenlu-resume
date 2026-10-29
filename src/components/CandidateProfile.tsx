import { Phone, Mail, MessageSquare, Award } from "lucide-react";
import type { ReactElement } from "react";

import { DEFAULT_AVATAR } from "../assets/defaultAssets";
import type { PersonalInfo } from "../types";

interface CandidateProfileProps {
  info: PersonalInfo;
}

/** 候选人信息区：证件照在左，姓名 / 学历 / 联系方式 / 资格证书在右 */
export const CandidateProfile = ({ info }: CandidateProfileProps): ReactElement => (
  <div className="flex items-center gap-3.5 pb-2 border-b border-neutral-200">
    {/* Photo: Clean 1-inch portrait, static and crisp */}
    <div className="w-[88px] h-[120px] flex-shrink-0 rounded overflow-hidden border border-neutral-300">
      <img
        src={info.photoUrl || DEFAULT_AVATAR}
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

        {/* 求职意向：为右上角二维码让位而下移，未填写时整个标签不渲染 */}
        {info.targetPosition ? (
          <div className="mt-6 px-3.5 py-1 bg-nenu text-white rounded text-[14px] font-bold tracking-wide">
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

      {/* Row 3: Contacts (Full width, clear spacing, never truncates!) */}
      <div className="flex items-center gap-5 text-[12px] text-neutral-800 pt-0.5">
        <div className="flex items-center gap-1 flex-shrink-0">
          <Phone className="w-3.5 h-3.5 text-nenu flex-shrink-0" />
          <span className="font-bold text-neutral-900">电话：</span>
          <span className="font-medium tracking-wide">{info.phone}</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <MessageSquare className="w-3.5 h-3.5 text-nenu flex-shrink-0" />
          <span className="font-bold text-neutral-900">微信：</span>
          <span className="font-medium">{info.wechat}</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
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
    </div>
  </div>
);
