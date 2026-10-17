import React from 'react';
import { Zap, Flame } from 'lucide-react';
import { AppTheme } from '../types/game';
import { THEMES } from '../data/themes';

interface SpeedometerProps {
  speed: number; // 0 to 320
  isNitro: boolean;
  nitroLevel?: number; // 0 to 100
  gear?: number;
  themeId?: AppTheme;
}

export const Speedometer: React.FC<SpeedometerProps> = ({
  speed,
  isNitro,
  nitroLevel = 85,
  gear = 4,
  themeId = 'royal_midnight'
}) => {
  const theme = THEMES[themeId || 'royal_midnight'] || THEMES.royal_midnight;
  const themeArcColor = '#' + theme.sceneRailLeft.toString(16).padStart(6, '0');

  // Speed needle rotation: 0 km/h = -120 deg, 300 km/h = 120 deg (total span 240 deg)
  const maxSpeed = 300;
  const clampedSpeed = Math.min(maxSpeed, Math.max(0, speed));
  const rotationDeg = -120 + (clampedSpeed / maxSpeed) * 240;

  // Calculate dynamic gear based on speed
  const calculatedGear = clampedSpeed === 0 ? 'N' : Math.min(6, Math.max(1, Math.floor(clampedSpeed / 45) + 1));
  const rpm = Math.min(9000, 1200 + Math.floor((clampedSpeed % 55) * 120) + Math.floor(clampedSpeed * 18));
  const isRedline = rpm > 7500;

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Outer Dial Container */}
      <div className={`relative w-44 h-44 sm:w-52 sm:h-52 rounded-full p-2 bg-gradient-to-b ${theme.bgPageGradient} border-2 ${theme.borderCard} ${theme.shadowGlow} backdrop-blur-md`}>
        {/* Dial Ticks SVG */}
        <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
          {/* Dial Background Arc */}
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke={theme.isLight ? '#cbd5e1' : '#1e293b'}
            strokeWidth="8"
            strokeDasharray="380"
            strokeDashoffset="120"
            strokeLinecap="round"
          />

          {/* Glowing Speed Arc */}
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke={isNitro ? '#f97316' : themeArcColor}
            strokeWidth="8"
            strokeDasharray="380"
            strokeDashoffset={380 - (clampedSpeed / maxSpeed) * 260}
            strokeLinecap="round"
            className="transition-all duration-200"
          />

          {/* Redline zone */}
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="#ef4444"
            strokeWidth="10"
            strokeDasharray="50 330"
            strokeDashoffset="-210"
            strokeLinecap="round"
            className="opacity-75"
          />
        </svg>

        {/* Needle */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out"
          style={{ transform: `rotate(${rotationDeg}deg)` }}
        >
          <div className="relative w-1 h-36 flex flex-col items-center">
            {/* Pointer tip */}
            <div className={`w-1.5 h-16 rounded-t-full shadow-lg transition-colors ${
              isNitro ? 'bg-amber-400 shadow-[0_0_12px_#f59e0b]' : 'bg-red-500 shadow-[0_0_12px_#ef4444]'
            }`} />
            {/* Center Cap */}
            <div className={`w-5 h-5 rounded-full ${theme.isLight ? 'bg-white' : 'bg-slate-900'} border-2 ${theme.borderAccent} shadow-md -mt-1 z-10`} />
            <div className="w-1 h-16" />
          </div>
        </div>

        {/* Digital Speedometer Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
          {/* Gear badge */}
          <div className="flex items-center gap-1 mb-0.5">
            <span className={`text-[10px] ${theme.isLight ? 'text-slate-500' : 'text-slate-400'} font-mono uppercase tracking-wider`}>GEAR</span>
            <span className={`text-xs font-racing font-bold px-1.5 py-0.5 rounded ${theme.badgeBg} ${theme.textAccent} border ${theme.badgeBorder}`}>
              {gear || calculatedGear}
            </span>
          </div>

          {/* Digital KM/H readout */}
          <div className={`text-3xl sm:text-4xl font-racing font-black ${theme.isLight ? 'text-slate-900' : 'text-white'} tracking-wider flex items-baseline`}>
            <span className={isNitro ? 'text-amber-400 nitro-text-glow' : `${theme.textAccent}`}>
              {Math.round(clampedSpeed)}
            </span>
          </div>
          <span className={`text-[10px] sm:text-xs font-mono ${theme.textAccent} font-semibold tracking-widest -mt-1`}>
            كم / س
          </span>

          {/* RPM Mini bar */}
          <div className="w-24 mt-1">
            <div className={`flex justify-between text-[8px] font-mono ${theme.isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>RPM</span>
              <span className={isRedline ? 'text-red-500 animate-pulse font-bold' : theme.isLight ? 'text-slate-700' : 'text-slate-300'}>
                {rpm}
              </span>
            </div>
            <div className={`w-full h-1 ${theme.isLight ? 'bg-slate-200' : 'bg-slate-800'} rounded-full overflow-hidden mt-0.5`}>
              <div
                className={`h-full transition-all duration-150 ${
                  isRedline ? 'bg-red-500' : `${theme.btnAccentBg}`
                }`}
                style={{ width: `${Math.min(100, (rpm / 9000) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Nitro Boost Status Bar */}
      <div className={`mt-2 flex items-center gap-2 ${theme.bgCard} px-3 py-1 rounded-full border ${theme.borderSubtle} backdrop-blur-sm shadow-md`}>
        {isNitro ? (
          <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
        ) : (
          <Zap className={`w-4 h-4 ${theme.textAccent}`} />
        )}
        <div className={`w-20 sm:w-24 h-2 ${theme.isLight ? 'bg-slate-200' : 'bg-slate-800'} rounded-full overflow-hidden`}>
          <div
            className={`h-full transition-all duration-300 ${
              isNitro
                ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 animate-pulse'
                : `${theme.btnAccentBg}`
            }`}
            style={{ width: `${nitroLevel}%` }}
          />
        </div>
        <span className={`text-[10px] font-racing font-bold ${isNitro ? 'text-amber-400' : theme.textAccent}`}>
          {isNitro ? 'نيترو نفاث!' : 'جاهز'}
        </span>
      </div>
    </div>
  );
};
