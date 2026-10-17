import React from 'react';
import { X, HelpCircle, Zap, ShieldAlert, Flag, Award, Sparkles } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0b1736] border-2 border-emerald-500/60 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(16,185,129,0.3)] my-6">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-emerald-500/30 pb-4 mb-5">
          <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">طريقة اللعب وقواعد السباق</h2>
            <p className="text-xs sm:text-sm text-slate-400">كيف تحوّل معلوماتك العلمية إلى سرعة خارقة على المضمار</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300">
          {/* Card 1: Correct Answer */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/40 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-300 text-sm mb-1">عند الإجابة الصحيحة (Turbo Boost):</h4>
              <p className="text-slate-300 leading-relaxed">
                تشتعل شعلة النيترو الزرقاء في عوادم سيارتك، ترتفع سرعتك بشكل حقيقي، وتتقدم خطوة سباق واضحة نحو خط النهاية متجاوزاً المنافسين.
              </p>
            </div>
          </div>

          {/* Card 2: Wrong Answer */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-red-500/40 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-red-950 text-red-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-red-300 text-sm mb-1">عند الإجابة الخاطئة (Tire Skid):</h4>
              <p className="text-slate-300 leading-relaxed">
                تنزلق السيارة لحظياً وتصدر صرير احتكاك الإطارات بالأسفلت مع دخان خفيف، ولا تتقدم في هذه المحاولة، مع عرض الإجابة الصحيحة والتفسير العلمي للاستفادة والتعلم.
              </p>
            </div>
          </div>

          {/* Card 3: Race Stages */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/40 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 shrink-0">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-cyan-300 text-sm mb-1">مراحل السباق الثلاث:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mt-1">
                <li><strong className="text-cyan-200">المرحلة 1 (الانطلاق):</strong> أسئلة دورة الخلية والطور البيني وتضاعف المادة الوراثية.</li>
                <li><strong className="text-purple-200">المرحلة 2 (السرعة القصوى):</strong> أطوار الانقسام المتساوي والكروموسومات وخيوط المغزل.</li>
                <li><strong className="text-amber-200">المرحلة 3 (التحدي النهائي):</strong> انقسام السيتوبلازم ومقارنة الانقسام المتساوي بالمنصف.</li>
              </ul>
            </div>
          </div>

          {/* Card 4: Podium & Certificate */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/40 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-950 text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-amber-300 text-sm mb-1">خط النهاية ووسام بطل العلوم:</h4>
              <p className="text-slate-300 leading-relaxed">
                عند عبور خط النهاية أولاً، تحصد كأس البطولة وتحصل على وسام بطل العلوم، بالإضافة لشهادة إتمام معتمدة باسمك يمكنك طباعتها والاحتفاظ بها!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm transition-all"
          >
            فهمت، مستعد للانطلاق! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
