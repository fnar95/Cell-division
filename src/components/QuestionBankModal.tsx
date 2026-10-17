import React, { useState } from 'react';
import { X, Search, Plus, Trash2, Edit3, Download, Upload, RotateCcw, BookOpen, Check, AlertCircle } from 'lucide-react';
import { Question, Difficulty, RaceStage } from '../types/game';
import { INITIAL_QUESTIONS } from '../data/questions';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  onUpdateQuestions: (questions: Question[]) => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  isOpen,
  onClose,
  questions,
  onUpdateQuestions
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterStage, setFilterStage] = useState<string>('all');

  // Edit / Add modal state
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter questions
  const filtered = questions.filter((q) => {
    const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase()) || q.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiff = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
    const matchesStage = filterStage === 'all' || q.stage.toString() === filterStage;
    return matchesSearch && matchesDiff && matchesStage;
  });

  const handleDelete = (id: string) => {
    if (questions.length <= 6) {
      alert('لا يمكن تقليص بنك الأسئلة لأقل من 6 أسئلة لتشغيل السباق.');
      return;
    }
    if (confirm('هل أنت متأكد من حذف هذا السؤال من بنك الأسئلة؟')) {
      const updated = questions.filter((q) => q.id !== id);
      onUpdateQuestions(updated);
      showNotice('تم حذف السؤال بنجاح.');
    }
  };

  const handleResetDefaults = () => {
    if (confirm('هل ترغب في استعادة بنك الأسئلة الأصلي (42 سؤالاً معتمداً)؟')) {
      onUpdateQuestions([...INITIAL_QUESTIONS]);
      showNotice('تمت استعادة بنك الأسئلة الأصلي كاملاً.');
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `need_for_science_questions_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotice('تم تصدير بنك الأسئلة بصيغة JSON بنجاح.');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].text) {
          onUpdateQuestions(parsed);
          showNotice(`تم استيراد ${parsed.length} سؤال بنجاح.`);
        } else {
          alert('ملف غير صالح، تأكد من بنية أسئلة اللعبة.');
        }
      } catch {
        alert('تعذر قراءة ملف JSON، يرجى التحقق من صحة الملف.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSaveQuestion = (qToSave: Question) => {
    if (isAddingNew) {
      onUpdateQuestions([qToSave, ...questions]);
      setIsAddingNew(false);
      showNotice('تمت إضافة السؤال الجديد بنجاح.');
    } else {
      const updated = questions.map((q) => (q.id === qToSave.id ? qToSave : q));
      onUpdateQuestions(updated);
      setEditingQuestion(null);
      showNotice('تم حفظ تعديلات السؤال بنجاح.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0b1736] border-2 border-cyan-500/60 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(6,182,212,0.3)] my-6 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/30 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">بنك أسئلة انقسام الخلايا</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 text-xs font-bold">
                  {questions.length} سؤالاً
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                منهج العلوم للصف الثالث المتوسط – إدارة وتعديل واستيراد وتصدير الأسئلة
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setEditingQuestion({
                  id: 'q_' + Date.now(),
                  text: '',
                  type: 'mcq',
                  options: ['', '', '', ''],
                  correctIndex: 0,
                  explanation: '',
                  difficulty: 'medium',
                  topic: 'مراحل الانقسام المتساوي',
                  stage: 2,
                  hint: ''
                });
                setIsAddingNew(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold shadow-md transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إضافة سؤال جديد</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
              title="تصدير نسخة احتياطية بصيغة JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تصدير JSON</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold cursor-pointer transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">استيراد JSON</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            <button
              onClick={handleResetDefaults}
              className="p-2 rounded-xl bg-slate-900 hover:bg-amber-950/40 text-amber-400 border border-slate-700 text-xs font-bold transition-all"
              title="استعادة الأسئلة الأصلية"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification Pill */}
        {notification && (
          <div className="mb-3 px-4 py-2 bg-cyan-950 border border-cyan-500/60 rounded-xl text-cyan-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-cyan-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث في نص السؤال أو الموضوع..."
              className="w-full pr-9 pl-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="all">جميع مستويات الصعوبة</option>
            <option value="easy">سهل</option>
            <option value="medium">متوسط</option>
            <option value="hard">صعب</option>
          </select>

          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="all">جميع مراحل السباق الثلاث</option>
            <option value="1">المرحلة 1: الانطلاق (مفهوم ودورة الخلية)</option>
            <option value="2">المرحلة 2: السرعة القصوى (مراحل المتساوي)</option>
            <option value="3">المرحلة 3: التحدي النهائي (السيتوبلازم والمقارنات)</option>
          </select>
        </div>

        {/* Questions Scrollable List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm flex flex-col items-center gap-2">
              <AlertCircle className="w-8 h-8 text-slate-600" />
              <span>لا توجد أسئلة مطابقة للبحث الحالي.</span>
            </div>
          ) : (
            filtered.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xs font-bold font-racing">
                      {idx + 1}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                      {q.topic}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      q.difficulty === 'easy'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                        : q.difficulty === 'medium'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                        : 'bg-red-950/80 text-red-300 border border-red-500/30'
                    }`}>
                      {q.difficulty === 'easy' ? 'سهل' : q.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30 font-bold">
                      المرحلة {q.stage}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingQuestion({ ...q });
                        setIsAddingNew(false);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                      title="تعديل السؤال"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                      title="حذف السؤال"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-sm sm:text-base font-bold text-white leading-relaxed">
                  {q.text}
                </div>

                {/* Options preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-2 rounded-lg border text-right ${
                        oIdx === q.correctIndex
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="font-bold ml-1.5 text-slate-400">{oIdx + 1})</span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>

                {/* Explanation preview */}
                <div className="text-[11px] text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-cyan-400 font-bold">التفسير: </span>
                  <span>{q.explanation}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit / Create Question Sub-Modal */}
        {editingQuestion && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="relative w-full max-w-2xl bg-slate-950 border-2 border-cyan-400 rounded-3xl p-5 sm:p-6 shadow-[0_0_60px_rgba(6,182,212,0.4)] max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setEditingQuestion(null)}
                className="absolute top-4 left-4 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">
                {isAddingNew ? 'إضافة سؤال جديد إلى بنك الأسئلة' : 'تعديل السؤال'}
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">نص السؤال:</label>
                  <textarea
                    rows={2}
                    value={editingQuestion.text}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                    placeholder="اكتب نص السؤال هنا..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">نوع السؤال:</label>
                    <select
                      value={editingQuestion.type}
                      onChange={(e) => {
                        const nextType = e.target.value as 'mcq' | 'true_false';
                        setEditingQuestion({
                          ...editingQuestion,
                          type: nextType,
                          options: nextType === 'true_false' ? ['صح', 'خطأ'] : ['', '', '', ''],
                          correctIndex: 0
                        });
                      }}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    >
                      <option value="mcq">اختيار من متعدد (4 خيارات)</option>
                      <option value="true_false">صح أم خطأ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">المستوى:</label>
                    <select
                      value={editingQuestion.difficulty}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, difficulty: e.target.value as Difficulty })}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    >
                      <option value="easy">سهل</option>
                      <option value="medium">متوسط</option>
                      <option value="hard">صعب</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">مرحلة السباق:</label>
                    <select
                      value={editingQuestion.stage}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, stage: Number(e.target.value) as RaceStage })}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    >
                      <option value={1}>المرحلة 1 (الانطلاق)</option>
                      <option value={2}>المرحلة 2 (السرعة القصوى)</option>
                      <option value={3}>المرحلة 3 (التحدي النهائي)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">الموضوع العلمي:</label>
                  <input
                    type="text"
                    value={editingQuestion.topic}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, topic: e.target.value })}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                {/* Options inputs */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">الخيارات (اختر الإجابة الصحيحة بالدائرة):</label>
                  <div className="space-y-2">
                    {editingQuestion.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctOptionRadio"
                          checked={editingQuestion.correctIndex === oIdx}
                          onChange={() => setEditingQuestion({ ...editingQuestion, correctIndex: oIdx })}
                          className="w-4 h-4 text-cyan-500 accent-cyan-400"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...editingQuestion.options];
                            newOpts[oIdx] = e.target.value;
                            setEditingQuestion({ ...editingQuestion, options: newOpts });
                          }}
                          placeholder={`الخيار ${oIdx + 1}`}
                          className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">التفسير العلمي:</label>
                  <textarea
                    rows={2}
                    value={editingQuestion.explanation}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    placeholder="التفسير الذي يظهر للطالب عند الإجابة..."
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">التلميح (Hint):</label>
                  <input
                    type="text"
                    value={editingQuestion.hint}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, hint: e.target.value })}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    placeholder="تلميح مبسط لمساعدة الطالب..."
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2 border-t border-slate-800 pt-3">
                <button
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleSaveQuestion(editingQuestion)}
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold shadow-md hover:bg-cyan-400"
                >
                  حفظ السؤال ✓
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
