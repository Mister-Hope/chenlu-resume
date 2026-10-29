import type { ReactElement } from "react";

import { DEFAULT_LOGO } from "../assets/defaultAssets";
import qrCodeUrl from "../assets/qr-code.svg";
import type { PersonalInfo } from "../types";

/** 简历在线地址：二维码内容与它保持一致（改地址时同步重生成 src/assets/qr-code.svg） */
const ONLINE_RESUME_URL = "https://chenlu.innenu.com/";

interface ResumeHeaderBarProps {
  info: PersonalInfo;
}

/**
 * 页眉首行：校徽与资质标签居左，二维码绝对定位在右侧。
 *
 * 二维码不参与 flex 布局，因此不会撑高页眉、也不会挤窄下方的个人信息区。
 */
export const ResumeHeaderBar = ({ info }: ResumeHeaderBarProps): ReactElement => (
  <div className="relative flex items-center justify-between gap-3 pb-1.5 mb-2 border-b border-neutral-200">
    <div className="flex items-center gap-2.5 min-w-0">
      <img
        src={info.schoolLogoUrl ?? DEFAULT_LOGO}
        alt={info.university}
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
);
