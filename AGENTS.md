# AGENTS.md

面向开发者与 AI 助手的项目说明。访客视角的介绍见 [README.md](./README.md)。

## 概览

单页 A4 求职简历，技术栈：React 19 + Vite 8 + Tailwind CSS v4 + TypeScript，lint / 格式化用 oxlint + oxfmt（配置继承 `oxc-config-hope`）。无后端、无路由、无状态管理，整个应用就是一个静态页面。

## 命令

```bash
pnpm dev         # 本地预览
pnpm build       # 构建到 dist/
pnpm check       # TypeScript 类型检查（tsc --noEmit）
pnpm lint        # 自动修复：oxlint --fix && oxfmt
pnpm lint:check  # 只校验不改文件，CI 使用
pnpm fonts:fetch # 联网重新生成离线字体子集
pnpm clean       # 删除 dist/
```

`oxc-config-hope` 默认开启 `denyWarnings: true` 与 `maxWarnings: 10`，**任何 warning 都会让 `pnpm lint` 退出码为 1**。因此要么改代码满足规则，不要为了消警告去关规则；`oxlint.config.ts` 里只保留确实需要的规则覆盖（目前仅 `react/function-component-definition` 与 `scripts/**` 的少量豁免）。

## 目录结构

```
index.html                     HTML 模板，含 {{占位符}}
vite.config.ts                 Vite 配置 + HTML 占位符填充插件
src/main.tsx                   React 挂载入口
src/App.tsx                    页面骨架，按顺序拼装各板块
src/index.css                  Tailwind 入口、主题色、A4 纸张与打印样式
src/fonts.css                  由 fonts:fetch 自动生成，勿手改
src/types.ts                   所有数据类型
src/data/resumeData.ts         简历正文（唯一内容来源）
src/data/siteMeta.ts           站点元信息（标题 / 简介 / 地址）
src/components/                各板块组件 + A4Page + PrintToolbar
src/assets/                    头像、校徽、二维码、字体子集
scripts/fetch-fonts.mjs        字体子集化下载 + 覆盖校验
```

## 内容修改：只动数据文件

简历正文全部在 `src/data/resumeData.ts`，组件只负责渲染。改文案不需要碰组件。

- 导出名是 `resumeData`（不要改成 `initialResumeData` 之类的名字，项目没有编辑态）。
- `photoUrl` / `schoolLogoUrl` 是可选项，留空时组件回退到 `src/assets` 里的默认图片；**不要在数据里再写一遍默认值**。
- 奖项名以「 ×N」结尾表示获得 N 次，`HonorsSection` 会把 `×N` 拆出来渲染成主题蓝加粗。
- `ResearchPaper.authorship` 是普通字符串（不限定枚举），可以是「第一作者」「共同一作」「第二作者」「通讯作者」等；`ResearchSection` 只把「第一作者」「共同一作」高亮，其余用中性色。
- `ResearchPaper.level` 是 `"top" | "q2" | "q3" | "excellent" | "conference"`，决定右侧标签配色；`tier` 只是展示文案。**样式只看 `level`，不要改回用 `tier` 字符串匹配**——那样改文案就会改颜色。
- 中文正文统一用全角标点（`（）`、`；`、`，`），别混半角。

## 硬性约束：必须保持单页

这是本项目的核心约束。`src/index.css` 的 `@media print` 给 `.a4-page-root` 设了固定 `height: 297mm` 与 `overflow: hidden`，**内容一旦超过一页，打印 / 导出 PDF 会静默裁掉底部，屏幕上却只是溢出纸张边缘，不会有任何报错**。

- `A4Page` 在开发模式下会在字体加载完成后测量 `scrollHeight - clientHeight`，溢出时在控制台打印 `[A4] 内容已超出单页 …` 警告。看到这条警告必须精简文案或收紧行高。
- 文案是简历内容，通常不该为了塞下而删减；优先调整各区 `leading-*`（当前个人荣誉 `1.4`、学生工作 `1.35`、自我评价 `1.45`）与 `mb-*` 间距。
- 改动内容后务必跑一次打印预览确认仍是单页。

## A4 缩放实现

`src/components/A4Page.tsx`：

- 纸张宽度固定 `210mm`，用 `ResizeObserver` 观察舞台宽度，算出 `scale = min(1, 可用宽度 / 纸张宽度)`，写入 CSS 变量 `--a4-scale`。
- `.a4-scaler` 的 `width/height` 是**缩放后**的尺寸，纸张本体用 `transform: scale()` 变换，所以内部排版永远不重排，任何屏幕宽度都是同一页。
- 用 `useLayoutEffect` 计算，避免窄屏首帧先画一张未缩放的 A4 再跳回。
- 缩放有迟滞（`SCALE_HYSTERESIS`），但**只抑制放大**：容器变窄必须立即缩小，否则纸张会比容器宽几个像素、出现横向滚动条。
- 右上角悬浮按钮的占位宽度是运行时 `getBoundingClientRect()` 量出来的（`measureToolbarZone`），不要改回硬编码常量——改按钮文案就会失效。
- `.a4-stage` 设了 `scrollbar-gutter: stable both-edges`，避免滚动条出现 / 消失导致可用宽度反复变化；打印时这条会被重置。

