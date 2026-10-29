import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactElement, ReactNode } from "react";

interface A4PageProps {
  children: ReactNode;
}

/** 缩放时预留的安全余量（px），避免取整误差导致出现横向滚动条 */
const FITS_EPSILON = 1;

/** 缩放变化小于该幅度时忽略，避免滚动条出现/消失引发的反复重算 */
const SCALE_HYSTERESIS = 0.004;

/** 右上角悬浮按钮占用的横向空间（按钮宽约 142px + 右边距 24px，留少量余量） */
const TOOLBAR_ZONE = 170;

interface Layout {
  /** 纸张缩放比例 */
  scale: number;
  /** 是否为右上角悬浮按钮让出高度 */
  needsInset: boolean;
}

const INITIAL_LAYOUT: Layout = { scale: 1, needsInset: false };

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

  useEffect(() => {
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
      const needsInset = (availableWidth - sheetWidth * scale) / 2 < TOOLBAR_ZONE;
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
