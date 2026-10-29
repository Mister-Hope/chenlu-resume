import { Printer } from "lucide-react";
import type { ReactElement } from "react";

interface PrintToolbarProps {
  onPrint: () => void;
}

export const PrintToolbar = ({ onPrint }: PrintToolbarProps): ReactElement => (
  <div className="no-print fixed top-4 right-6 z-50">
    <button
      type="button"
      id="print-resume-btn"
      onClick={onPrint}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-nenu hover:bg-nenu-hover text-white font-bold text-xs shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95 border border-white/20"
      title="打印或导出为 PDF"
    >
      <Printer className="w-4 h-4" />
      <span>打印 / 导出 PDF</span>
    </button>
  </div>
);
