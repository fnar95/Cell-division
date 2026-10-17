import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  GameState,
  GameSettings,
  Racer,
  Question,
  CarModel,
  RaceTelemetry,
  RaceStage
} from './types/game';
import { INITIAL_QUESTIONS, DEFAULT_CARS, AI_NAMES } from './data/questions';
import { audioService } from './services/audioService';

import { RaceCanvas3D } from './components/RaceCanvas3D';
import { Speedometer } from './components/Speedometer';
import { QuestionPanel } from './components/QuestionPanel';
import { StartScreen } from './components/StartScreen';
import { RacerSetupModal } from './components/RacerSetupModal';
import { QuestionBankModal } from './components/QuestionBankModal';
import { TeacherSettingsModal } from './components/TeacherSettingsModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { ResultsScreen } from './components/ResultsScreen';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { THEMES } from './data/themes';

import {
  RotateCcw,
  Volume2,
  VolumeX,
  Flag,
  Trophy,
  Users,
  Compass,
  Flame,
  Award,
  Palette
} from 'lucide-react';

const STORAGE_KEY_SETTINGS = 'need_for_science_settings_v1';
const STORAGE_KEY_QUESTIONS = 'need_for_science_questions_v1';

const DEFAULT_SETTINGS: GameSettings = {
  racerCount: 4,
  aiDifficulty: 'medium',
  isSoloMode: false,
  totalQuestions: 12,
  questionTimeLimit: 25,
  allowRetryQuestion: true,
  allowHints: true,
  speedBoostPerCorrect: 40,
  progressStepPerCorrect: 10,
  skidPenalty: 25,
  sfxVolume: 0.85,
  musicVolume: 0.35,
  isMuted: false,
  studentName: '',
  teacherName: 'فاضل المبارك',
  appTheme: 'royal_midnight',
  stageTransitionCount: 4
};

