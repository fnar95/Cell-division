import { AppTheme } from '../types/game';

export interface ThemeColors {
  id: AppTheme;
  name: string;
  icon: string;
  description: string;
  isLight?: boolean;
  // Backgrounds
  bgPage: string;
  bgPageGradient: string;
  bgSurface: string;
  bgCard: string;
  bgHeader: string;
  // Borders
  borderAccent: string;
  borderSubtle: string;
  borderCard: string;
  // Texts
  textPrimary: string;
  textAccent: string;
  textSecondary: string;
  textMuted: string;
  titleGradient: string;
  // Glow / shadow
  shadowGlow: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  // Icon colors
  iconAccent: string;
  iconSecondary: string;
  // Button
  btnPrimary: string;
  btnPrimaryHover: string;
  btnAccentBg: string;
  // 3D Scene colors
  sceneFog: number;
  sceneLight: number;
  sceneRailLeft: number;
  sceneRailRight: number;
  sceneStripes: number;
  sceneSpeedStreaks: number;
}

export const THEMES: Record<AppTheme, ThemeColors> = {
  royal_midnight: {
    id: 'royal_midnight',
    name: 'الأزرق الكحلي الرياضي',
    icon: '💎',
    description: 'خلفية كحلية عميقة مع تدرجات السيان والأزرق الكهربائي والذهب الدافئ وقراءة فائقة الوضوح',
    isLight: false,
    bgPage: 'bg-[#070e22]',
    bgPageGradient: 'from-[#0e1a3d] via-[#081129] to-[#040816]',
    bgSurface: 'bg-[#0d1c40]',
    bgCard: 'bg-[#0b1736]/95',
    bgHeader: 'bg-[#070e22]/90 border-cyan-500/30',
    borderAccent: 'border-cyan-400',
    borderSubtle: 'border-cyan-500/20',
    borderCard: 'border-cyan-500/40',
    textPrimary: 'text-white',
    textAccent: 'text-cyan-400',
    textSecondary: 'text-sky-200',
    textMuted: 'text-slate-300',
    titleGradient: 'from-white via-sky-100 to-cyan-300',
    shadowGlow: 'shadow-[0_0_40px_rgba(6,182,212,0.25)]',
    badgeBg: 'bg-cyan-950/80',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-500/40',
    iconAccent: 'text-cyan-400',
    iconSecondary: 'text-amber-400',
    btnPrimary: 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.5)]',
    btnPrimaryHover: 'hover:from-cyan-400 hover:to-blue-500',
    btnAccentBg: 'bg-cyan-500',
    sceneFog: 0x070e22,
    sceneLight: 0x38bdf8,
    sceneRailLeft: 0x06b6d4,
    sceneRailRight: 0xf59e0b,
    sceneStripes: 0x38bdf8,
    sceneSpeedStreaks: 0x22d3ee
  },
  academic_light: {
    id: 'academic_light',
    name: 'الوضع الصافي النهاري',
    icon: '☀️',
    description: 'خلفية بيضاء لؤلؤية صافية مريحة للعين مع خطوط داكنة عالية التباين وإيقونات زرقاء وخضراء مشرقة',
    isLight: true,
    bgPage: 'bg-slate-100',
    bgPageGradient: 'from-slate-100 via-sky-50 to-slate-200',
    bgSurface: 'bg-white',
    bgCard: 'bg-white/95',
    bgHeader: 'bg-white/95 border-slate-300',
    borderAccent: 'border-blue-600',
    borderSubtle: 'border-slate-300',
    borderCard: 'border-sky-300/80',
    textPrimary: 'text-slate-900',
    textAccent: 'text-blue-600',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-600',
    titleGradient: 'from-blue-900 via-indigo-900 to-sky-800',
    shadowGlow: 'shadow-[0_10px_35px_rgba(15,23,42,0.12)]',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-900',
    badgeBorder: 'border-blue-300',
    iconAccent: 'text-blue-600',
    iconSecondary: 'text-amber-600',
    btnPrimary: 'bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 text-white shadow-[0_4px_20px_rgba(37,99,235,0.35)]',
    btnPrimaryHover: 'hover:from-blue-500 hover:to-indigo-500',
    btnAccentBg: 'bg-blue-600',
    sceneFog: 0xc8ddf8,
    sceneLight: 0x2563eb,
    sceneRailLeft: 0x2563eb,
    sceneRailRight: 0x059669,
    sceneStripes: 0x3b82f6,
    sceneSpeedStreaks: 0x60a5fa
  },
  royal_gold: {
    id: 'royal_gold',
    name: 'الكحلي الملكي والذهبي',
    icon: '👑',
    description: 'خلفية كحلية ملكية فاخرة مع ألوان ذهبية وعاجية مريحة للعين',
    isLight: false,
    bgPage: 'bg-[#060b18]',
    bgPageGradient: 'from-[#0d1b3e] via-[#060b18] to-[#02050c]',
    bgSurface: 'bg-[#0a1329]',
    bgCard: 'bg-[#0a1329]/95',
    bgHeader: 'bg-[#060b18]/90 border-amber-500/30',
    borderAccent: 'border-amber-400',
    borderSubtle: 'border-amber-500/20',
    borderCard: 'border-amber-500/40',
    textPrimary: 'text-white',
    textAccent: 'text-amber-400',
    textSecondary: 'text-amber-200',
    textMuted: 'text-slate-300',
    titleGradient: 'from-white via-amber-200 to-amber-400',
    shadowGlow: 'shadow-[0_0_40px_rgba(245,158,11,0.25)]',
    badgeBg: 'bg-amber-950/80',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/40',
    iconAccent: 'text-amber-400',
    iconSecondary: 'text-sky-400',
    btnPrimary: 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.45)]',
    btnPrimaryHover: 'hover:from-amber-400 hover:to-yellow-400',
    btnAccentBg: 'bg-amber-500',
    sceneFog: 0x060b18,
    sceneLight: 0xfbbf24,
    sceneRailLeft: 0xf59e0b,
    sceneRailRight: 0x38bdf8,
    sceneStripes: 0xfcd34d,
    sceneSpeedStreaks: 0xfbbf24
  },
  cyber_emerald: {
    id: 'cyber_emerald',
    name: 'الزمرد العلمي الحيوي',
    icon: '🌿',
    description: 'أجواء حيوية بظلال الزمرد والأخضر الفسفوري والأسود الكربوني',
    isLight: false,
    bgPage: 'bg-[#02130d]',
    bgPageGradient: 'from-[#06291b] via-[#02130d] to-[#010805]',
    bgSurface: 'bg-[#051c14]',
    bgCard: 'bg-[#051c14]/95',
    bgHeader: 'bg-[#02130d]/90 border-emerald-500/30',
    borderAccent: 'border-emerald-400',
    borderSubtle: 'border-emerald-500/20',
    borderCard: 'border-emerald-500/40',
    textPrimary: 'text-white',
    textAccent: 'text-emerald-400',
    textSecondary: 'text-teal-200',
    textMuted: 'text-slate-300',
    titleGradient: 'from-white via-emerald-200 to-emerald-400',
    shadowGlow: 'shadow-[0_0_40px_rgba(16,185,129,0.25)]',
    badgeBg: 'bg-emerald-950/80',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/40',
    iconAccent: 'text-emerald-400',
    iconSecondary: 'text-teal-300',
    btnPrimary: 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.45)]',
    btnPrimaryHover: 'hover:from-emerald-400 hover:to-teal-300',
    btnAccentBg: 'bg-emerald-500',
    sceneFog: 0x02130d,
    sceneLight: 0x10b981,
    sceneRailLeft: 0x10b981,
    sceneRailRight: 0x34d399,
    sceneStripes: 0x6ee7b7,
    sceneSpeedStreaks: 0x34d399
  },
  crimson_nitro: {
    id: 'crimson_nitro',
    name: 'الياقوتي الناري والذهب',
    icon: '🔥',
    description: 'طابع السباقات الساخنة بظلال الياقوت القرمزي واللهب البرتقالي',
    isLight: false,
    bgPage: 'bg-[#140509]',
    bgPageGradient: 'from-[#2a0913] via-[#140509] to-[#080204]',
    bgSurface: 'bg-[#1f0a12]',
    bgCard: 'bg-[#1f0a12]/95',
    bgHeader: 'bg-[#140509]/90 border-rose-500/30',
    borderAccent: 'border-rose-400',
    borderSubtle: 'border-rose-500/20',
    borderCard: 'border-rose-500/40',
    textPrimary: 'text-white',
    textAccent: 'text-rose-400',
    textSecondary: 'text-orange-200',
    textMuted: 'text-slate-300',
    titleGradient: 'from-white via-rose-200 to-rose-400',
    shadowGlow: 'shadow-[0_0_40px_rgba(244,63,94,0.25)]',
    badgeBg: 'bg-rose-950/80',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/40',
    iconAccent: 'text-rose-400',
    iconSecondary: 'text-amber-400',
    btnPrimary: 'bg-gradient-to-r from-rose-500 via-rose-400 to-orange-500 text-white shadow-[0_0_25px_rgba(244,63,94,0.45)]',
    btnPrimaryHover: 'hover:from-rose-400 hover:to-orange-400',
    btnAccentBg: 'bg-rose-500',
    sceneFog: 0x140509,
    sceneLight: 0xf43f5e,
    sceneRailLeft: 0xf43f5e,
    sceneRailRight: 0xf97316,
    sceneStripes: 0xfb7185,
    sceneSpeedStreaks: 0xfb7185
  },
  cosmic_cyan: {
    id: 'cosmic_cyan',
    name: 'السايبر البنفسجي الفضائي',
    icon: '🌌',
    description: 'طابع فضائي بأعماق البنفسجي الكوني وأضواء النيون السماوية',
    isLight: false,
    bgPage: 'bg-[#09071c]',
    bgPageGradient: 'from-[#190e3d] via-[#09071c] to-[#04030d]',
    bgSurface: 'bg-[#120e2e]',
    bgCard: 'bg-[#120e2e]/95',
    bgHeader: 'bg-[#09071c]/90 border-cyan-500/30',
    borderAccent: 'border-cyan-400',
    borderSubtle: 'border-cyan-500/20',
    borderCard: 'border-cyan-500/40',
    textPrimary: 'text-white',
    textAccent: 'text-cyan-400',
    textSecondary: 'text-purple-200',
    textMuted: 'text-slate-300',
    titleGradient: 'from-white via-cyan-200 to-cyan-400',
    shadowGlow: 'shadow-[0_0_40px_rgba(6,182,212,0.25)]',
    badgeBg: 'bg-cyan-950/80',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-500/40',
    iconAccent: 'text-cyan-400',
    iconSecondary: 'text-purple-400',
    btnPrimary: 'bg-gradient-to-r from-cyan-500 via-cyan-400 to-purple-500 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.45)]',
    btnPrimaryHover: 'hover:from-cyan-400 hover:to-purple-400',
    btnAccentBg: 'bg-cyan-500',
    sceneFog: 0x09071c,
    sceneLight: 0xa855f7,
    sceneRailLeft: 0x06b6d4,
    sceneRailRight: 0xa855f7,
    sceneStripes: 0x38bdf8,
    sceneSpeedStreaks: 0x22d3ee
  }
};
