import React from "react";
import { PersonalInfo } from "../types";
import { Phone, Mail, MessageSquare, Award } from "lucide-react";
import { DEFAULT_AVATAR, DEFAULT_LOGO } from "../assets/defaultAssets";
import qrCodeUrl from "../assets/qr-code.svg";

/** 简历在线地址：二维码内容与它保持一致（改地址时同步重生成 src/assets/qr-code.svg） */
const ONLINE_RESUME_URL = "https://chenlu.innenu.com/";

interface ResumeHeaderProps {
  info: PersonalInfo;
}

export const ResumeHeader: React.FC<ResumeHeaderProps> = ({ info }) => {
  return (
    <header className="mb-2">
      {/* 1. Top Bar: 校徽与资质标签居左，二维码绝对定位在右侧（不撑高页眉、不挤压个人信息区） */}
      <div className="relative flex items-center justify-between gap-3 pb-1.5 mb-2 border-b border-neutral-200">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={info.schoolLogoUrl || DEFAULT_LOGO}
            alt="东北师范大学"
            className="h-8 object-contain flex-shrink-0"
          />
          <div className="flex items-center gap-2 text-[11px] font-semibold">
            {info.schoolBadges.map((badge) => (
              <span
                key={badge}
                className="text-nenu-dark bg-nenu-tint px-2 py-0.5 rounded border border-nenu-line"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* 右上角二维码：58px ≈ 15.3mm，A4 打印后模块约 0.53mm，向下略微压住页眉分隔线 */}
        <div className="absolute -top-0.5 right-0 flex items-center gap-1.5">
          <span className="text-[9px] leading-[11px] text-neutral-500 whitespace-nowrap">
            扫码看简历
          </span>
          <img
            src={qrCodeUrl}
            alt={`扫码打开在线简历 ${ONLINE_RESUME_URL}`}
            title={ONLINE_RESUME_URL}
            className="w-[58px] h-[58px] flex-shrink-0"
          />
        </div>
      </div>

      {/* 2. Candidate Profile Row: Photo on Left, Full-Width Details on Right */}
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
                <span>{info.gender || "女"}</span>
                <span className="text-neutral-300">/</span>
                <span>{info.age}岁</span>
                <span className="text-neutral-300">/</span>
                <span className="font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 rounded text-[11px]">
                  ★ {info.politicalStatus}
                </span>
              </div>
            </div>

            {/* Target Job Highlight Badge - 为右上角二维码让出位置下移，仍右对齐（不左移） */}
            <div className="mt-6 px-3.5 py-1 bg-nenu text-white rounded text-[14px] font-bold tracking-wide">
              求职意向：{info.targetPosition}
            </div>
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
    </header>
  );
};
