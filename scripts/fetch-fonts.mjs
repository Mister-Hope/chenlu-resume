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
import path from "node:path";
import { brotliDecompressSync } from "node:zlib";

const ROOT = path.join(import.meta.dirname, "..");
const FONT_DIR = path.join(ROOT, "src/assets/fonts");
const CSS_FILE = path.join(ROOT, "src/fonts.css");

/** 现代 Chrome UA：让 Google 返回 woff2 + 可变字体。 */
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const FONTS = [
  { slug: "noto-sans-sc", family: "Noto Sans SC" },
  { slug: "noto-serif-sc", family: "Noto Serif SC" },
  { slug: "plus-jakarta-sans", family: "Plus Jakarta Sans" },
  { slug: "jetbrains-mono", family: "JetBrains Mono" },
].map(({ family, slug }) => ({
  // 项目用到的字重范围：400 常规 / 700 粗体
  axis: "wght@400..700",
  face: `"${family}"`,
  family,
  slug,
}));

/** 需要收录进字体子集的码点范围：ASCII、拉丁扩展与符号、CJK 标点、全角字符、汉字 */
const PRINTABLE_RANGES = [
  [0x20, 0x7e],
  [0xa0, 0x2bff],
  [0x3000, 0x303f],
  [0xff00, 0xffef],
  [0x3400, 0x9fff],
];

/**
 * 判断某个码点是否属于需要收录的字符。
 *
 * @param codePoint 待判定的码点
 * @returns 属于收录范围时返回 true
 */
const isPrintable = (codePoint) =>
  PRINTABLE_RANGES.some(([min, max]) => codePoint >= min && codePoint <= max);

/**
 * 收集项目实际用到的所有可打印字符，作为子集字符集。
 *
 * @returns 去重后的字符集字符串
 */
const collectCharset = () => {
  const sources = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const filePath = path.join(dir, name);

      if (statSync(filePath).isDirectory()) walk(filePath);
      else if ([".ts", ".tsx", ".css", ".html"].includes(path.extname(filePath)))
        sources.push(filePath);
    }
  };

  walk(path.join(ROOT, "src"));
  sources.push(path.join(ROOT, "index.html"));

  const text = sources
    .filter((filePath) => filePath !== CSS_FILE)
    .map((filePath) => readFileSync(filePath, "utf8"))
    // 注释不会渲染到页面上，去掉块注释与行注释以免把说明文字也算进字符集
    // 行注释的判定要求 `//` 前不是冒号，以保留 https:// 这类字符串内容
    .map((source) =>
      source
        .replaceAll(/\/\*[\s\S]*?\*\//gu, "")
        .replaceAll(/(?<prefix>^|[^:])\/\/.*$/gmu, "$<prefix>"),
    )
    .join("\n");

  return [...new Set([...text].filter((char) => isPrintable(char.codePointAt(0))))].join("");
};

/**
 * 请求某个字体族的子集 CSS，并把其中的字体文件下载到本地。
 *
 * @param font 字体配置
 * @param charset 需要包含的字符集
 * @returns 下载到的字体文件字节数
 */
const fetchFont = async (font, charset) => {
  const url =
    `https://fonts.googleapis.com/css2?family=${font.family.replaceAll(" ", "+")}` +
    `:${font.axis}&display=swap&text=${encodeURIComponent(charset)}`;

  const response = await fetch(url, { headers: { "User-Agent": UA } });
  if (!response.ok) throw new Error(`${font.family}: CSS 请求失败 (HTTP ${response.status})`);

  const css = await response.text();
  const remote = /url\((?<url>https:[^)]+)\)/u.exec(css)?.groups?.url;
  if (!remote) throw new Error(`${font.family}: CSS 中未找到字体文件 URL`);

  const fontResponse = await fetch(remote, { headers: { "User-Agent": UA } });
  if (!fontResponse.ok)
    throw new Error(`${font.family}: 字体下载失败 (HTTP ${fontResponse.status})`);

  const { buffer, byteLength } = await fontResponse.arrayBuffer().then((rawBuffer) => ({
    buffer: rawBuffer,
    byteLength: rawBuffer.byteLength,
  }));

  mkdirSync(FONT_DIR, { recursive: true });
  writeFileSync(path.join(FONT_DIR, `${font.slug}.woff2`), Buffer.from(buffer));

  return byteLength;
};

const charset = collectCharset();
const results = [];

for (const font of FONTS) results.push({ font, bytes: await fetchFont(font, charset) });

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

