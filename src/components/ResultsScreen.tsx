import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, CheckCircle2, XCircle, Clock, Zap, RotateCcw, Plus, BookOpen, Printer, Share2, Sparkles, X } from 'lucide-react';
import { Racer, RaceTelemetry, AppTheme } from '../types/game';
import { THEMES } from '../data/themes';

interface ResultsScreenProps {
  winner: Racer;
  racers: Racer[];
  playerRacer: Racer;
  telemetry: RaceTelemetry;
  studentName: string;
  teacherName?: string;
  themeId?: AppTheme;
  onReplayRace: () => void;
  onNewRace: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  winner,
  racers,
  playerRacer,
  telemetry,
  studentName,
  teacherName,
  themeId = 'royal_midnight',
  onReplayRace,
  onNewRace
}) => {
  const theme = THEMES[themeId || 'royal_midnight'] || THEMES.royal_midnight;
  const [showCertificate, setShowCertificate] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const isPlayerWinner = winner.id === playerRacer.id;

  // Fire confetti on win
  useEffect(() => {
    if (isPlayerWinner) {
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  }, [isPlayerWinner]);

  // Format time (e.g. 02:45)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Sort racers by progress/rank
  const sortedRacers = [...racers].sort((a, b) => b.progress - a.progress);

  // Pedagogical evaluation message
  const getPedagogicalFeedback = () => {
    if (telemetry.accuracyPercentage >= 90) {
      return 'أداء استثنائي وخارق! أثبتّ إتقاناً تاماً لجميع مفاهيم وأطوار انقسام الخلايا ودورة الخلية. بطل حقيقي للعلوم 🌟';
    } else if (telemetry.accuracyPercentage >= 75) {
      return 'أداء ممتاز ورائع! سرعتك واستيعابك لأطوار الانقسام المتساوي ودور الكروموسومات كانت عالية جداً. استمر في التألق 🚀';
    } else if (telemetry.accuracyPercentage >= 50) {
      return 'محاولة جيدة وتقدم ملموس! تحتاج إلى مراجعة بسيطة لمراحل الانقسام المتساوي والفرق بين انقسام السيتوبلازم في النبات والحيوان لتصل للمركز الأول 💪';
    } else {
      return 'بداية شجاعة في السباق! ننصحك بمراجعة درس انقسام الخلايا وبنك الأسئلة وإعادة التحدي للوصول لمنصة التتويج 📚';
    }
  };

  return (
    <div className={`relative w-full min-h-screen bg-gradient-to-b ${theme.bgPageGradient} p-4 sm:p-6 flex flex-col items-center justify-center overflow-y-auto ${theme.isLight ? 'text-slate-900' : 'text-white'}`}>
      {/* Background glow */}
      <div className={`absolute top-10 w-96 h-96 ${theme.isLight ? 'bg-sky-400/20' : 'bg-cyan-500/15'} rounded-full blur-[140px] pointer-events-none`} />
      <div className={`absolute bottom-10 w-96 h-96 ${theme.isLight ? 'bg-amber-400/20' : 'bg-blue-600/15'} rounded-full blur-[140px] pointer-events-none`} />

      <div className={`relative z-10 w-full max-w-4xl ${theme.bgCard} border-2 ${theme.borderCard} rounded-3xl p-6 sm:p-8 ${theme.shadowGlow} backdrop-blur-xl my-6`}>
        {/* Top Winner Podium Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-[0_0_35px_rgba(245,158,11,0.6)] mb-3 animate-bounce">
            <Trophy className="w-10 h-10 fill-current" />
          </div>

          <h2 className={`text-xs sm:text-sm font-racing tracking-[0.3em] ${theme.textAccent} font-bold uppercase mb-1`}>
            GRAND PRIX CHAMPION
          </h2>
          <h1 className={`text-2xl sm:text-4xl font-black ${theme.isLight ? 'text-slate-900' : 'text-white'}`}>
            {isPlayerWinner ? 'مبروك الفوز بالسباق يا بطل العلوم!' : `الفائز بالمركز الأول: ${winner.name}`}
          </h1>

          <p className={`mt-2 text-xs sm:text-sm ${theme.isLight ? 'text-slate-700' : theme.textSecondary} font-semibold max-w-xl mx-auto leading-relaxed`}>
            {getPedagogicalFeedback()}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {/* Rank */}
          <div className={`p-3.5 rounded-2xl ${theme.isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'} border text-center shadow-sm`}>
            <div className={`text-[11px] ${theme.isLight ? 'text-slate-500' : 'text-slate-400'} font-bold mb-0.5`}>ترتيب المتسابق</div>
            <div className={`text-xl sm:text-2xl font-black ${theme.textAccent} font-racing`}>
              المركز {playerRacer.rank}
            </div>
          </div>

          {/* Accuracy */}
          <div className={`p-3.5 rounded-2xl ${theme.isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'} border text-center shadow-sm`}>
            <div className={`text-[11px] ${theme.isLight ? 'text-slate-500' : 'text-slate-400'} font-bold mb-0.5`}>الدقة والإتقان</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-500 font-racing">
              {telemetry.accuracyPercentage}%
            </div>
          </div>

          {/* Correct / Wrong */}
          <div className={`p-3.5 rounded-2xl ${theme.isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'} border text-center shadow-sm`}>
            <div className={`text-[11px] ${theme.isLight ? 'text-slate-500' : 'text-slate-400'} font-bold mb-0.5`}>الإجابات (صح / خطأ)</div>
            <div className={`text-base sm:text-lg font-black ${theme.isLight ? 'text-slate-900' : 'text-white'} flex items-center justify-center gap-2`}>
              <span className="text-emerald-500 flex items-center gap-0.5">
                <CheckCircle2 className="w-4 h-4" /> {telemetry.correctCount}
              </span>
              <span className="text-slate-400">/</span>
              <span className="text-red-500 flex items-center gap-0.5">
                <XCircle className="w-4 h-4" /> {telemetry.wrongCount}
              </span>
            </div>
          </div>

          {/* Time Elapsed */}
          <div className={`p-3.5 rounded-2xl ${theme.isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'} border text-center shadow-sm`}>
            <div className={`text-[11px] ${theme.isLight ? 'text-slate-500' : 'text-slate-400'} font-bold mb-0.5`}>زمن السباق</div>
            <div className={`text-xl sm:text-2xl font-black ${theme.textAccent} font-racing`}>
              {formatTime(telemetry.totalTimeSeconds)}
            </div>
          </div>
        </div>

        {/* Final Standings Leaderboard */}
        <div className={`mb-6 ${theme.isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'} p-4 rounded-2xl border`}>
          <h3 className={`text-xs sm:text-sm font-bold ${theme.isLight ? 'text-slate-800' : 'text-slate-300'} mb-3 flex items-center gap-2`}>
            <Award className={`w-4 h-4 ${theme.textAccent}`} />
            <span>لوحة الترتيب النهائي لجميع المتسابقين:</span>
          </h3>

          <div className="space-y-2">
            {sortedRacers.map((racer, idx) => {
              const isP = racer.id === playerRacer.id;
              return (
                <div
                  key={racer.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    isP
                      ? `${theme.badgeBg} ${theme.borderAccent} ${theme.isLight ? 'text-slate-900' : 'text-white'} shadow-md`
                      : theme.isLight
                      ? 'bg-white border-slate-200 text-slate-800'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-racing font-bold ${
                      idx === 0 ? 'bg-amber-500 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-700 text-slate-200'
                    }`}>
                      {idx + 1}
                    </span>
                    <div
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: racer.car.primaryColor }}
                    />
                    <span className="font-bold text-xs sm:text-sm">
                      {racer.name} {isP && '(أنت)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-racing text-xs">
                    <span className={`${theme.textAccent} font-bold`}>{Math.round(racer.progress)}% مسافة</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={onReplayRace}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl ${theme.btnPrimary} ${theme.btnPrimaryHover} font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة السباق</span>
          </button>

          <button
            onClick={onNewRace}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl ${
              theme.isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
            } border text-xs sm:text-sm font-bold transition-all cursor-pointer`}
          >
            <Plus className="w-4 h-4" />
            <span>سباق جديد</span>
          </button>

          <button
            onClick={() => setShowReview(true)}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl ${
              theme.isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
            } border text-xs sm:text-sm font-bold transition-all cursor-pointer`}
          >
            <BookOpen className={`w-4 h-4 ${theme.textAccent}`} />
            <span>مراجعة الأسئلة</span>
          </button>

          <button
            onClick={() => setShowCertificate(true)}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>شهادة البطولة 📜</span>
          </button>
        </div>
      </div>

      {/* Review Questions Sub-Modal */}
      {showReview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className={`relative w-full max-w-3xl ${theme.isLight ? 'bg-white text-slate-900 border-slate-300' : 'bg-slate-950 text-white border-cyan-500'} border-2 rounded-3xl p-5 sm:p-6 max-h-[85vh] flex flex-col shadow-2xl`}>
            <button
              onClick={() => setShowReview(false)}
              className={`absolute top-4 left-4 p-2 rounded-xl ${theme.isLight ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-slate-900 text-slate-400 hover:text-white'} transition-colors cursor-pointer`}
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className={`text-lg font-bold ${theme.isLight ? 'text-slate-900' : 'text-white'} mb-4 border-b ${theme.isLight ? 'border-slate-200' : 'border-slate-800'} pb-2`}>
              مراجعة الأسئلة والإجابات والتفاسير العلمية
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {telemetry.userAnswers.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border ${
                    item.isCorrect
                      ? theme.isLight ? 'bg-emerald-50 border-emerald-300' : 'bg-emerald-950/30 border-emerald-500/40'
                      : theme.isLight ? 'bg-red-50 border-red-300' : 'bg-red-950/30 border-red-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className={theme.isLight ? 'text-slate-600' : 'text-slate-400'}>السؤال {idx + 1} ({item.question.topic})</span>
                    <span className={item.isCorrect ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>
                      {item.isCorrect ? '✓ إجابة صحيحة' : '✗ إجابة غير صحيحة'}
                    </span>
                  </div>
                  <div className={`text-sm font-bold ${theme.isLight ? 'text-slate-900' : 'text-white'} mb-2`}>{item.question.text}</div>
                  <div className={`text-xs ${theme.isLight ? 'text-slate-700 bg-white' : 'text-slate-300 bg-slate-900/80'} p-2 rounded-lg space-y-1 border ${theme.isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                    <div>
                      <span className="text-emerald-600 font-bold">الإجابة الصحيحة: </span>
                      <span>{item.question.options[item.question.correctIndex]}</span>
                    </div>
                    <div>
                      <span className={`${theme.textAccent} font-bold`}>التفسير العلمي: </span>
                      <span>{item.question.explanation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Official Certificate Sub-Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-950 rounded-3xl p-4 sm:p-6 my-auto">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Certificate Parchment */}
            <div
              id="printable-certificate"
              className="relative p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-amber-100 border-4 border-amber-600 text-slate-900 shadow-2xl text-center overflow-hidden"
            >
              {/* Decorative Corner Ornaments */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-600" />
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-600" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-600" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-600" />

              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-600 text-white mb-2 shadow-md">
                <Award className="w-8 h-8" />
              </div>

              <div className="text-xs uppercase tracking-widest font-black text-amber-800 mb-1">
                المملكة العربية السعودية • وزارة التعليم
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-950 mb-1">
                شهادة تفوق وبطولة في العلوم
              </h2>
              <div className="text-xs text-amber-900 font-bold mb-4">
                في سباق انقسام الخلايا التفاعلي ثلاثي الأبعاد
              </div>

              <div className="text-sm sm:text-base text-slate-700 mb-4 leading-relaxed">
                يشهد معلم المادة بأن البطل المتسابق:
                <div className="text-xl sm:text-2xl font-black text-amber-900 my-2 underline decoration-amber-400 underline-offset-8">
                  {studentName.trim() ? studentName : 'بطل مادة العلوم'}
                </div>
                قد اجتاز بنجاح وتفوق مضمار سباق العلوم لدرس <span className="font-bold text-amber-800">انقسام الخلايا</span> للصف الثالث المتوسط بمعدل إتقان بلغ:
                <span className="font-black text-amber-900 font-racing mx-1.5 text-lg">{telemetry.accuracyPercentage}%</span>
                بزمن قدره <span className="font-bold font-racing">{formatTime(telemetry.totalTimeSeconds)}</span>.
              </div>

              {/* Certificate Signatures and Badges */}
              <div className="mt-8 pt-4 border-t-2 border-amber-300 flex items-center justify-between text-xs text-slate-700">
                <div className="text-right">
                  <div className="font-bold text-slate-600 mb-1">التاريخ والاعتماد:</div>
                  <div className="font-semibold text-slate-800 font-mono">
                    {new Date().toLocaleDateString('ar-SA')}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-600 flex items-center justify-center text-[10px] font-black text-amber-800 rotate-[-12deg]">
                    ختم التفوق
                  </div>
                </div>

                <div className="text-left">
                  <div className="font-bold text-slate-600 mb-1">إعداد وتصميم المعلم:</div>
                  <div className="font-black text-amber-800 text-sm">{teacherName || 'فاضل المبارك'}</div>
                  <div className="text-[11px] text-slate-500">معلم مادة العلوم</div>
                </div>
              </div>
            </div>

            {/* Print & Close Buttons */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة أو حفظ الشهادة (PDF)</span>
              </button>

              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
