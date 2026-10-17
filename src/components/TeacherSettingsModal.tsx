import React from 'react';
import { X, Settings, Sliders, Volume2, Clock, Zap, RotateCcw, ShieldCheck, Palette } from 'lucide-react';
import { GameSettings } from '../types/game';
import { THEMES } from '../data/themes';

interface TeacherSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetAll: () => void;
}

export const TeacherSettingsModal: React.FC<TeacherSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0b1736] border-2 border-purple-500/60 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(168,85,247,0.3)] my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-purple-500/30 pb-4 mb-6">
          <div className="p-3 rounded-2xl bg-purple-950/80 border border-purple-500/40 text-purple-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">لوحة تحكم وإعدادات المعلم</h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40 text-[11px] font-bold">
                خاص بالمعلم
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              ضبط توازن السباق، مؤقت الأسئلة، عقوبة الخطأ ومقدار التسارع
            </p>
          </div>
        </div>

        <div className="space-y-6 text-xs sm:text-sm">
          {/* Section 1: Race Speed & Mechanics */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-800 pb-2">
              <Zap className="w-4 h-4" />
              <span>ديناميكا السرعة والتقدم في المضمار</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  دفعة السرعة عند الإجابة الصحيحة: ({settings.speedBoostPerCorrect} كم/س)
                </label>
                <input
                  type="range"
                  min="20"
                  max="70"
                  step="5"
                  value={settings.speedBoostPerCorrect}
                  onChange={(e) => onUpdateSettings({ speedBoostPerCorrect: Number(e.target.value) })}
                  className="w-full accent-cyan-400"
                />
                <span className="text-[11px] text-slate-400">تزيد سرعة السيارة فوراً وتطلق شعلة النيترو</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  نسبة تقدم السيارة نحو خط النهاية: ({settings.progressStepPerCorrect}%)
                </label>
                <input
                  type="range"
                  min="5"
                  max="20"
                  step="1"
                  value={settings.progressStepPerCorrect}
                  onChange={(e) => onUpdateSettings({ progressStepPerCorrect: Number(e.target.value) })}
                  className="w-full accent-cyan-400"
                />
                <span className="text-[11px] text-slate-400">المسافة التي تقطعها السيارة في كل إجابة صحيحة</span>
              </div>
            </div>
          </div>

          {/* Section 2: Pedagogical & Question Rules */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold border-b border-slate-800 pb-2">
              <Clock className="w-4 h-4" />
              <span>قواعد الأسئلة والمؤقت</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">المؤقت الزمني لكل سؤال:</label>
                <select
                  value={settings.questionTimeLimit}
                  onChange={(e) => onUpdateSettings({ questionTimeLimit: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none focus:border-amber-400"
                >
                  <option value={0}>بدون مؤقت (وقت مفتوح للتفكير)</option>
                  <option value={15}>15 ثانية (تحدي سريع للخبراء)</option>
                  <option value={20}>20 ثانية (موصى به للمنافسة الحماسية)</option>
                  <option value={30}>30 ثانية (مناسب ومريح)</option>
                  <option value={45}>45 ثانية (مهلة استيعابية واسعة)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">خيارات المساعدة والمحاولات:</label>
                <div className="space-y-2 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allowHints}
                      onChange={(e) => onUpdateSettings({ allowHints: e.target.checked })}
                      className="w-4 h-4 accent-amber-400 rounded"
                    />
                    <span className="text-slate-200">تفعيل زر "تلميح علمي" أثناء السؤال</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allowRetryQuestion}
                      onChange={(e) => onUpdateSettings({ allowRetryQuestion: e.target.checked })}
                      className="w-4 h-4 accent-amber-400 rounded"
                    />
                    <span className="text-slate-200">السماح بزر "إعادة السؤال" بعد الخطأ</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Audio & Sound FX */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-purple-400 font-bold border-b border-slate-800 pb-2">
              <Volume2 className="w-4 h-4" />
              <span>التحكم في المؤثرات الصوتية والموسيقى</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  صوت المؤثرات (المحرك، الانزلاق، النيترو): {Math.round(settings.sfxVolume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.sfxVolume}
                  onChange={(e) => onUpdateSettings({ sfxVolume: Number(e.target.value) })}
                  className="w-full accent-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  موسيقى السباق الحماسية: {Math.round(settings.musicVolume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.musicVolume}
                  onChange={(e) => onUpdateSettings({ musicVolume: Number(e.target.value) })}
                  className="w-full accent-purple-400"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Teacher & Certificate Details */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-slate-800 pb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>بيانات المعلم واعتماد الشهادة</span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                اسم المعلم (المعتمد في الشهادة والشاشات):
              </label>
              <input
                type="text"
                value={settings.teacherName ?? 'فاضل المبارك'}
                onChange={(e) => onUpdateSettings({ teacherName: e.target.value })}
                placeholder="فاضل المبارك"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none focus:border-emerald-400"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                يظهر هذا الاسم في توقيع شهادة التخرج والبطولة أسفل عبارة «إعداد وتصميم المعلم»
              </span>
            </div>
          </div>

          {/* Section 5: Theme & Appearance */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold border-b border-slate-800 pb-2">
              <Palette className="w-4 h-4" />
              <span>مظهر وألوان اللعبة والخلفية المتناسقة</span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-2">
                اختر النمط اللوني المتكامل (الخلفية، الإيقونات، الخطوط):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.values(THEMES).map((t) => {
                  const isSelected = (settings.appTheme || 'royal_midnight') === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => onUpdateSettings({ appTheme: t.id })}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? `${t.badgeBg} ${t.borderAccent} ${t.badgeText} shadow-md`
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{t.icon} {t.name}</span>
                      {isSelected && <span className={`${t.textAccent} font-black`}>✓ مفعل</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
          <button
            onClick={() => {
              if (confirm('هل ترغب في إعادة ضبط جميع الإعدادات للوضع الافتراضي؟')) {
                onResetAll();
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-red-950/40 text-red-400 border border-slate-800 hover:border-red-500/40 text-xs font-bold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الإعدادات الافتراضية</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
          >
            حفظ وإغلاق ✓
          </button>
        </div>
      </div>
    </div>
  );
};
