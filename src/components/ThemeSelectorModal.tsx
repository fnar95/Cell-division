import React from 'react';
import { X, Palette, Check } from 'lucide-react';
import { AppTheme } from '../types/game';
import { THEMES } from '../data/themes';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme
}) => {
  if (!isOpen) return null;

  const activeTheme = THEMES[currentTheme || 'royal_midnight'] || THEMES.royal_midnight;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className={`relative w-full max-w-xl ${activeTheme.isLight ? 'bg-white text-slate-900 border-slate-300' : 'bg-[#0b1736] text-white border-cyan-500/50'} border-2 rounded-3xl p-5 sm:p-7 shadow-2xl my-6`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 left-5 p-2 rounded-xl ${activeTheme.isLight ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-slate-900 text-slate-400 hover:text-white'} transition-colors cursor-pointer`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className={`flex items-center gap-3 border-b ${activeTheme.isLight ? 'border-slate-200' : 'border-cyan-500/20'} pb-4 mb-5`}>
          <div className={`p-3 rounded-2xl ${activeTheme.badgeBg} border ${activeTheme.badgeBorder} ${activeTheme.textAccent}`}>
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h2 className={`text-xl font-black ${activeTheme.isLight ? 'text-slate-900' : 'text-white'}`}>تخصيص ألوان ومظهر السباق</h2>
            <p className={`text-xs ${activeTheme.isLight ? 'text-slate-500' : 'text-slate-400'} mt-0.5`}>
              اختر المظهر اللوني المتناسق للخلفية، الإيقونات، الخطوط وأضواء المضمار
            </p>
          </div>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {(Object.values(THEMES)).map((t) => {
            const isSelected = currentTheme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  onSelectTheme(t.id);
                }}
                className={`flex flex-col text-right p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? `${t.badgeBg} ${t.borderAccent} shadow-lg ring-2 ring-cyan-400/30`
                    : activeTheme.isLight
                    ? 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100/70'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                {/* Visual Palette Preview Swatches */}
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl">{t.icon}</span>
                    <span className={`font-bold text-sm ${activeTheme.isLight && !isSelected ? 'text-slate-800' : 'text-white'}`}>{t.name}</span>
                  </div>

                  {isSelected && (
                    <div className={`w-6 h-6 rounded-full ${t.btnAccentBg} text-slate-950 flex items-center justify-center font-bold shadow-sm`}>
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>

                <p className={`text-[11px] ${activeTheme.isLight && !isSelected ? 'text-slate-600' : 'text-slate-400'} leading-relaxed mb-3`}>
                  {t.description}
                </p>

                {/* Color preview bars */}
                <div className={`flex items-center gap-1.5 w-full mt-auto pt-2 border-t ${activeTheme.isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
                  <div className="flex-1 h-3 rounded-full border border-black/20" style={{ backgroundColor: `#${t.sceneFog.toString(16).padStart(6, '0')}` }} title="الخلفية" />
                  <div className="flex-1 h-3 rounded-full" style={{ backgroundColor: `#${t.sceneRailLeft.toString(16).padStart(6, '0')}` }} title="اللون الأساسي" />
                  <div className="flex-1 h-3 rounded-full" style={{ backgroundColor: `#${t.sceneRailRight.toString(16).padStart(6, '0')}` }} title="اللون الثانوي" />
                  <div className="flex-1 h-3 rounded-full" style={{ backgroundColor: `#${t.sceneLight.toString(16).padStart(6, '0')}` }} title="الإضاءة" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className={`flex justify-end border-t ${activeTheme.isLight ? 'border-slate-200' : 'border-slate-800'} pt-4`}>
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-xl ${activeTheme.btnPrimary} ${activeTheme.btnPrimaryHover} font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer`}
          >
            تطبيق واعتماد ✓
          </button>
        </div>
      </div>
    </div>
  );
};
