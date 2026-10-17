import React from 'react';
import { Play, Settings, BookOpen, HelpCircle, Trophy, Sparkles, Volume2, VolumeX, Car, Palette } from 'lucide-react';
import { CarModel, AppTheme } from '../types/game';
import { THEMES } from '../data/themes';

interface StartScreenProps {
  onStartRace: () => void;
  onOpenSetup: () => void;
  onOpenQuestionBank: () => void;
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
  onOpenThemeSelector?: () => void;
  playerCar: CarModel;
  studentName: string;
  teacherName?: string;
  themeId?: AppTheme;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartRace,
  onOpenSetup,
  onOpenQuestionBank,
  onOpenSettings,
  onOpenHowToPlay,
  onOpenThemeSelector,
  playerCar,
  studentName,
  teacherName,
  themeId = 'royal_midnight',
  isMuted,
  onToggleMute
}) => {
  const theme = THEMES[themeId || 'royal_midnight'] || THEMES.royal_midnight;

  return (
    <div className={`relative w-full min-h-screen flex flex-col justify-between items-center p-4 sm:p-6 overflow-hidden bg-gradient-to-b ${theme.bgPageGradient} ${theme.isLight ? 'text-slate-900' : 'text-white'}`}>
      {/* Background Street Grid & Atmospheric Ambient Glows */}
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,${theme.isLight ? '#0000000a' : '#ffffff0a'}_1px,transparent_1px),linear-gradient(to_bottom,${theme.isLight ? '#0000000a' : '#ffffff0a'}_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none`} />
      
      {/* Dynamic Ambient Color Orbs */}
      <div className={`absolute -top-36 left-1/2 -translate-x-1/2 w-[720px] h-[420px] ${theme.isLight ? 'bg-sky-400/20' : 'bg-cyan-500/15'} rounded-full blur-[140px] pointer-events-none`} />
      <div className={`absolute -bottom-36 left-1/2 -translate-x-1/2 w-[650px] h-[380px] ${theme.isLight ? 'bg-amber-400/20' : 'bg-blue-600/15'} rounded-full blur-[150px] pointer-events-none`} />

      {/* Top Header Bar */}
      <div className="relative z-10 w-full max-w-6xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${theme.isLight ? 'bg-blue-600' : 'bg-cyan-400'} animate-ping`} />
          <span className={`text-xs sm:text-sm font-semibold tracking-wider ${theme.textAccent} uppercase`}>
            سباق العلوم التفاعلي ثلاثي الأبعاد
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Theme Switcher Button */}
          {onOpenThemeSelector && (
            <button
              onClick={onOpenThemeSelector}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl ${theme.bgSurface} border ${theme.borderSubtle} ${theme.textAccent} hover:opacity-90 transition-all shadow-md cursor-pointer`}
              title="تغيير ألوان ومظهر السباق"
            >
              <Palette className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">{theme.name}</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-2.5 rounded-xl ${theme.bgSurface} border ${theme.borderSubtle} ${theme.textAccent} hover:opacity-90 transition-colors shadow-lg cursor-pointer`}
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Hero Section */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl my-auto py-6 sm:py-8">
        {/* Grade & Subject Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} ${theme.badgeText} text-xs sm:text-sm font-bold mb-4 shadow-lg backdrop-blur-md`}>
          <Sparkles className={`w-4 h-4 ${theme.textAccent}`} />
          <span>مادة العلوم – الصف الثالث المتوسط</span>
          <span className={`w-1.5 h-1.5 rounded-full ${theme.btnAccentBg}`} />
          <span>درس انقسام الخلايا</span>
        </div>

        {/* Main Title Inspired by Need for Speed */}
        <div className="relative">
          <h2 className={`text-xs sm:text-base font-racing tracking-[0.35em] ${theme.textAccent} font-extrabold uppercase mb-1`}>
            ULTIMATE SPEED CHALLENGE
          </h2>
          <h1 className={`text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r ${theme.titleGradient} tracking-tight py-2 filter drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]`}>
            Need for Science
          </h1>
          <div className={`text-2xl sm:text-3xl md:text-4xl font-black ${theme.textAccent} mt-1 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]`}>
            سباق انقسام الخلايا 🏎️💨
          </div>
        </div>

        {/* Subtitle */}
        <p className={`mt-4 text-sm sm:text-base ${theme.textSecondary} max-w-2xl leading-relaxed`}>
          انطلق في مضمار سباق الشوارع، أجب بدقة على أسئلة انقسام الخلايا لتشعل النيترو وتتجاوز المنافسين نحو خط النهاية!
        </p>

        {/* Player Car Preview Badge */}
        <div className={`mt-6 flex items-center gap-4 ${theme.bgCard} border ${theme.borderCard} px-5 py-2.5 rounded-2xl shadow-xl backdrop-blur-md`}>
          <div
            className="w-8 h-8 rounded-lg shadow-inner border border-white/20 flex items-center justify-center shrink-0"
            style={{ backgroundColor: playerCar.primaryColor }}
          >
            <Car className="w-5 h-5 text-white" />
          </div>
          <div className="text-right">
            <div className={`text-[11px] ${theme.isLight ? 'text-slate-500' : 'text-slate-400'} font-bold`}>سيارة المتسابق الحالية</div>
            <div className={`text-sm font-bold ${theme.isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-2`}>
              <span>{playerCar.name}</span>
              {studentName && <span className={theme.textAccent}>({studentName})</span>}
            </div>
          </div>
          <button
            onClick={onOpenSetup}
            className={`mr-2 px-3 py-1 rounded-lg ${theme.badgeBg} hover:opacity-90 ${theme.badgeText} border ${theme.badgeBorder} text-xs font-bold transition-all cursor-pointer`}
          >
            تخصيص
          </button>
        </div>

        {/* Action Buttons Grid */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg">
          {/* Main Big Launch Button */}
          <button
            onClick={onStartRace}
            className={`w-full sm:flex-1 group relative flex items-center justify-center gap-3 py-4 px-8 rounded-2xl ${theme.btnPrimary} ${theme.btnPrimaryHover} font-black text-lg sm:text-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-white/20`}
          >
            <Play className="w-6 h-6 fill-current" />
            <span>ابدأ السباق الآن!</span>
          </button>
        </div>

        {/* Secondary Navigation Menu */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-xl">
          <button
            onClick={onOpenSetup}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl ${theme.bgSurface} ${theme.isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800/80 text-slate-200'} border ${theme.borderSubtle} hover:${theme.borderAccent} text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer`}
          >
            <Car className={`w-4 h-4 ${theme.textAccent}`} />
            <span>المتسابقون</span>
          </button>

          <button
            onClick={onOpenQuestionBank}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl ${theme.bgSurface} ${theme.isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800/80 text-slate-200'} border ${theme.borderSubtle} hover:${theme.borderAccent} text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer`}
          >
            <BookOpen className={`w-4 h-4 ${theme.iconSecondary}`} />
            <span>بنك الأسئلة</span>
          </button>

          <button
            onClick={onOpenSettings}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl ${theme.bgSurface} ${theme.isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800/80 text-slate-200'} border ${theme.borderSubtle} hover:${theme.borderAccent} text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer`}
          >
            <Settings className="w-4 h-4 text-purple-400" />
            <span>لوحة المعلم</span>
          </button>

          <button
            onClick={onOpenHowToPlay}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl ${theme.bgSurface} ${theme.isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800/80 text-slate-200'} border ${theme.borderSubtle} hover:${theme.borderAccent} text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer`}
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>طريقة اللعب</span>
          </button>
        </div>
      </div>

      {/* Footer Branding & Attribution */}
      <div className={`relative z-10 w-full max-w-6xl border-t ${theme.isLight ? 'border-slate-300' : 'border-slate-800/80'} pt-4 flex flex-col sm:flex-row items-center justify-between text-xs gap-2`}>
        <div className="flex items-center gap-2">
          <Trophy className={`w-4 h-4 ${theme.iconSecondary}`} />
          <span className={`font-semibold ${theme.isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            إعداد وتصميم المعلم: <strong className={theme.textAccent}>{teacherName || 'فاضل المبارك'}</strong>
          </span>
        </div>
        <div className={`${theme.isLight ? 'text-slate-500' : 'text-slate-400'} font-mono text-[11px]`}>
          Cell Division Grand Prix • Saudi Curriculum Edition
        </div>
      </div>
    </div>
  );
};
