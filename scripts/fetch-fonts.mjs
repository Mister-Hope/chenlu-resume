#!/usr/bin/env node
/**
 * 按需子集化下载 Google Fonts，生成完全离线的本地字体（无任何 CDN 依赖）。
 *
 * 原理：Google Fonts CSS2 API 的 `text=` 参数会返回「只包含所给字符」的子集字体， 再配合 `wght@400..700` 可变字体轴，每个字体族只需 1 个
 * woff2 文件即可覆盖全部字重。
 *
 * 用法：`pnpm fonts:fetch`
 *
 * 注意：字符集是扫描 `src/**` 与 `index.html` 得到的。**如果简历正文新增了从未出现过的汉字**，
 * 需要重新运行本脚本，否则新字会回退到系统字体（不会显示异常，只是字形不统一）。
 */
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { brotliDecompressSync } from "node:zlib";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FONT_DIR = join(ROOT, "src/assets/fonts");
const CSS_FILE = join(ROOT, "src/fonts.css");

/** 现代 Chrome UA：让 Google 返回 woff2 + 可变字体。 */
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const FONTS = [
  { slug: "noto-sans-sc", family: "Noto Sans SC", stack: '"Noto Sans SC"' },
  { slug: "noto-serif-sc", family: "Noto Serif SC", stack: '"Noto Serif SC"' },
  { slug: "plus-jakarta-sans", family: "Plus Jakarta Sans", stack: '"Plus Jakarta Sans"' },
  { slug: "jetbrains-mono", family: "JetBrains Mono", stack: '"JetBrains Mono"' },
].map((font) => ({
  ...font,
  // 项目用到的字重范围：400 常规 / 500 medium / 600 semibold / 700 bold
  axis: "wght@400..700",
  face: `"${font.family}"`,
}));

/** 收集项目实际用到的所有可打印字符，作为子集字符集。 */
function collectCharset() {
  const sources = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walk(path);
      else if ([".ts", ".tsx", ".css", ".html"].includes(extname(path))) sources.push(path);
    }
  };

  walk(join(ROOT, "src"));
  sources.push(join(ROOT, "index.html"));

  const text = sources
    .filter((path) => path !== CSS_FILE)
    .map((path) => readFileSync(path, "utf8"))
    // 注释不会渲染到页面上，去掉块注释以免把说明文字也算进字符集
    .map((source) => source.replace(/\/\*[\s\S]*?\*\//g, ""))
    .join("\n");

  const isPrintable = (codePoint) =>
    (codePoint >= 0x20 && codePoint <= 0x7e) || // ASCII
    (codePoint >= 0xa0 && codePoint <= 0x2bff) || // 拉丁扩展 / 通用标点 / 符号
    (codePoint >= 0x3000 && codePoint <= 0x303f) || // CJK 标点
    (codePoint >= 0xff00 && codePoint <= 0xffef) || // 全角字符
    (codePoint >= 0x3400 && codePoint <= 0x9fff); // CJK 汉字

  return [...new Set([...text].filter((char) => isPrintable(char.codePointAt(0))))].join("");
}

/** 请求某个字体族的子集 CSS，并把其中的字体文件下载到本地。 */
async function fetchFont(font, charset) {
  const url =
    `https://fonts.googleapis.com/css2?family=${font.family.replace(/ /g, "+")}` +
    `:${font.axis}&display=swap&text=${encodeURIComponent(charset)}`;

  const response = await fetch(url, { headers: { "User-Agent": UA } });
  if (!response.ok) throw new Error(`${font.family}: CSS 请求失败 (HTTP ${response.status})`);

  const css = await response.text();
  const remote = css.match(/url\((https:[^)]+)\)/)?.[1];
  if (!remote) throw new Error(`${font.family}: CSS 中未找到字体文件 URL`);

  const fontResponse = await fetch(remote, { headers: { "User-Agent": UA } });
  if (!fontResponse.ok)
    throw new Error(`${font.family}: 字体下载失败 (HTTP ${fontResponse.status})`);

  const { buffer, byteLength } = await fontResponse.arrayBuffer().then((buffer) => ({
    buffer,
    byteLength: buffer.byteLength,
  }));

  mkdirSync(FONT_DIR, { recursive: true });
  writeFileSync(join(FONT_DIR, `${font.slug}.woff2`), Buffer.from(buffer));

  return byteLength;
}

const charset = collectCharset();
const results = [];

for (const font of FONTS) {
  results.push({ font, bytes: await fetchFont(font, charset) });
}