export default function App() {
  // Saved or initial settings
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.teacherName || parsed.teacherName === 'رضا طاهر القطان' || parsed.teacherName === 'أ. رضا طاهر القطان') {
          parsed.teacherName = 'فاضل المبارك';
        }
        if (!parsed.appTheme || parsed.appTheme === 'royal_gold') {
          parsed.appTheme = 'royal_midnight';
        }
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch {}
    return DEFAULT_SETTINGS;
  });

  // Questions bank
  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUESTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 6) return parsed;
      }
    } catch {}
    return INITIAL_QUESTIONS;
  });

  // Game state
  const [gameState, setGameState] = useState<GameState>('START');
  const [countdownNum, setCountdownNum] = useState<number | string>(3);

  // Selected player car & rivals
  const [selectedCar, setSelectedCar] = useState<CarModel>(DEFAULT_CARS[0]);
  const [aiRacerNames, setAiRacerNames] = useState<string[]>(AI_NAMES);

  // Active Racers in track
  const [racers, setRacers] = useState<Racer[]>([]);

  // Current session questions
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);

  // Race Telemetry
  const [telemetry, setTelemetry] = useState<RaceTelemetry>({
    startTime: 0,
    endTime: 0,
    totalTimeSeconds: 0,
    totalAnswered: 0,
    correctCount: 0,
    wrongCount: 0,
    accuracyPercentage: 0,
    hintsUsed: 0,
    maxSpeedReached: 120,
    userAnswers: []
  });

  // Question timer & Feedback state
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isFeedbackMode, setIsFeedbackMode] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // Visual effects
  const [isNitroActive, setIsNitroActive] = useState<boolean>(false);
  const [isSkiddingActive, setIsSkiddingActive] = useState<boolean>(false);

  // Modals state
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isQuestionBankOpen, setIsQuestionBankOpen] = useState(false);
  const [isTeacherSettingsOpen, setIsTeacherSettingsOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Interval and timer refs
  const questionTimerRef = useRef<number | null>(null);
  const aiProgressTimerRef = useRef<number | null>(null);
  const feedbackAdvanceTimerRef = useRef<number | null>(null);
  const nitroTimerRef = useRef<number | null>(null);
  const skidTimerRef = useRef<number | null>(null);

  // Save settings when changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {}
    audioService.setMute(settings.isMuted);
    audioService.setSfxVolume(settings.sfxVolume);
    audioService.setMusicVolume(settings.musicVolume);
  }, [settings]);

  // Save questions when updated
  const handleUpdateQuestions = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    try {
      localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(newQuestions));
    } catch {}
  };

  // Sound toggle
  const handleToggleMute = () => {
    setSettings((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  };

  // Determine current race stage (1, 2, or 3)
  const currentStage: RaceStage = useMemo(() => {
    const total = settings.totalQuestions || 12;
    const third = Math.ceil(total / 3);
    if (currentQIndex < third) return 1;
    if (currentQIndex < third * 2) return 2;
    return 3;
  }, [currentQIndex, settings.totalQuestions]);

  const stageName = useMemo(() => {
    if (currentStage === 1) return 'المرحلة 1: الانطلاق 🚀';
    if (currentStage === 2) return 'المرحلة 2: السرعة القصوى ⚡';
    return 'المرحلة 3: التحدي النهائي 🏆';
  }, [currentStage]);

  // Current active question
  const currentQuestion = sessionQuestions[currentQIndex] || sessionQuestions[0];

  // Player racer reference
  const playerRacer = racers.find((r) => r.isPlayer) || {
    id: 'player',
    name: settings.studentName || 'أنت (بطل العلوم)',
    car: selectedCar,
    isPlayer: true,
    progress: 0,
    currentSpeed: 100,
    lane: 0,
    rank: 1,
    correctAnswers: 0,
    wrongAnswers: 0,
    color: selectedCar.primaryColor,
    isSkidding: false,
    isNitro: false
  };

  // Initialize and Launch Race Session
  const initializeRacers = () => {
    const count = settings.isSoloMode ? 1 : Math.max(2, Math.min(8, settings.racerCount));
    const newRacers: Racer[] = [];

    // Player racer at center lane
    newRacers.push({
      id: 'player',
      name: settings.studentName ? settings.studentName : 'أنت (بطل العلوم)',
      car: selectedCar,
      isPlayer: true,
      progress: 0,
      currentSpeed: 110,
      lane: 0,
      rank: 1,
      correctAnswers: 0,
      wrongAnswers: 0,
      color: selectedCar.primaryColor,
      isSkidding: false,
      isNitro: false
    });

    // AI Racers distributed on adjacent lanes
    if (!settings.isSoloMode) {
      const laneOffsets = [-1.5, 1.5, -0.8, 0.8, -2.2, 2.2, -1.0];
      for (let i = 0; i < count - 1; i++) {
        const car = DEFAULT_CARS[(i + 1) % DEFAULT_CARS.length];
        const name = aiRacerNames[i] || AI_NAMES[i % AI_NAMES.length];
        newRacers.push({
          id: `ai_${i}`,
          name,
          car,
          isPlayer: false,
          progress: 0,
          currentSpeed: 105 + (Math.random() - 0.5) * 15,
          lane: laneOffsets[i % laneOffsets.length],
          rank: i + 2,
          correctAnswers: 0,
          wrongAnswers: 0,
          color: car.primaryColor,
          isSkidding: false,
          isNitro: false
        });
      }
    }

    setRacers(newRacers);
  };

  // Select questions distributed cleanly across stages 1, 2, and 3
  const prepareSessionQuestions = () => {
    const qCount = settings.totalQuestions || 12;
    const stage1Pool = questions.filter((q) => q.stage === 1);
    const stage2Pool = questions.filter((q) => q.stage === 2);
    const stage3Pool = questions.filter((q) => q.stage === 3);

    // Shuffle helper
    const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

    const s1 = shuffle(stage1Pool.length > 0 ? stage1Pool : questions);
    const s2 = shuffle(stage2Pool.length > 0 ? stage2Pool : questions);
    const s3 = shuffle(stage3Pool.length > 0 ? stage3Pool : questions);

    const perStage = Math.ceil(qCount / 3);
    const selected = [
      ...s1.slice(0, perStage),
      ...s2.slice(0, perStage),
      ...s3.slice(0, qCount - perStage * 2)
    ];

    setSessionQuestions(selected.slice(0, qCount));
    setCurrentQIndex(0);
  };

  // Start the Race flow with 3-2-1 Countdown
  const startRaceFlow = () => {
    audioService.playClick();
    initializeRacers();
    prepareSessionQuestions();

    // Reset telemetry
    setTelemetry({
      startTime: Date.now(),
      endTime: 0,
      totalTimeSeconds: 0,
      totalAnswered: 0,
      correctCount: 0,
      wrongCount: 0,
      accuracyPercentage: 0,
      hintsUsed: 0,
      maxSpeedReached: 120,
      userAnswers: []
    });

    setIsFeedbackMode(false);
    setSelectedAnswerIndex(null);
    setIsAnswerCorrect(null);
    setIsNitroActive(false);
    setIsSkiddingActive(false);

    // Enter Countdown
    setGameState('COUNTDOWN');
    setCountdownNum(3);
    audioService.startEngine();
    audioService.playCountdownBeep(false);

    let count = 3;
    const countdownInterval = window.setInterval(() => {
      count--;
      if (count === 2) {
        setCountdownNum(2);
        audioService.playCountdownBeep(false);
      } else if (count === 1) {
        setCountdownNum(1);
        audioService.playCountdownBeep(false);
      } else if (count === 0) {
        setCountdownNum('انطلق! 🏁');
        audioService.playCountdownBeep(true);
        audioService.startBackgroundMusic();
      } else {
        clearInterval(countdownInterval);
        setGameState('RACING');
        resetQuestionTimer();
      }
    }, 900);
  };

  // Reset Question Timer
  const resetQuestionTimer = () => {
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
      questionTimerRef.current = null;
    }

    if (settings.questionTimeLimit > 0) {
      setTimeRemaining(settings.questionTimeLimit);
      questionTimerRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimeRemaining(null);
    }
  };

  // When question timer hits 0
  const handleTimeExpired = () => {
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
      questionTimerRef.current = null;
    }
    // Treat as incorrect answer due to timeout
    handleSelectAnswer(-1);
  };

  // AI competitors realistic pacing update loop
  useEffect(() => {
    if (gameState !== 'RACING' && gameState !== 'ANSWER_FEEDBACK') {
      if (aiProgressTimerRef.current) {
        clearInterval(aiProgressTimerRef.current);
        aiProgressTimerRef.current = null;
      }
      return;
    }

    // Rate at which AI moves per second
    // Adjusted so that over totalQuestions questions, AI rivals progress fairly
    const diffMultiplier =
      settings.aiDifficulty === 'easy' ? 0.75 : settings.aiDifficulty === 'hard' ? 1.25 : 1.0;
    const baseProgressRate = (100 / (settings.totalQuestions * 8)) * diffMultiplier;

    aiProgressTimerRef.current = window.setInterval(() => {
      setRacers((prevRacers) => {
        const updated = prevRacers.map((racer) => {
          if (racer.isPlayer) return racer;
          // Add small organic jitter
          const delta = baseProgressRate + (Math.random() - 0.45) * 0.35;
          const nextProg = Math.min(100, racer.progress + Math.max(0.1, delta));
          return {
            ...racer,
            progress: nextProg,
            currentSpeed: 110 + Math.sin(Date.now() * 0.003 + racer.lane) * 15
          };
        });

        // Recalculate ranks based on progress
        const sorted = [...updated].sort((a, b) => b.progress - a.progress);
        return updated.map((r) => ({
          ...r,
          rank: sorted.findIndex((s) => s.id === r.id) + 1
        }));
      });
    }, 400);

    return () => {
      if (aiProgressTimerRef.current) {
        clearInterval(aiProgressTimerRef.current);
        aiProgressTimerRef.current = null;
      }
    };
  }, [gameState, settings.aiDifficulty, settings.totalQuestions]);

  // Check Answer Handler
  const handleSelectAnswer = (chosenIndex: number) => {
    if (isFeedbackMode || gameState !== 'RACING') return;

    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
      questionTimerRef.current = null;
    }

    setIsFeedbackMode(true);
    setSelectedAnswerIndex(chosenIndex);

    const isCorrect = chosenIndex === currentQuestion.correctIndex;
    setIsAnswerCorrect(isCorrect);

    // Telemetry record
    setTelemetry((prev) => {
      const correct = prev.correctCount + (isCorrect ? 1 : 0);
      const wrong = prev.wrongCount + (isCorrect ? 0 : 1);
      const total = correct + wrong;
      const acc = Math.round((correct / total) * 100);
      return {
        ...prev,
        totalAnswered: total,
        correctCount: correct,
        wrongCount: wrong,
        accuracyPercentage: acc,
        userAnswers: [
          ...prev.userAnswers,
          {
            question: currentQuestion,
            selectedOption: chosenIndex,
            isCorrect,
            timeTakenSeconds: settings.questionTimeLimit
              ? settings.questionTimeLimit - (timeRemaining || 0)
              : 0
          }
        ]
      };
    });

    if (isCorrect) {
      // ==== CORRECT ANSWER REWARD ====
      audioService.playCorrectChime();
      audioService.playNitroBoost();

      setIsNitroActive(true);
      if (nitroTimerRef.current) clearTimeout(nitroTimerRef.current);
      nitroTimerRef.current = window.setTimeout(() => {
        setIsNitroActive(false);
      }, 2000);

      // Advance Player car
      setRacers((prevRacers) => {
        const step =
          settings.progressStepPerCorrect || Math.max(8, Math.round(100 / settings.totalQuestions));
        const updated = prevRacers.map((racer) => {
          if (!racer.isPlayer) return racer;
          const nextSpeed = Math.min(290, racer.currentSpeed + settings.speedBoostPerCorrect);
          const nextProgress = Math.min(100, racer.progress + step);
          return {
            ...racer,
            progress: nextProgress,
            currentSpeed: nextSpeed,
            correctAnswers: racer.correctAnswers + 1,
            isNitro: true,
            isSkidding: false
          };
        });

        const sorted = [...updated].sort((a, b) => b.progress - a.progress);
        return updated.map((r) => ({
          ...r,
          rank: sorted.findIndex((s) => s.id === r.id) + 1
        }));
      });

      audioService.updateEnginePitch(0.9);

      // Auto advance to next question after 2 seconds
      feedbackAdvanceTimerRef.current = window.setTimeout(() => {
        advanceOrFinish();
      }, 2100);
    } else {
      // ==== WRONG ANSWER PENALTY ====
      audioService.playWrongTone();
      audioService.playTireSkid();

      setIsSkiddingActive(true);
      if (skidTimerRef.current) clearTimeout(skidTimerRef.current);
      skidTimerRef.current = window.setTimeout(() => {
        setIsSkiddingActive(false);
      }, 1500);

      // Penalty: decrease speed, car stays in place
      setRacers((prevRacers) => {
        const updated = prevRacers.map((racer) => {
          if (!racer.isPlayer) return racer;
          const penalizedSpeed = Math.max(65, racer.currentSpeed - settings.skidPenalty);
          return {
            ...racer,
            currentSpeed: penalizedSpeed,
            wrongAnswers: racer.wrongAnswers + 1,
            isSkidding: true,
            isNitro: false
          };
        });

        const sorted = [...updated].sort((a, b) => b.progress - a.progress);
        return updated.map((r) => ({
          ...r,
          rank: sorted.findIndex((s) => s.id === r.id) + 1
        }));
      });

      audioService.updateEnginePitch(0.35);

      // Give 3.5 seconds to read explanation before auto advancing, unless retry is enabled
      feedbackAdvanceTimerRef.current = window.setTimeout(() => {
        advanceOrFinish();
      }, 3600);
    }
  };

  // Advance to next question or trigger race finish
  const advanceOrFinish = () => {
    if (feedbackAdvanceTimerRef.current) {
      clearTimeout(feedbackAdvanceTimerRef.current);
      feedbackAdvanceTimerRef.current = null;
    }

    // Check if player or rivals reached 100% or answered all session questions
    const player = racers.find((r) => r.isPlayer);
    const anyFinished = racers.some((r) => r.progress >= 100);
    const lastQuestion = currentQIndex >= sessionQuestions.length - 1;

    if (anyFinished || lastQuestion || (player && player.progress >= 98)) {
      finishRace();
      return;
    }

    // Advance to next question
    setCurrentQIndex((prev) => prev + 1);
    setIsFeedbackMode(false);
    setSelectedAnswerIndex(null);
    setIsAnswerCorrect(null);
    resetQuestionTimer();
  };

  // Retry Question
  const handleRetryQuestion = () => {
    if (feedbackAdvanceTimerRef.current) {
      clearTimeout(feedbackAdvanceTimerRef.current);
      feedbackAdvanceTimerRef.current = null;
    }
    setIsFeedbackMode(false);
    setSelectedAnswerIndex(null);
    setIsAnswerCorrect(null);
    resetQuestionTimer();
  };

  // Finish Race and show results podium
  const finishRace = () => {
    if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    if (aiProgressTimerRef.current) clearInterval(aiProgressTimerRef.current);

    audioService.stopBackgroundMusic();
    audioService.playVictoryFanfare();
    audioService.stopEngine();

    setTelemetry((prev) => ({
      ...prev,
      endTime: Date.now(),
      totalTimeSeconds: Math.max(1, Math.round((Date.now() - prev.startTime) / 1000))
    }));

    setGameState('FINISHED');
  };

  // Global Clean Reset confirmation trigger
  const handleRequestReset = () => {
    audioService.playClick();
    if (gameState === 'RACING' || gameState === 'ANSWER_FEEDBACK' || gameState === 'COUNTDOWN') {
      setIsResetConfirmOpen(true);
    } else {
      executeReset();
    }
  };

  const executeReset = () => {
    if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    if (aiProgressTimerRef.current) clearInterval(aiProgressTimerRef.current);
    if (feedbackAdvanceTimerRef.current) clearTimeout(feedbackAdvanceTimerRef.current);
    if (nitroTimerRef.current) clearTimeout(nitroTimerRef.current);
    if (skidTimerRef.current) clearTimeout(skidTimerRef.current);

    audioService.stopBackgroundMusic();
    audioService.stopEngine();

    setIsFeedbackMode(false);
    setSelectedAnswerIndex(null);
    setIsAnswerCorrect(null);
    setIsNitroActive(false);
    setIsSkiddingActive(false);
    setIsResetConfirmOpen(false);

    setGameState('START');
  };

  // Find winner racer
  const winnerRacer = useMemo(() => {
    if (racers.length === 0) return playerRacer;
    return [...racers].sort((a, b) => b.progress - a.progress)[0];
  }, [racers, playerRacer]);

  const activeTheme = THEMES[settings.appTheme || 'royal_midnight'] || THEMES.royal_midnight;

  return (
    <div className={`relative w-full min-h-screen ${activeTheme.bgPage} ${activeTheme.isLight ? 'text-slate-900' : 'text-white'} font-sans overflow-x-hidden flex flex-col`}>
      {/* =========================================================================
          PERSISTENT TOP HEADER BAR (Visible in all screens with Restart ↻ button)
      ========================================================================= */}
      <header className={`relative z-40 w-full ${activeTheme.bgHeader} px-3 sm:px-6 py-2.5 backdrop-blur-md flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <h1 className="text-sm sm:text-base font-black tracking-tight flex items-center gap-1.5">
              <span className={`${activeTheme.textAccent} font-racing`}>Need for Science</span>
              <span className={`${activeTheme.isLight ? 'text-slate-400' : 'text-slate-500'} font-normal hidden md:inline`}>|</span>
              <span className={`${activeTheme.isLight ? 'text-slate-800' : 'text-amber-400'} text-xs sm:text-sm hidden md:inline font-bold`}>
                سباق انقسام الخلايا
              </span>
            </h1>
          </div>
          <span className={`hidden lg:inline-block px-2.5 py-0.5 rounded text-[11px] ${activeTheme.badgeBg} ${activeTheme.badgeText} border ${activeTheme.badgeBorder}`}>
            الصف الثالث المتوسط • إعداد وتصميم المعلم: {settings.teacherName || 'فاضل المبارك'}
          </span>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2">
          {/* Quick Theme Picker */}
          <button
            onClick={() => setIsThemeModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${activeTheme.bgSurface} ${activeTheme.textAccent} ${activeTheme.isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800'} border ${activeTheme.borderSubtle} text-xs font-bold transition-all cursor-pointer shadow-sm`}
            title="تغيير ألوان ومظهر السباق"
          >
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">{activeTheme.name}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-xl ${activeTheme.bgSurface} ${activeTheme.textAccent} ${activeTheme.isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'} border ${activeTheme.borderSubtle} transition-colors cursor-pointer`}
            title={settings.isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {settings.isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Teacher Settings Shortcut */}
          <button
            onClick={() => setIsTeacherSettingsOpen(true)}
            className={`hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl ${activeTheme.bgSurface} ${activeTheme.isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800 text-slate-200'} border ${activeTheme.borderSubtle} text-xs font-bold transition-all cursor-pointer`}
          >
            <span>لوحة المعلم</span>
          </button>

          {/* PERSISTENT RESTART BUTTON ↻ REQUIRED IN EVERY STEP */}
          <button
            onClick={handleRequestReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
            title="إعادة تشغيل السباق من البداية ↻"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة السباق ↻</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          VIEW 1: START SCREEN
      ========================================================================= */}
      {gameState === 'START' && (
        <StartScreen
          onStartRace={startRaceFlow}
          onOpenSetup={() => setIsSetupOpen(true)}
          onOpenQuestionBank={() => setIsQuestionBankOpen(true)}
          onOpenSettings={() => setIsTeacherSettingsOpen(true)}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          onOpenThemeSelector={() => setIsThemeModalOpen(true)}
          playerCar={selectedCar}
          studentName={settings.studentName}
          teacherName={settings.teacherName || 'فاضل المبارك'}
          themeId={settings.appTheme || 'royal_midnight'}
          isMuted={settings.isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* =========================================================================
          VIEW 2: COUNTDOWN SCREEN
      ========================================================================= */}
      {gameState === 'COUNTDOWN' && (
        <div className="relative flex-1 w-full flex flex-col items-center justify-center bg-black/90 select-none overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <RaceCanvas3D
              racers={racers}
              playerRacer={playerRacer}
              isNitroActive={false}
              isSkiddingActive={false}
              stage={1}
              currentSpeed={60}
              themeId={settings.appTheme || 'royal_midnight'}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className={`text-xs font-racing tracking-[0.4em] ${activeTheme.textAccent} font-extrabold uppercase mb-2`}>
              READY TO RACE
            </div>
            <div className={`text-7xl sm:text-9xl font-black font-racing ${activeTheme.textAccent} drop-shadow-[0_0_50px_rgba(245,158,11,0.8)] animate-pulse`}>
              {countdownNum}
            </div>
            <div className="mt-4 text-sm sm:text-base font-bold text-slate-200">
              استعد للإجابة بسرعة ودقة لإطلاق شعلة النيترو!
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: RACING & QUESTION FEEDBACK HUD
      ========================================================================= */}
      {(gameState === 'RACING' || gameState === 'ANSWER_FEEDBACK') && (
        <div className="relative flex-1 w-full flex flex-col overflow-hidden">
          {/* Main 3D Three.js Race Track Scene */}
          <div className="absolute inset-0">
            <RaceCanvas3D
              racers={racers}
              playerRacer={playerRacer}
              isNitroActive={isNitroActive}
              isSkiddingActive={isSkiddingActive}
              stage={currentStage}
              currentSpeed={playerRacer.currentSpeed}
              themeId={settings.appTheme || 'royal_midnight'}
            />
          </div>

          {/* Top Race Status Overlay: Stage, Progress Bar, Mini Standings */}
          <div className="relative z-20 w-full max-w-6xl mx-auto px-4 pt-3 flex flex-col gap-2">
            {/* Race Track Distance Progress Bar */}
            <div className={`${activeTheme.bgCard} backdrop-blur-md p-2.5 rounded-2xl border ${activeTheme.borderCard} shadow-lg`}>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <div className={`flex items-center gap-1.5 ${activeTheme.textAccent}`}>
                  <Flag className="w-4 h-4" />
                  <span>المسافة نحو خط النهاية</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`${activeTheme.textAccent} font-racing`}>
                    المركز: {playerRacer.rank} من {racers.length}
                  </span>
                  <span className={`${activeTheme.isLight ? 'text-slate-800' : 'text-white'} font-racing font-bold`}>
                    {Math.round(playerRacer.progress)}%
                  </span>
                </div>
              </div>

              {/* Progress track with moving mini racer markers */}
              <div className={`relative w-full h-3 ${activeTheme.isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-900 border-slate-800'} rounded-full overflow-hidden border`}>
                <div
                  className={`h-full ${activeTheme.btnPrimary} transition-all duration-300`}
                  style={{ width: `${playerRacer.progress}%` }}
                />
              </div>
            </div>

            {/* Quick Rivals Standing Ticker */}
            <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
              {racers.map((racer) => (
                <div
                  key={racer.id}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 border transition-all ${
                    racer.isPlayer
                      ? `${activeTheme.badgeBg} ${activeTheme.textAccent} ${activeTheme.borderAccent} shadow-sm`
                      : activeTheme.isLight
                      ? 'bg-white/90 text-slate-700 border-slate-300'
                      : 'bg-slate-950/80 text-slate-300 border-slate-800'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-racing font-bold ${
                    activeTheme.isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-200'
                  }`}>
                    {racer.rank}
                  </span>
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: racer.car.primaryColor }}
                  />
                  <span>{racer.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Cockpit & Question HUD */}
          <div className="relative z-20 mt-auto w-full p-4 flex flex-col lg:flex-row items-end justify-between gap-4 pointer-events-none">
            {/* Speedometer & Tachometer Gauge (Bottom-Left) */}
            <div className="pointer-events-auto shrink-0 mx-auto lg:mx-0">
              <Speedometer
                speed={playerRacer.currentSpeed}
                isNitro={isNitroActive}
                nitroLevel={isNitroActive ? 100 : Math.min(100, Math.round(playerRacer.progress) + 20)}
                themeId={settings.appTheme || 'royal_midnight'}
              />
            </div>

            {/* Interactive Question Panel (Bottom-Center / Right) */}
            <div className="pointer-events-auto w-full max-w-3xl">
              {currentQuestion && (
                <QuestionPanel
                  question={currentQuestion}
                  questionIndex={currentQIndex}
                  totalQuestions={sessionQuestions.length}
                  stageName={stageName}
                  timeRemaining={timeRemaining}
                  onSelectAnswer={handleSelectAnswer}
                  onRetryQuestion={handleRetryQuestion}
                  allowRetry={settings.allowRetryQuestion}
                  allowHint={settings.allowHints}
                  isFeedbackMode={isFeedbackMode}
                  selectedAnswerIndex={selectedAnswerIndex}
                  isCorrect={isAnswerCorrect}
                  themeId={settings.appTheme || 'royal_midnight'}
                  onHintUsed={() =>
                    setTelemetry((prev) => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }))
                  }
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: RESULTS & PODIUM SCREEN
      ========================================================================= */}
      {gameState === 'FINISHED' && (
        <ResultsScreen
          winner={winnerRacer}
          racers={racers}
          playerRacer={playerRacer}
          telemetry={telemetry}
          studentName={settings.studentName}
          teacherName={settings.teacherName || 'فاضل المبارك'}
          themeId={settings.appTheme || 'royal_midnight'}
          onReplayRace={startRaceFlow}
          onNewRace={() => {
            setGameState('START');
            setIsSetupOpen(true);
          }}
        />
      )}

      {/* =========================================================================
          MODALS & OVERLAYS
      ========================================================================= */}
      {/* Racer Setup Modal */}
      <RacerSetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        settings={settings}
        onUpdateSettings={(newSt) => setSettings((prev) => ({ ...prev, ...newSt }))}
        selectedCar={selectedCar}
        onSelectCar={setSelectedCar}
        aiRacerNames={aiRacerNames}
        onUpdateAiNames={setAiRacerNames}
      />

      {/* Question Bank Manager Modal */}
      <QuestionBankModal
        isOpen={isQuestionBankOpen}
        onClose={() => setIsQuestionBankOpen(false)}
        questions={questions}
        onUpdateQuestions={handleUpdateQuestions}
      />

      {/* Teacher Settings Control Panel Modal */}
      <TeacherSettingsModal
        isOpen={isTeacherSettingsOpen}
        onClose={() => setIsTeacherSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSt) => setSettings((prev) => ({ ...prev, ...newSt }))}
        onResetAll={() => {
          setSettings(DEFAULT_SETTINGS);
          setQuestions([...INITIAL_QUESTIONS]);
        }}
      />

      {/* How to Play Guide Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      {/* Restart Race Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onConfirm={executeReset}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      {/* Theme Palette Customizer Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={settings.appTheme || 'royal_midnight'}
        onSelectTheme={(t) => setSettings((prev) => ({ ...prev, appTheme: t }))}
      />
    </div>
  );
}
