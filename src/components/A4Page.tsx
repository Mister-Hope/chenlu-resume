import React, { useEffect, useRef, useState } from "react";

interface A4PageProps {
  children: React.ReactNode;
}

/** 缩放时预留的安全余量（px），避免取整误差导致出现横向滚动条 */
const FITS_EPSILON = 1;

/** 缩放变化小于该幅度时忽略，避免滚动条出现/消失引发的反复重算 */
const SCALE_HYSTERESIS = 0.004;

/** 右上角悬浮按钮占用的横向空间（按钮宽约 142px + 右边距 24px，留少量余量） */
const TOOLBAR_ZONE = 170;

/**
 * A4 纸张舞台：按可用宽度把整页简历等比缩放。
 *
 * 屏幕够宽（≥ 210mm）时保持原始尺寸，左右留白；屏幕更窄时整张纸等比缩小，
 * 内部排版不重排，因此任何尺寸下都仍然是同一页。
 */
export const A4Page: React.FC<A4PageProps> = ({ children }) => {
  const stageRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef({ scale: 1, needsInset: false });
  const [layout, setLayout] = useState(layoutRef.current);

  useEffect(() => {
    const stage = stageRef.current;
    const sheet = sheetRef.current;
    if (!stage || !sheet) return;

    /** @param availableWidth 舞台内容区宽度（已扣除内边距与滚动条） */
    const update = (availableWidth: number) => {
      // offsetWidth 是布局尺寸、不受 transform 影响，可以安全地作为缩放基准
      const sheetWidth = sheet.offsetWidth;
      if (!sheetWidth || availableWidth <= 0) return;

      const ratio = Math.min(1, (availableWidth - FITS_EPSILON) / sheetWidth);
      const scale = Math.max(0.1, Math.floor(ratio * 1000) / 1000);
      // 两侧留白不足以容纳悬浮按钮时，让纸张下移一行，避免按钮压住简历抬头
      const needsInset = (availableWidth - sheetWidth * scale) / 2 < TOOLBAR_ZONE;
      const current = layoutRef.current;

      if (Math.abs(scale - current.scale) < SCALE_HYSTERESIS && needsInset === current.needsInset) {
        return;
      }

      layoutRef.current = { scale, needsInset };
      setLayout(layoutRef.current);
    };

    const observer = new ResizeObserver(([entry]) => update(entry.contentRect.width));
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <main
      ref={stageRef}
      className={`a4-stage a4-container-screen flex-1 min-h-0 overflow-auto flex items-start justify-center p-4 sm:p-6 ${
        layout.needsInset ? "is-inset" : ""
      }`}
    >
      <div className="a4-scaler" style={{ "--a4-scale": layout.scale } as React.CSSProperties}>
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
