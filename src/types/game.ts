export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'mcq' | 'true_false';
export type RaceStage = 1 | 2 | 3; // 1: الانطلاق, 2: السرعة القصوى, 3: التحدي النهائي

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: string[]; // 4 for mcq, 2 for true/false
  correctIndex: number;
  explanation: string;
  difficulty: Difficulty;
  topic: string;
  stage: RaceStage;
  hint: string;
  diagramSvg?: string; // Optional embedded SVG diagram illustration (e.g. metaphase, chromosome, cytokinesis)
}

export interface CarModel {
  id: string;
  name: string;
  primaryColor: string;
  accentColor: string;
  neonColor: string;
  bodyStyle: 'supercar' | 'muscle' | 'cyber' | 'formula';
}

export interface Racer {
  id: string;
  name: string;
  car: CarModel;
  isPlayer: boolean;
  progress: number; // 0 to 100
  currentSpeed: number; // km/h
  lane: number; // -1.5, -0.5, 0.5, 1.5 etc
  rank: number;
  correctAnswers: number;
  wrongAnswers: number;
  color: string;
  isSkidding: boolean;
  isNitro: boolean;
}

export type AppTheme =
  | 'royal_midnight'
  | 'academic_light'
  | 'royal_gold'
  | 'cyber_emerald'
  | 'crimson_nitro'
  | 'cosmic_cyan';

export interface GameSettings {
  racerCount: number; // 2 to 8
  aiDifficulty: Difficulty; // easy, medium, hard
  isSoloMode: boolean; // practice mode
  totalQuestions: number; // 6 to 30
  questionTimeLimit: number; // 0 for unlimited, or 15, 20, 30, 45 seconds
  allowRetryQuestion: boolean;
  allowHints: boolean;
  speedBoostPerCorrect: number; // km/h boost (default 40)
  progressStepPerCorrect: number; // % progress per correct answer (e.g., 10%)
  skidPenalty: number; // speed loss on wrong answer
  sfxVolume: number; // 0 to 1
  musicVolume: number; // 0 to 1
  isMuted: boolean;
  studentName: string;
  teacherName?: string;
  appTheme?: AppTheme;
  stageTransitionCount: number; // questions per stage
}

export type GameState =
  | 'START'
  | 'SETUP'
  | 'COUNTDOWN'
  | 'RACING'
  | 'ANSWER_FEEDBACK'
  | 'FINISHED';

export interface RaceTelemetry {
  startTime: number;
  endTime: number;
  totalTimeSeconds: number;
  totalAnswered: number;
  correctCount: number;
  wrongCount: number;
  accuracyPercentage: number;
  hintsUsed: number;
  maxSpeedReached: number;
  userAnswers: {
    question: Question;
    selectedOption: number;
    isCorrect: boolean;
    timeTakenSeconds: number;
  }[];
}
