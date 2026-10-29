import { resumeData } from "./resumeData.ts";

/** 简历的公开访问地址：二维码、OG 元信息都以它为准 */
export const SITE_URL = "https://chenlu.innenu.com/";

const { degreeSummary, name, targetPosition, university } = resumeData.personalInfo;

/** 取级别最高的期刊论文，用于自动生成站点简介 */
const topPaper = resumeData.researchPapers.find((paper) => paper.level === "top");

/**
 * 站点元信息。
 *
 * `index.html` 中的 `{{...}}` 占位符由 `vite.config.ts` 用这里的值填充， 因此标题、简介、地址都只需要维护这一份。
 */
export const siteMeta = {
  /** <html lang> */
  lang: "zh-CN",
  /** Og:locale */
  locale: "zh_CN",
  /** <meta name="author"> */
  author: name,
  /** <title> 与 og:title / twitter:title */
  title: `${name}的个人简历`,
  /** Description / og:description / twitter:description */
  description: `${[
    `${university}${degreeSummary}`,
    topPaper ? `${topPaper.authorship}在 ${topPaper.journal} 等期刊发表论文` : "",
    targetPosition ? `求职意向：${targetPosition}` : "",
  ]
    .filter(Boolean)
    .join("；")}。`,
  /** Og:url 与二维码内容 */
  url: SITE_URL,
  /** 浏览器地址栏主题色（与校徽主色一致） */
  themeColor: "#004386",
};
