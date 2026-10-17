import React from 'react';
import { RotateCcw, AlertTriangle, Play } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0b1736] border-2 border-red-500/60 rounded-3xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.3)] text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-black text-white mb-2">إعادة تشغيل السباق؟</h3>
        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          هل تريد إعادة السباق من البداية؟ ستُصفّر نقاط الجولة الحالية ومواقع السيارات في المضمار.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onCancel}
            className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition-all"
          >
            <Play className="w-4 h-4" />
            <span>متابعة السباق</span>
          </button>

          <button
            onClick={onConfirm}
            className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>نعم، أعد السباق</span>
          </button>
        </div>
      </div>
    </div>
  );
};