/** Woff2 表目录中的「已知表标签」索引表，用于定位 cmap。 */
const KNOWN_TAGS = [
  "cmap",
  "head",
  "hhea",
  "hmtx",
  "maxp",
  "name",
  "OS/2",
  "post",
  "cvt ",
  "fpgm",
  "glyf",
  "loca",
  "prep",
  "CFF ",
  "VORG",
  "EBDT",
  "EBLC",
  "gasp",
  "hdmx",
  "kern",
  "LTSH",
  "PCLT",
  "VDMX",
  "vhea",
  "vmtx",
  "BASE",
  "GDEF",
  "GPOS",
  "GSUB",
  "EBSC",
  "JSTF",
  "MATH",
  "CBDT",
  "CBLC",
  "COLR",
  "CPAL",
  "SVG ",
  "sbix",
  "acnt",
  "avar",
  "bdat",
  "bloc",
  "bsln",
  "cvar",
  "fdsc",
  "feat",
  "fmtx",
  "fvar",
  "gvar",
  "hsty",
  "just",
  "lcar",
  "mort",
  "morx",
  "opbd",
  "prop",
  "trak",
  "Zapf",
  "Silf",
  "Glat",
  "Gloc",
  "Feat",
  "Sill",
];

const readBase128 = (buffer, start) => {
  let value = 0;
  let index = start;
  for (let n = 0; n < 5; n++) {
    const byte = buffer[index++];
    value = (value << 7) | (byte & 0x7f);
    if (!(byte & 0x80)) return { value, next: index };
  }
  throw new Error("woff2: 非法的 Base128 数值");
};

/** 解压 woff2（表在 brotli 流中顺序存放），返回各表的偏移与解压后的数据。 */
function inflate(buffer) {
  const numTables = buffer.readUInt16BE(12);
  const tables = [];
  let index = 48;
  let offset = 0;

  for (let n = 0; n < numTables; n++) {
    const flags = buffer[index++];
    const tagIndex = flags & 0x3f;
    let tag;
    if (tagIndex === 63) {
      tag = buffer.toString("latin1", index, index + 4);
      index += 4;
    } else tag = KNOWN_TAGS[tagIndex];

    const original = readBase128(buffer, index);
    index = original.next;

    let length = original.value;
    if ((tag === "glyf" || tag === "loca") && flags >> 6 === 0) {
      const transformed = readBase128(buffer, index);
      index = transformed.next;
      length = transformed.value;
    }

    tables.push({ tag, offset, length });
    offset += length;
  }

  return { tables, data: brotliDecompressSync(buffer.subarray(index)) };
}

/** 读取 cmap（格式 4 / 12）中实际包含的字形码点，用于校验子集覆盖情况。 */
function readCmap(buffer) {
  const { tables, data } = inflate(buffer);
  const cmap = tables.find((table) => table.tag === "cmap");
  const view = data.subarray(cmap.offset, cmap.offset + cmap.length);
  const codePoints = new Set();

  for (let n = 0; n < view.readUInt16BE(2); n++) {
    const subtable = view.readUInt32BE(4 + n * 8 + 4);
    const format = view.readUInt16BE(subtable);

    if (format === 4) {
      const segments = view.readUInt16BE(subtable + 6) / 2;
      for (let s = 0; s < segments; s++) {
        const end = view.readUInt16BE(subtable + 14 + s * 2);
        const start = view.readUInt16BE(subtable + 16 + segments * 2 + s * 2);
        if (start === 0xffff) continue;
        for (let cp = start; cp <= end; cp++) codePoints.add(cp);
      }
    } else if (format === 12) {
      for (let g = 0; g < view.readUInt32BE(subtable + 12); g++) {
        const base = subtable + 16 + g * 12;
        const start = view.readUInt32BE(base);
        const end = view.readUInt32BE(base + 4);
        for (let cp = start; cp <= end; cp++) codePoints.add(cp);
      }
    }
  }

  return codePoints;
}

const blocks = results.map(
  ({ font }) => `@font-face {
  font-family: ${font.face};
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url("./assets/fonts/${font.slug}.woff2") format("woff2");
}`,
);

writeFileSync(
  CSS_FILE,
  `/**
 * 本文件由 \`pnpm fonts:fetch\` 自动生成，请勿手动修改。
 *
 * 完全离线的字体子集：仅包含简历实际用到的 ${[...charset].length} 个字符，
 * 由 Google Fonts CSS2 API 的 \`text=\` 参数按需生成（可变字体，字重 400–700）。
 * 字体均为 SIL Open Font License 1.1 授权，可自由分发。
 */

${blocks.join("\n\n")}
`,
);

// 校验：每个字符至少要被其中一款字体覆盖，否则浏览器会回退到系统字体。
const covered = new Set();
for (const { font } of results) {
  for (const cp of readCmap(readFileSync(join(FONT_DIR, `${font.slug}.woff2`)))) covered.add(cp);
}
const missing = [...charset].filter((char) => !covered.has(char.codePointAt(0)));

const total = results.reduce((sum, { bytes }) => sum + bytes, 0);
console.log(`字符集：${[...charset].length} 个字符`);
for (const { font, bytes } of results) {
  console.log(`  ${font.family.padEnd(18)} ${(bytes / 1024).toFixed(1).padStart(6)} KB`);
}
console.log(
  `合计：${(total / 1024).toFixed(1)} KB → ${relative(ROOT, FONT_DIR)} + ${relative(ROOT, CSS_FILE)}`,
);
console.log(
  missing.length
    ? `⚠️  ${missing.length} 个字符没有任何字体覆盖，将回退到系统字体：${missing.join("")}`
    : "✅  所有字符均有字形覆盖，无需回退系统字体。",
);
