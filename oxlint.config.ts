import { defineHopeConfig } from "oxc-config-hope/oxlint";

export default defineHopeConfig(
  {
    node: ["scripts/**"],
    react: true,
    rules: {
      // lucide-react 图标通过 className 控制尺寸与颜色，这是官方推荐用法
      "react/forbid-component-props": "off",
      "react/function-component-definition": [
        "warn",
        { namedComponents: "arrow-function", unnamedComponents: "arrow-function" },
      ],
      // 简历是单语言静态页面，所有文案都来自 src/data，不存在 i18n 场景
      "react/jsx-no-literals": "off",

      // 页面只渲染一次即为静态纸张，没有重复渲染压力，性能规则不适用
      "react-perf/jsx-no-jsx-as-prop": "off",
      "react-perf/jsx-no-new-function-as-prop": "off",
      "react-perf/jsx-no-new-object-as-prop": "off",
    },
  },
  {
    files: ["scripts/**"],
    rules: {
      // 下载必须串行以统计体积
      "no-await-in-loop": "off",
      // woff2 子集化脚本需要直接解析二进制，位运算与自增下标是这类解析代码的固有写法
      "no-bitwise": "off",
      // 一次性 CLI 脚本：控制台输出就是它的产物
      "no-console": "off",
    },
  },
);
