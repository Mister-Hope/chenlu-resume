import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import type { Plugin } from "vite";

import { siteMeta } from "./src/data/siteMeta.ts";

/**
 * Index.html 占位符 → 实际文案。
 *
 * 新增占位符时三处同步：index.html、这里、src/data/siteMeta.ts。
 */
const HTML_TOKENS: Record<string, string> = {
  "{{SITE_LANG}}": siteMeta.lang,
  "{{SITE_LOCALE}}": siteMeta.locale,
  "{{SITE_AUTHOR}}": siteMeta.author,
  "{{SITE_TITLE}}": siteMeta.title,
  "{{SITE_DESCRIPTION}}": siteMeta.description,
  "{{SITE_URL}}": siteMeta.url,
  "{{SITE_THEME_COLOR}}": siteMeta.themeColor,
};

/**
 * 把文本转义成可安全放进 HTML 属性值的形式。
 *
 * @param value 原始文本
 * @returns 转义后的文本
 */
const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/**
 * 用站点元信息填充 index.html 的占位符。
 *
 * 有未登记的占位符残留时直接抛错，避免把 `{{...}}` 发到线上。
 *
 * @returns Vite 插件
 */
const htmlTemplate = (): Plugin => ({
  name: "resume-html-template",
  transformIndexHtml: {
    order: "pre",
    handler: (html) => {
      const filled = Object.entries(HTML_TOKENS).reduce(
        (output, [token, value]) => output.replaceAll(token, escapeHtml(value)),
        html,
      );
      const leftover = /\{\{[A-Z_]+\}\}/u.exec(filled);

      if (leftover) throw new Error(`index.html 存在未填充的占位符：${leftover[0]}`);

      return filled;
    },
  },
});

export default defineConfig({
  plugins: [htmlTemplate(), react(), tailwindcss()],
  server: {
    allowedHosts: true,
  },
});
