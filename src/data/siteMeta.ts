import type { ResumeVariant } from "../types.ts";
import { getResumeData } from "./resumeData.ts";

/** 简历的公开访问地址：二维码、OG 元信息都以它为准 */
export const SITE_URL = "https://chenlu.innenu.com/";

export interface SiteMeta {
  /** <html lang> */
  lang: string;
  /** Og:locale */
  locale: string;
  /** <meta name="author"> */
  author: string;
  /** <title> 与 og:title / twitter:title */
  title: string;
  /** Description / og:description / twitter:description */
  description: string;
  /** Og:url 与二维码内容 */
  url: string;
  /** 浏览器地址栏主题色（与校徽主色一致） */
  themeColor: string;
  /** 社交平台分享大图，必须是绝对地址；文件位于 public/og-image.png */
  ogImage: string;
  /** 分享大图尺寸，供抓取器预先排版 */
  ogImageWidth: number;
  ogImageHeight: number;
}

/**
 * 按简历方向生成站点元信息。
 *
 * `index.html` 中的 `{{...}}` 占位符由 `vite.config.ts` 用这里的值填充， 因此标题、简介、地址都只需要维护这一份。
 *
 * @param variant 教师 / 科研方向
 * @returns 对应方向的站点元信息
 */
export const getSiteMeta = (variant: ResumeVariant): SiteMeta => {
  const resumeData = getResumeData(variant);
  const { degreeSummary, name, targetPosition, university } = resumeData.personalInfo;
  const firstAuthorPaper = resumeData.researchPapers.find(
    (paper) => paper.authorship === "第一作者",
  );
  const researchDirection =
    resumeData.variant === "research" ? resumeData.researchProfile.directions.join("、") : "";

  return {
    lang: "zh-CN",
    locale: "zh_CN",
    author: name,
    title: variant === "research" ? `${name}的学术简历` : `${name}的个人简历`,
    description: `${[
      `${university}${degreeSummary}`,
      researchDirection ? `研究方向：${researchDirection}` : "",
      firstAuthorPaper ? `第一作者在 ${firstAuthorPaper.journal} 等期刊发表论文` : "",
      targetPosition ? `求职意向：${targetPosition}` : "",
    ]
      .filter(Boolean)
      .join("；")}。`,
    url: SITE_URL,
    themeColor: "#004386",
    ogImage: `${SITE_URL}og-image.png`,
    ogImageWidth: 1200,
    ogImageHeight: 630,
  };
};