## index.html 模板占位符

`index.html` 里不写死姓名、地址、简介，而是用 `{{SITE_XXX}}` 占位符，由 `vite.config.ts` 的 `resume-html-template` 插件在 `transformIndexHtml`（`order: "pre"`）阶段用 `src/data/siteMeta.ts` 的值填充，并做 HTML 转义。

新增占位符要同步三处：`index.html`、`vite.config.ts` 的 `HTML_TOKENS`、`src/data/siteMeta.ts`。插件检测到残留的 `{{大写字母}}` 会直接抛错，防止把占位符发到线上。

`siteMeta.ts` 只能依赖纯数据模块（不能 import 任何资源文件），因为 `vite.config.ts` 会在构建前直接执行它。

注意：Vite 未来的 `configLoader: 'native'` 要求 config 里 import 的应用代码带文件扩展名，因此 `vite.config.ts`、`siteMeta.ts`、`resumeData.ts` 之间的相互引用写成 `"./xxx.ts"`，不要去掉扩展名。

## 字体：完全离线子集

`scripts/fetch-fonts.mjs` 扫描 `src/**` 与 `index.html`，收集实际用到的字符，通过 Google Fonts CSS2 API 的 `text=` 参数 + `wght@400..700` 可变轴，为 4 个字体族各生成一个只含这些字的 woff2（合计约 340 KB）。

- 脚本会剥离块注释与行注释（`//` 前不是冒号才算行注释，以保留 `https://` 这类 URL），避免注释里的汉字被算进子集。
- 结束后解析 woff2 的 cmap 校验「所有字符均有字形覆盖」，有缺失会以 ⚠️ 列出。
- **新增任何此前没出现过的字符（汉字、`×`、全角符号都算）都必须重跑 `pnpm fonts:fetch`**，否则新字回退系统字体（不乱码，但字形不统一）。
- `scripts/fetch-fonts.mjs` 里 `readCmap` 拆成 `readFormat4` / `readFormat12` 是为了满足 `max-depth` 规则；位运算与 `console` 已通过 `oxlint.config.ts` 的 `scripts/**` override 豁免。

## 二维码

`src/assets/qr-code.svg` 是在线简历地址的二维码（25×25 模块、ECC M、quiet zone 2 模块），构建时会被内联进 JS。地址常量来自 `siteMeta.url`，换域名时两件事都要做：

1. 改 `src/data/siteMeta.ts` 的 `SITE_URL`；
2. 重新生成二维码：

```bash
pnpm dlx qrcode -t svg -q 2 -e M -o src/assets/qr-code.svg "https://新地址/"
```

二维码用绝对定位挂在页眉右上角，不参与 flex 布局，所以不会撑高页眉、也不会挤窄下方联系方式。旁边的「扫码看简历」文案是 `text-[10px]`，再小打印出来会糊。

## 代码约定

- **组件一律箭头函数 + 显式返回类型**：`export const Foo = (props: FooProps): ReactElement => (...)`。这是 `react/function-component-definition` 规则要求的，不要写成 `function Foo() {}`。
- 一个文件只导出一个 React 组件（`react/no-multi-comp`），所以页眉被拆成 `ResumeHeader` / `ResumeHeaderBar` / `CandidateProfile` 三个文件。
- 类型导入必须用 `import type`（`verbatimModuleSyntax` 已开启）。
- `tsconfig.json` 继承 `@mr-hope/tsconfig/web.json`，`strict`、`noUnusedLocals`、`verbatimModuleSyntax` 全开。
- 组件里不要用 `React.FC`（依赖全局命名空间且需要额外导入），直接给参数与返回值加类型。
- 主题色集中在 `src/index.css` 的 `@theme`（`--color-nenu*`），改主题只改那一处。
- 图片资源保持原样，不要自行压缩或改尺寸。

## 打印样式要点

`src/index.css` 的 `@media print` 里，以下重置都是踩过坑才加的，不要随手删：

- 取消 `--a4-scale` 缩放，按原始 A4 输出。
- `.a4-stage` 清掉 `overflow` 与 `scrollbar-gutter`，否则预留的滚动条空间会让 210mm 的纸横向溢出。
- `.a4-app-shell` 的 `height` 改为 `auto`，否则 `100dvh` 会把内容撑出 297mm、多出空白页。
- `print-color-adjust: exact` 保证背景色块（荣誉标签、级别徽标）能打印出来，所以打印对话框里必须勾选「背景图形」。
