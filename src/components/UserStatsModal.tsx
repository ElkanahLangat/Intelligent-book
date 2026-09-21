import React, { useState } from 'react';
import { UserStats, Chapter } from '../types';
import { ChapterProgressChart } from './ChapterProgressChart';
import {
  X,
  Flame,
  Clock,
  Target,
  Trophy,
  CheckCircle2,
  BookOpen,
  Bookmark,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  Calendar,
  ChevronRight,
  Sliders,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  chapters: Chapter[];
  notesCount: number;
  onUpdateGoal: (minutes: number) => void;
  onSelectChapter?: (chapterId: string) => void;
}

const PRESET_GOALS = [5, 10, 15, 20, 30, 45, 60];

export const UserStatsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userStats,
  chapters,
  notesCount,
  onUpdateGoal,
  onSelectChapter
}) => {
  const [isEditingGoal, setIsEditingGoal] = useState<boolean>(false);
  const [customGoal, setCustomGoal] = useState<number>(userStats.dailyReadingGoalMinutes || 15);

  if (!isOpen) return null;

  const dailyGoalMinutes = userStats.dailyReadingGoalMinutes || 15;
  const todaySeconds = userStats.todayReadingSeconds || 0;
  const todayMinutes = todaySeconds / 60;
  const progressPercent = Math.min(100, Math.round((todayMinutes / dailyGoalMinutes) * 100));
  const isGoalAchieved = todayMinutes >= dailyGoalMinutes;

  const totalMinutes = Math.floor((userStats.totalReadingSeconds || 0) / 60);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const completedCount = userStats.completedChapters.length;
  const totalChapters = chapters.length;
  const bookProgressPercent = Math.round((completedCount / Math.max(1, totalChapters)) * 100);

  // Remaining book time
  const remainingMinutes = chapters
    .filter(c => !userStats.completedChapters.includes(c.id))
    .reduce((acc, c) => acc + (c.readTimeMinutes || 10), 0);

  const daysToFinishAtCurrentGoal = dailyGoalMinutes > 0 ? Math.ceil(remainingMinutes / dailyGoalMinutes) : 1;

  // Quizzes average
  const quizScores = Object.values(userStats.quizScores || {}) as number[];
  const avgQuizScore =
    quizScores.length > 0
      ? Math.round(quizScores.reduce((a: number, b: number) => a + b, 0) / quizScores.length)
      : null;

  // 7-day history generation
  const today = new Date();
  const past7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dateKey = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = d.getDate();
    const isCurrentDay = dateKey === (userStats.todayDate || new Date().toISOString().split('T')[0]);
    const secondsForDay = isCurrentDay
      ? todaySeconds
      : (userStats.historyDates && userStats.historyDates[dateKey]) || 0;
    const minsForDay = Math.round(secondsForDay / 60);
    const goalMet = minsForDay >= dailyGoalMinutes && minsForDay > 0;

    return {
      dateKey,
      dayName,
      dayNumber,
      isCurrentDay,
      minsForDay,
      goalMet
    };
  });

  const handleSaveGoal = (goal: number) => {
    onUpdateGoal(goal);
    setIsEditingGoal(false);
  };

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Milestone Achievements
  const achievements = [
    {
      id: 'first_chapter',
      title: 'First Step',
      desc: 'Complete Chapter 1',
      unlocked: completedCount >= 1,
      icon: '🚀'
    },
    {
      id: 'daily_goal',
      title: 'Daily Habit',
      desc: `Reach ${dailyGoalMinutes}m daily target`,
      unlocked: isGoalAchieved,
      icon: '🎯'
    },
    {
      id: 'streak_3',
      title: 'Founder Sprint',
      desc: 'Maintain a 3-day reading streak',
      unlocked: userStats.streakDays >= 3,
      icon: '🔥'
    },
    {
      id: 'notes_taker',
      title: 'Active Learner',
      desc: 'Save 3+ highlights or notes',
      unlocked: notesCount >= 3,
      icon: '💡'
    },
    {
      id: 'quiz_master',
      title: 'Concept Master',
      desc: 'Score 80%+ on any chapter quiz',
      unlocked: quizScores.some(s => s >= 80),
      icon: '🎓'
    },
    {
      id: 'book_complete',
      title: 'Venture Ready',
      desc: 'Complete all 8 modules',
      unlocked: completedCount >= totalChapters,
      icon: '🏆'
    }
  ];

  return (
    <div
      id="user-stats-dashboard-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800/60">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Founder Reading Stats & Goal Tracker
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cultivate daily startup mastery and track execution velocity
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* PRIMARY: Daily Reading Goal Tracker Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50/40 to-slate-50 dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/60 shadow-xs relative overflow-hidden">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1 rounded-md bg-blue-600 text-white">
                    <Target className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                    Daily Reading Goal Tracker
                  </span>
                  {isGoalAchieved && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Goal Achieved!
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-baseline gap-2">
                  <span>{todayMinutes.toFixed(1)}</span>
                  <span className="text-sm font-semibold text-slate-400">/ {dailyGoalMinutes} mins today</span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {isGoalAchieved && (
                  <button
                    type="button"
                    onClick={handleCelebrate}
                    className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                    title="Celebrate Goal"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Celebrate</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsEditingGoal(!isEditingGoal)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isEditingGoal ? 'Close' : 'Set Target'}</span>
                </button>
              </div>
            </div>

            {/* Goal Progress Bar */}
            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-400">
                  {isGoalAchieved
                    ? `Completed 100% (+${Math.max(0, (todayMinutes - dailyGoalMinutes)).toFixed(1)}m bonus)`
                    : `${Math.max(0, Math.ceil(dailyGoalMinutes - todayMinutes))} mins remaining today`}
                </span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {progressPercent}%
                </span>
              </div>
              <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-300/60 dark:border-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isGoalAchieved
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-500'
                  }`}
                  style={{ width: `${Math.min(100, progressPercent)}%` }}
                />
              </div>
            </div>

            {/* Goal Setting Drawer/Controls */}
            {isEditingGoal && (
              <div className="mt-4 pt-4 border-t border-blue-200/60 dark:border-blue-900/60 animate-in fade-in duration-150">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Select Daily Target (Minutes):
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {PRESET_GOALS.map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => handleSaveGoal(mins)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        dailyGoalMinutes === mins
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 font-medium">Custom:</span>
                  <input
                    type="range"
                    min="1"
                    max="120"
                    step="5"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(Number(e.target.value))}
                    className="flex-1 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold w-12 text-right text-blue-600">
                    {customGoal}m
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSaveGoal(customGoal)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 mb-1">
                <Flame className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Streak</span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                {userStats.streakDays} <span className="text-xs font-sans text-slate-400">days</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-auto">Consecutive reading</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col">
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Time</span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                {totalHours} <span className="text-xs font-sans text-slate-400">hrs</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-auto">{totalMinutes} mins total</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Completed</span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                {completedCount}/{totalChapters}
              </div>
              <div className="text-[10px] text-slate-400 mt-auto">{bookProgressPercent}% of book</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col">
              <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 mb-1">
                <Award className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Quiz Avg</span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                {avgQuizScore !== null ? `${avgQuizScore}%` : 'N/A'}
              </div>
              <div className="text-[10px] text-slate-400 mt-auto">{quizScores.length} quizzes taken</div>
            </div>
          </div>

          {/* VISUAL PROGRESS VISUALIZATION: Donut & Bar Chart for Completed vs. Remaining Chapters */}
          <ChapterProgressChart
            chapters={chapters}
            userStats={userStats}
            onSelectChapter={(id) => {
              if (onSelectChapter) {
                onSelectChapter(id);
                onClose();
              }
            }}
          />

          {/* 7-Day Reading Consistency Heatmap */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Last 7 Days Consistency
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Target: {dailyGoalMinutes}m/day</span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {past7Days.map((day) => (
                <div
                  key={day.dateKey}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    day.isCurrentDay
                      ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 font-bold'
                      : day.goalMet
                      ? 'border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="text-[10px] text-slate-400 uppercase">{day.dayName}</div>
                  <div className="text-xs font-semibold my-0.5 text-slate-800 dark:text-slate-200">
                    {day.dayNumber}
                  </div>
                  <div
                    className={`text-[10px] font-mono font-bold ${
                      day.goalMet
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : day.minsForDay > 0
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  >
                    {day.minsForDay}m
                  </div>
                  <div className="mt-1 flex justify-center">
                    {day.goalMet ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    ) : day.minsForDay > 0 ? (
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reading Velocity & Estimated Completion */}
          <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
                  Finish Projection
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {remainingMinutes > 0 ? (
                    <>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {remainingMinutes} minutes
                      </span>{' '}
                      remaining. At your {dailyGoalMinutes}m/day pace, you'll complete the playbook in ~
                      <span className="font-bold">{daysToFinishAtCurrentGoal} days</span>.
                    </>
                  ) : (
                    '🎉 Congratulations! You have completed all 8 chapters of the manual.'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Milestone Badges */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Milestone Badges ({achievements.filter(a => a.unlocked).length}/{achievements.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all ${
                    ach.unlocked
                      ? 'border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 text-slate-800 dark:text-slate-200'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20 opacity-50 text-slate-400'
                  }`}
                >
                  <span className="text-xl shrink-0">{ach.icon}</span>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold truncate flex items-center gap-1">
                      <span>{ach.title}</span>
                      {ach.unlocked && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      {ach.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            Current streak: <strong className="text-slate-700 dark:text-slate-300">{userStats.streakDays} days</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
