import React, { useState } from 'react';
import { Chapter, UserStats } from '../types';
import { CheckCircle2, CircleDashed, BookOpen, Clock, Layers, Sparkles } from 'lucide-react';

interface Props {
  chapters: Chapter[];
  userStats: UserStats;
  onSelectChapter?: (chapterId: string) => void;
}

export const ChapterProgressChart: React.FC<Props> = ({
  chapters,
  userStats,
  onSelectChapter
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'remaining'>('all');

  const totalChapters = chapters.length;
  const completedChapters = chapters.filter((c) =>
    userStats.completedChapters.includes(c.id)
  );
  const remainingChapters = chapters.filter(
    (c) => !userStats.completedChapters.includes(c.id)
  );

  const completedCount = completedChapters.length;
  const remainingCount = remainingChapters.length;

  const completedRatio = totalChapters > 0 ? completedCount / totalChapters : 0;
  const completedPercent = Math.round(completedRatio * 100);
  const remainingPercent = 100 - completedPercent;

  const completedMinutes = completedChapters.reduce(
    (acc, c) => acc + (c.readTimeMinutes || 10),
    0
  );
  const remainingMinutes = remainingChapters.reduce(
    (acc, c) => acc + (c.readTimeMinutes || 10),
    0
  );
  const totalBookMinutes = completedMinutes + remainingMinutes;

  // Donut chart calculations (Radius 42, Circumference ~263.89)
  const radius = 42;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const completedStrokeDashoffset = circumference - completedRatio * circumference;

  const filteredChapters =
    selectedFilter === 'completed'
      ? completedChapters
      : selectedFilter === 'remaining'
      ? remainingChapters
      : chapters;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Chapter Completion Ratio
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {completedCount} of {totalChapters} modules finished ({completedPercent}%)
            </p>
          </div>
        </div>

        {completedCount === totalChapters ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Fully Finished!
          </span>
        ) : (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            {remainingCount} {remainingCount === 1 ? 'module' : 'modules'} left
          </span>
        )}
      </div>

      {/* Chart Section: Donut + Detailed Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1">
        {/* Donut Chart SVG */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background Ring (Remaining Chapters) */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-200 dark:text-slate-700/80 stroke-current"
                strokeWidth={strokeWidth}
                fill="transparent"
              />

              {/* Completed Arc */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-emerald-500 dark:text-emerald-400 stroke-current transition-all duration-700 ease-out"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={completedStrokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Stats Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono tracking-tight">
                {completedPercent}%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {completedCount}/{totalChapters} Done
              </span>
            </div>
          </div>

          {/* Mini Legend Below Donut */}
          <div className="flex items-center gap-3 mt-2 text-[11px] font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600 dark:text-slate-400 font-semibold">
                Completed ({completedCount})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="text-slate-500 dark:text-slate-400 font-semibold">
                Remaining ({remainingCount})
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Ratio Cards & Proportional Progress Bar */}
        <div className="sm:col-span-7 space-y-3">
          {/* Stacked Ratio Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {completedCount} Done ({completedPercent}%)
              </span>
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <CircleDashed className="w-3.5 h-3.5" /> {remainingCount} Pending ({remainingPercent}%)
              </span>
            </div>

            {/* Visual Multi-Segment Bar */}
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-700/80 rounded-full overflow-hidden flex border border-slate-200/80 dark:border-slate-600/50">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${completedPercent}%` }}
                title={`Completed: ${completedCount} chapters (${completedPercent}%)`}
              />
              <div
                className="h-full bg-slate-200 dark:bg-slate-600 transition-all duration-500"
                style={{ width: `${remainingPercent}%` }}
                title={`Remaining: ${remainingCount} chapters (${remainingPercent}%)`}
              />
            </div>
          </div>

          {/* Ratio Comparison Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedFilter(selectedFilter === 'completed' ? 'all' : 'completed')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedFilter === 'completed'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                  : 'border-slate-200 dark:border-slate-700/70 bg-slate-50/60 dark:bg-slate-800/40 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Completed
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.2 rounded">
                  {completedPercent}%
                </span>
              </div>
              <div className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {completedCount} <span className="text-[11px] font-sans text-slate-400 font-normal">chapters</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-2.5 h-2.5" />
                <span>~{completedMinutes} mins read</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFilter(selectedFilter === 'remaining' ? 'all' : 'remaining')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedFilter === 'remaining'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-500'
                  : 'border-slate-200 dark:border-slate-700/70 bg-slate-50/60 dark:bg-slate-800/40 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Remaining
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded">
                  {remainingPercent}%
                </span>
              </div>
              <div className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {remainingCount} <span className="text-[11px] font-sans text-slate-400 font-normal">chapters</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-2.5 h-2.5" />
                <span>~{remainingMinutes} mins left</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Chapter Grid Breakdown */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            Module Matrix ({filteredChapters.length} {selectedFilter !== 'all' ? selectedFilter : 'total'})
          </span>
          <div className="flex gap-1 text-[10px]">
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All ({totalChapters})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('completed')}
              className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                selectedFilter === 'completed'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-500 hover:text-emerald-600'
              }`}
            >
              Done ({completedCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('remaining')}
              className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                selectedFilter === 'remaining'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              Remaining ({remainingCount})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
          {filteredChapters.map((chapter) => {
            const isDone = userStats.completedChapters.includes(chapter.id);
            return (
              <div
                key={chapter.id}
                onClick={() => onSelectChapter && onSelectChapter(chapter.id)}
                className={`p-2 rounded-lg border text-xs flex items-center justify-between gap-2 transition-all ${
                  isDone
                    ? 'border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-800 dark:text-slate-200'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400'
                } ${onSelectChapter ? 'cursor-pointer hover:border-blue-400' : ''}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isDone ? '✓' : chapter.number}
                  </span>
                  <span className="font-medium truncate text-[11px]">
                    {chapter.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 text-[10px]">
                  <span className="text-slate-400 font-mono">
                    {chapter.readTimeMinutes}m
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded font-semibold text-[9px] uppercase tracking-wider ${
                      isDone
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isDone ? 'Done' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