/**
 * 读取 woff2 中的 Base128 变长整数。
 *
 * @param buffer 原始数据
 * @param start 起始偏移
 * @returns 解析出的数值与下一个字节的偏移
 */
const readBase128 = (buffer, start) => {
  let value = 0;
  let index = start;

  for (let step = 0; step < 5; step++) {
    const byte = buffer[index];
    index += 1;
    value = (value << 7) | (byte & 0x7f);
    if (!(byte & 0x80)) return { value, next: index };
  }

  throw new Error("woff2: 非法的 Base128 数值");
};

/**
 * 解压 woff2（表在 brotli 流中顺序存放），返回各表的偏移与解压后的数据。
 *
 * @param buffer Woff2 原始数据
 * @returns 表目录与解压后的表数据
 */
const inflate = (buffer) => {
  const numTables = buffer.readUInt16BE(12);
  const tables = [];
  let index = 48;
  let offset = 0;

  for (let tableIndex = 0; tableIndex < numTables; tableIndex++) {
    const flags = buffer[index];
    index += 1;
    const tagIndex = flags & 0x3f;
    let tag;

    if (tagIndex === 63) {
      tag = buffer.toString("latin1", index, index + 4);
      index += 4;
    } else {
      tag = KNOWN_TAGS[tagIndex];
    }

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
};

/**
 * 读取 cmap 格式 4（BMP）子表，把码点写入集合。
 *
 * @param view Cmap 表数据视图
 * @param subtable 子表在视图中的偏移
 * @param codePoints 收集码点的集合
 */
const readFormat4 = (view, subtable, codePoints) => {
  const segments = view.readUInt16BE(subtable + 6) / 2;

  for (let segmentIndex = 0; segmentIndex < segments; segmentIndex++) {
    const end = view.readUInt16BE(subtable + 14 + segmentIndex * 2);
    const start = view.readUInt16BE(subtable + 16 + segments * 2 + segmentIndex * 2);

    if (start !== 0xffff) for (let cp = start; cp <= end; cp++) codePoints.add(cp);
  }
};

/**
 * 读取 cmap 格式 12（UCS-4）子表，把码点写入集合。
 *
 * @param view Cmap 表数据视图
 * @param subtable 子表在视图中的偏移
 * @param codePoints 收集码点的集合
 */
const readFormat12 = (view, subtable, codePoints) => {
  for (let groupIndex = 0; groupIndex < view.readUInt32BE(subtable + 12); groupIndex++) {
    const base = subtable + 16 + groupIndex * 12;
    const start = view.readUInt32BE(base);
    const end = view.readUInt32BE(base + 4);

    for (let cp = start; cp <= end; cp++) codePoints.add(cp);
  }
};

/**
 * 读取 cmap（格式 4 / 12）中实际包含的字形码点，用于校验子集覆盖情况。
 *
 * @param buffer Woff2 原始数据
 * @returns 包含的码点集合
 */
const readCmap = (buffer) => {
  const { tables, data } = inflate(buffer);
  const cmap = tables.find((table) => table.tag === "cmap");
  const view = data.subarray(cmap.offset, cmap.offset + cmap.length);
  const codePoints = new Set();

  for (let recordIndex = 0; recordIndex < view.readUInt16BE(2); recordIndex++) {
    const subtable = view.readUInt32BE(4 + recordIndex * 8 + 4);
    const format = view.readUInt16BE(subtable);

    if (format === 4) readFormat4(view, subtable, codePoints);
    else if (format === 12) readFormat12(view, subtable, codePoints);
  }

  return codePoints;
};

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
  for (const cp of readCmap(readFileSync(path.join(FONT_DIR, `${font.slug}.woff2`))))
    covered.add(cp);
}

const missing = [...charset].filter((char) => !covered.has(char.codePointAt(0)));

const total = results.reduce((sum, { bytes }) => sum + bytes, 0);
console.log(`字符集：${[...charset].length} 个字符`);
for (const { font, bytes } of results)
  console.log(`  ${font.family.padEnd(18)} ${(bytes / 1024).toFixed(1).padStart(6)} KB`);

console.log(
  `合计：${(total / 1024).toFixed(1)} KB → ${path.relative(ROOT, FONT_DIR)} + ${path.relative(ROOT, CSS_FILE)}`,
);
console.log(
  missing.length
    ? `⚠️  ${missing.length} 个字符没有任何字体覆盖，将回退到系统字体：${missing.join("")}`
    : "✅  所有字符均有字形覆盖，无需回退系统字体。",
);
