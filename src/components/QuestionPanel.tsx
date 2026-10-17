import React, { useState, useEffect } from 'react';
import { Question, AppTheme } from '../types/game';
import { THEMES } from '../data/themes';
import { Lightbulb, RotateCcw, CheckCircle2, XCircle, Clock, Sparkles } from 'lucide-react';

interface QuestionPanelProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  stageName: string;
  timeRemaining: number | null; // null if timer is disabled
  onSelectAnswer: (index: number) => void;
  onRetryQuestion: () => void;
  allowRetry: boolean;
  allowHint: boolean;
  isFeedbackMode: boolean;
  selectedAnswerIndex: number | null;
  isCorrect: boolean | null;
  onHintUsed: () => void;
  themeId?: AppTheme;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
  question,
  questionIndex,
  totalQuestions,
  stageName,
  timeRemaining,
  onSelectAnswer,
  onRetryQuestion,
  allowRetry,
  allowHint,
  isFeedbackMode,
  selectedAnswerIndex,
  isCorrect,
  onHintUsed,
  themeId = 'royal_midnight'
}) => {
  const theme = THEMES[themeId || 'royal_midnight'] || THEMES.royal_midnight;
  const [showHint, setShowHint] = useState<boolean>(false);

  // Reset hint view when question changes
  useEffect(() => {
    setShowHint(false);
  }, [question.id]);

  const handleHintClick = () => {
    if (!showHint) {
      setShowHint(true);
      onHintUsed();
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${theme.bgCard} backdrop-blur-xl border-2 ${theme.borderCard} rounded-2xl p-4 sm:p-6 ${theme.shadowGlow} transition-all`}>
      {/* Header bar: Stage, Question Counter, Timer */}
      <div className={`flex flex-wrap items-center justify-between gap-3 border-b ${theme.borderSubtle} pb-3 mb-4`}>
        {/* Stage & Index badges */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${theme.badgeBg} ${theme.textAccent} border ${theme.badgeBorder}`}>
            {stageName}
          </span>
          <span className={`text-xs sm:text-sm font-semibold ${theme.isLight ? 'text-slate-700' : 'text-slate-200'}`}>
            السؤال <span className={`${theme.textAccent} font-racing font-bold`}>{questionIndex + 1}</span> من {totalQuestions}
          </span>
          <span className={`hidden sm:inline-block px-2.5 py-0.5 rounded text-[11px] ${
            theme.isLight ? 'bg-slate-200 text-slate-700 border-slate-300' : 'bg-slate-900/80 text-slate-300 border-slate-800'
          } border`}>
            {question.topic}
          </span>
        </div>

        {/* Right side: Timer & Action buttons */}
        <div className="flex items-center gap-2">
          {timeRemaining !== null && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border transition-colors ${
              timeRemaining <= 5
                ? 'bg-red-950/80 text-red-400 border-red-500 animate-pulse'
                : theme.isLight
                ? 'bg-slate-100 text-slate-800 border-slate-300'
                : `bg-slate-900/90 ${theme.textAccent} ${theme.borderCard}`
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{timeRemaining} ثانية</span>
            </div>
          )}

          {allowHint && (
            <button
              onClick={handleHintClick}
              disabled={isFeedbackMode || showHint}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                showHint
                  ? theme.isLight
                    ? 'bg-amber-100 text-amber-800 border-amber-300 cursor-default'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40 cursor-default'
                  : theme.isLight
                  ? 'bg-slate-100 hover:bg-amber-50 text-amber-700 border-amber-300 cursor-pointer'
                  : 'bg-slate-900 hover:bg-amber-950/40 text-amber-300 border-amber-500/30 hover:border-amber-400 cursor-pointer'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showHint ? 'تم إظهار التلميح' : 'تلميح'}</span>
            </button>
          )}

          {allowRetry && isFeedbackMode && isCorrect === false && (
            <button
              onClick={onRetryQuestion}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer ${
                theme.isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : `bg-slate-900 hover:bg-slate-800 ${theme.textAccent} border ${theme.borderCard} hover:${theme.borderAccent}`
              } border`}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${theme.textAccent}`} />
              <span>إعادة السؤال</span>
            </button>
          )}
        </div>
      </div>

      {/* Optional Scientific Diagram */}
      {question.diagramSvg && (
        <div
          className={`my-3 p-2 rounded-xl border flex justify-center items-center overflow-hidden ${
            theme.isLight ? 'bg-slate-50 border-slate-200' : `bg-slate-900/60 ${theme.borderSubtle}`
          }`}
          dangerouslySetInnerHTML={{ __html: question.diagramSvg }}
        />
      )}

      {/* Question Text */}
      <div className="mb-5">
        <h3 className={`text-lg sm:text-xl md:text-2xl font-bold leading-relaxed text-right ${theme.isLight ? 'text-slate-900' : 'text-white'}`}>
          {question.text}
        </h3>
      </div>

      {/* Hint Banner if active */}
      {showHint && (
        <div className={`mb-4 p-3 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 border ${
          theme.isLight
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
        }`}>
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">تلميح علمي: </span>
            <span>{question.hint}</span>
          </div>
        </div>
      )}

      {/* Answer Options Grid */}
      <div className={`grid gap-3 ${question.options.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {question.options.map((option, idx) => {
          let btnClass = theme.isLight
            ? `bg-slate-50/90 hover:bg-white text-slate-900 border-slate-200 shadow-sm hover:${theme.borderAccent}`
            : `bg-slate-900/90 hover:bg-slate-800/95 text-slate-100 border-slate-700/80 hover:${theme.borderAccent}`;
          let icon = null;

          if (isFeedbackMode) {
            if (idx === question.correctIndex) {
              btnClass = 'bg-emerald-950/90 text-emerald-200 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-pulse';
              icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
            } else if (idx === selectedAnswerIndex && !isCorrect) {
              btnClass = 'bg-red-950/90 text-red-200 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]';
              icon = <XCircle className="w-5 h-5 text-red-400 shrink-0" />;
            } else {
              btnClass = theme.isLight
                ? 'opacity-40 bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'opacity-40 bg-slate-900 text-slate-400 border-slate-800 cursor-not-allowed';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => onSelectAnswer(idx)}
              disabled={isFeedbackMode}
              className={`relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 text-right transition-all font-semibold text-sm sm:text-base cursor-pointer ${btnClass}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 flex items-center justify-center rounded-lg ${theme.badgeBg} ${theme.textAccent} font-racing font-bold text-xs border ${theme.badgeBorder}`}>
                  {idx + 1}
                </span>
                <span className="leading-snug">{option}</span>
              </div>
              {icon}
            </button>
          );
        })}
      </div>

      {/* Scientific Explanation Card after answering */}
      {isFeedbackMode && (
        <div className={`mt-5 p-4 rounded-xl border-2 transition-all ${
          isCorrect
            ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
            : 'bg-red-950/50 border-red-500/60 text-red-200 shadow-[0_0_25px_rgba(239,68,68,0.2)]'
        }`}>
          <div className="flex items-center gap-2 mb-1.5 font-bold text-sm sm:text-base">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-300">إجابة صحيحة! انطلق نحو الفوز 🚀 (+نيترو)</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300">إجابة غير صحيحة، حاول استعادة سرعتك ⚠️</span>
              </>
            )}
          </div>
          <p className={`text-xs sm:text-sm mt-1 leading-relaxed p-2.5 rounded-lg border ${
            theme.isLight
              ? 'text-slate-800 bg-white/95 border-slate-200'
              : 'text-slate-200 bg-slate-950/70 border-slate-800'
          }`}>
            <span className={`font-bold ${theme.textAccent}`}>التفسير العلمي: </span>
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};
