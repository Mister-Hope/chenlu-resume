import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactElement, ReactNode } from "react";

interface A4PageProps {
  children: ReactNode;
}

/** 缩放时预留的安全余量（px），避免取整误差导致出现横向滚动条 */
const FITS_EPSILON = 1;

/** 缩放变化小于该幅度时忽略，避免滚动条出现/消失引发的反复重算 */
const SCALE_HYSTERESIS = 0.004;

/** 测量不到悬浮按钮时使用的横向占用兜底值（按钮宽约 142px + 右边距 24px） */
const FALLBACK_TOOLBAR_ZONE = 170;

/** 悬浮按钮与纸张之间额外预留的间隙（px） */
const TOOLBAR_GAP = 8;

interface Layout {
  /** 纸张缩放比例 */
  scale: number;
  /** 是否为右上角悬浮按钮让出高度 */
  needsInset: boolean;
}

const INITIAL_LAYOUT: Layout = { scale: 1, needsInset: false };

/**
 * 测量右上角悬浮按钮实际占用的横向空间。
 *
 * 按钮文案改变时宽度会变，因此每次重算都重新测量，避免硬编码值随文案改动失效。
 *
 * @returns 按钮宽度 + 右边距 + 间隙
 */
const measureToolbarZone = (): number => {
  const toolbar = document.querySelector<HTMLElement>(".no-print");

  if (!toolbar) return FALLBACK_TOOLBAR_ZONE;

  const { width } = toolbar.getBoundingClientRect();

  // right-6 = 24px 右边距，再加上与纸张之间的间隙
  return width ? width + 24 + TOOLBAR_GAP : FALLBACK_TOOLBAR_ZONE;
};

/**
 * A4 纸张舞台：按可用宽度把整页简历等比缩放。
 *
 * 屏幕够宽（≥ 210mm）时保持原始尺寸，左右留白；屏幕更窄时整张纸等比缩小， 内部排版不重排，因此任何尺寸下都仍然是同一页。
 */
export const A4Page = ({ children }: A4PageProps): ReactElement => {
  const stageRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef(INITIAL_LAYOUT);
  const [layout, setLayout] = useState(INITIAL_LAYOUT);

  // 用 layout effect 在首次绘制前完成缩放计算，避免窄屏先画一张未缩放的 A4 再跳回
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const sheet = sheetRef.current;

    // 节点尚未挂载时无需清理，返回空函数保证各处返回值一致
    if (!stage || !sheet) {
      return (): void => {
        /* noop */
      };
    }

    /**
     * 根据舞台内容区宽度重算缩放比例。
     *
     * @param availableWidth 舞台内容区宽度（已扣除内边距与滚动条）
     */
    const update = (availableWidth: number): void => {
      // offsetWidth 是布局尺寸、不受 transform 影响，可以安全地作为缩放基准
      const { offsetWidth: sheetWidth } = sheet;

      if (!sheetWidth || availableWidth <= 0) return;

      const ratio = Math.min(1, (availableWidth - FITS_EPSILON) / sheetWidth);
      const scale = Math.max(0.1, Math.floor(ratio * 1000) / 1000);
      // 两侧留白不足以容纳悬浮按钮时，让纸张下移一行，避免按钮压住简历抬头
      const needsInset = (availableWidth - sheetWidth * scale) / 2 < measureToolbarZone();
      const { current } = layoutRef;

      // 容器变窄时必须立即缩放，只用迟滞抑制「放大」以避免反复重算
      if (needsInset === current.needsInset && scale - current.scale < SCALE_HYSTERESIS) return;

      layoutRef.current = { scale, needsInset };
      setLayout(layoutRef.current);
    };

    const observer = new ResizeObserver(([entry]) => {
      update(entry.contentRect.width);
    });

    observer.observe(stage);

    return (): void => {
      observer.disconnect();
    };
  }, []);

  // 开发期检查：内容超出单页时，打印会因 overflow: hidden 静默裁掉底部内容
  useEffect(() => {
    const sheet = sheetRef.current;

    // 生产环境不做提示；节点未挂载时同样返回清理函数以保证返回值一致
    if (!import.meta.env.DEV || !sheet) {
      return (): void => {
        /* noop */
      };
    }

    let canceled = false;

    /**
     * 测量纸张内容高度并提示溢出。
     *
     * 必须在样式表与字体都就绪后测量：dev 模式下 CSS 由 JS 注入、 字体又是 swap 加载，过早上报会得到与实际排版无关的假数值。
     */
    const checkOverflow = (): void => {
      if (canceled) return;

      const overflow = sheet.scrollHeight - sheet.clientHeight;

      if (overflow <= 1) return;

      // 开发期提示属于调试输出，浏览器环境无其它告警通道，此处豁免 no-console
      // oxlint-disable-next-line no-console
      console.warn(
        `[A4] 内容已超出单页 ${overflow}px，打印 / 导出 PDF 时底部会被裁掉，请精简文案或收紧行高。`,
      );
    };

    // 字体就绪后重新排版，高度才是最终值；字体接口不可用时直接测量即可
    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    void fontsReady.then(() => {
      requestAnimationFrame(checkOverflow);
    });

    return (): void => {
      canceled = true;
    };
  }, []);

  return (
    <main
      ref={stageRef}
      className={`a4-stage a4-container-screen flex-1 min-h-0 overflow-auto flex items-start justify-center p-4 sm:p-6 ${
        layout.needsInset ? "is-inset" : ""
      }`}
    >
      <div className="a4-scaler" style={{ "--a4-scale": layout.scale } as CSSProperties}>
        <div
          ref={sheetRef}
          id="a4-resume-sheet"
          className="a4-page-root bg-white text-neutral-900 shadow-xl flex flex-col"
        >
          {children}
        </div>
      </div>
    </main>
  );
};
