import React from "react";
import { Printer } from "lucide-react";

interface PrintToolbarProps {
  onPrint: () => void;
}

export const PrintToolbar: React.FC<PrintToolbarProps> = ({ onPrint }) => {
  return (
    <div className="no-print fixed top-4 right-6 z-50">
      <button
        type="button"
        id="print-resume-btn"
        onClick={onPrint}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#259fc8] hover:bg-[#1f87ab] text-white font-bold text-xs shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95 border border-white/20"
        title="打印或导出为 PDF"
      >
        <Printer className="w-4 h-4" />
        <span>打印 / 导出 PDF</span>
      </button>
    </div>
  );
};
