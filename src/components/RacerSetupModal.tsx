import React from 'react';
import { X, Car, Plus, Trash2, Users, Check, Flame } from 'lucide-react';
import { GameSettings, CarModel } from '../types/game';
import { DEFAULT_CARS, AI_NAMES } from '../data/questions';

interface RacerSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  selectedCar: CarModel;
  onSelectCar: (car: CarModel) => void;
  aiRacerNames: string[];
  onUpdateAiNames: (names: string[]) => void;
}

export const RacerSetupModal: React.FC<RacerSetupModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  selectedCar,
  onSelectCar,
  aiRacerNames,
  onUpdateAiNames
}) => {
  if (!isOpen) return null;

  const handleAddRacer = () => {
    if (settings.racerCount < 8) {
      const nextCount = settings.racerCount + 1;
      const defaultName = AI_NAMES[(nextCount - 2) % AI_NAMES.length];
      onUpdateSettings({ racerCount: nextCount });
      onUpdateAiNames([...aiRacerNames, defaultName]);
    }
  };

  const handleRemoveRacer = (index: number) => {
    if (settings.racerCount > 2) {
      const nextCount = settings.racerCount - 1;
      onUpdateSettings({ racerCount: nextCount });
      const newNames = aiRacerNames.filter((_, idx) => idx !== index);
      onUpdateAiNames(newNames);
    }
  };

  const handleAiNameChange = (index: number, newName: string) => {
    const updated = [...aiRacerNames];
    updated[index] = newName;
    onUpdateAiNames(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0b1736] border-2 border-cyan-500/60 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(6,182,212,0.3)] my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-4 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">إعداد المتسابقين والسيارة</h2>
            <p className="text-xs sm:text-sm text-slate-400">تخصيص سيارة الطالب واختيار المنافسين في حلبة السباق</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Section 1: Player Name & Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">اسم المتسابق (الطالب):</label>
              <input
                type="text"
                value={settings.studentName}
                onChange={(e) => onUpdateSettings({ studentName: e.target.value })}
                placeholder="أدخل اسمك (اختياري)..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">نمط السباق:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ isSoloMode: false })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    !settings.isSoloMode
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>سباق تنافسي</span>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ isSoloMode: true })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    settings.isSoloMode
                      ? 'bg-purple-950 text-purple-300 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>تدريب فردي</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Choose Player Car */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">اختر سيارة السباق المفضلة:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {DEFAULT_CARS.map((car) => {
                const isSelected = selectedCar.id === car.id;
                return (
                  <button
                    key={car.id}
                    onClick={() => onSelectCar(car)}
                    className={`relative p-3 rounded-2xl border-2 text-right transition-all flex flex-col justify-between h-24 ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="w-5 h-5 rounded-full border border-white/40 shadow-sm"
                        style={{ backgroundColor: car.primaryColor }}
                      />
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">{car.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Sport Edition</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: AI Competitors Management (if not solo) */}
          {!settings.isSoloMode && (
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs sm:text-sm font-bold text-slate-200">
                    السيارات المنافسة في المضمار ({settings.racerCount} سيارات إجمالاً)
                  </span>
                </div>
                {settings.racerCount < 8 && (
                  <button
                    onClick={handleAddRacer}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-bold hover:bg-cyan-900 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة منافس</span>
                  </button>
                )}
              </div>

              {/* Competitors List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
                {aiRacerNames.slice(0, settings.racerCount - 1).map((aiName, idx) => {
                  const car = DEFAULT_CARS[(idx + 1) % DEFAULT_CARS.length];
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800"
                    >
                      <div className="flex items-center gap-2.5 flex-1 ml-2">
                        <div
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: car.primaryColor }}
                        />
                        <input
                          type="text"
                          value={aiName}
                          onChange={(e) => handleAiNameChange(idx, e.target.value)}
                          className="bg-transparent text-xs font-semibold text-slate-200 border-b border-transparent focus:border-cyan-400 focus:outline-none w-full"
                        />
                      </div>
                      {settings.racerCount > 2 && (
                        <button
                          onClick={() => handleRemoveRacer(idx)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                          title="حذف المنافس"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 4: Difficulty & Race Length */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">مستوى الذكاء الاصطناعي للمنافسين:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'medium', 'hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => onUpdateSettings({ aiDifficulty: diff })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      settings.aiDifficulty === diff
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-400 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {diff === 'easy' ? 'سهل' : diff === 'medium' ? 'متوسط' : 'صعب'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">عدد أسئلة السباق:</label>
              <select
                value={settings.totalQuestions}
                onChange={(e) => onUpdateSettings({ totalQuestions: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm font-semibold focus:border-cyan-400 focus:outline-none"
              >
                <option value={6}>6 أسئلة (سباق سريع - دقيقتان)</option>
                <option value={9}>9 أسئلة (3 أسئلة لكل مرحلة)</option>
                <option value={12}>12 سؤالاً (4 أسئلة لكل مرحلة - قياسي)</option>
                <option value={15}>15 سؤالاً (5 أسئلة لكل مرحلة)</option>
                <option value={21}>21 سؤالاً (سباق طويل وشامل)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-7 flex justify-end gap-3 border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all"
          >
            تأكيد والعودة للسباق ✓
          </button>
        </div>
      </div>
    </div>
  );
};
