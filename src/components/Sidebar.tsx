import React from 'react';
import { Chapter, UserStats } from '../types';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  Bookmark,
  Search,
  Bot,
  Volume2,
  X,
  ArrowRight,
  HardDrive,
  ListChecks,
  Briefcase,
  Target,
  Flame,
  TrendingUp
} from 'lucide-react';

interface Props {
  chapters: Chapter[];
  currentChapterId: string;
  onSelectChapter: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  onOpenNotes: () => void;
  onOpenSearch: () => void;
  onOpenAIMentor: () => void;
  onOpenAudio: () => void;
  onOpenDrive: () => void;
  onOpenChecklist: () => void;
  onOpenCaseStudies: () => void;
  onOpenStats?: () => void;
  onUpdateGoal?: (minutes: number) => void;
}

export const Sidebar: React.FC<Props> = ({
  chapters,
  currentChapterId,
  onSelectChapter,
  isOpen,
  onClose,
  userStats,
  onOpenNotes,
  onOpenSearch,
  onOpenAIMentor,
  onOpenAudio,
  onOpenDrive,
  onOpenChecklist,
  onOpenCaseStudies,
  onOpenStats,
  onUpdateGoal
}) => {
  const completedCount = userStats.completedChapters.length;
  const progressPercent = Math.round((completedCount / Math.max(1, chapters.length)) * 100);

  const dailyGoalMinutes = userStats.dailyReadingGoalMinutes || 15;
  const todayMinutes = (userStats.todayReadingSeconds || 0) / 60;
  const goalPercent = Math.min(100, Math.round((todayMinutes / dailyGoalMinutes) * 100));
  const isGoalMet = todayMinutes >= dailyGoalMinutes;

  const currentIdx = chapters.findIndex(c => c.id === currentChapterId);
  const nextChapter = currentIdx < chapters.length - 1 ? chapters[currentIdx + 1] : null;

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        id="ebook-sidebar-toc"
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 sm:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out font-sans ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Book Title Header */}
        <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white shadow-xs shadow-blue-500/20">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight uppercase text-slate-900 dark:text-slate-100 block">
                Foundry Foundations
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block -mt-0.5">
                Founder Field Manual
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Daily Reading Goal Tracker Card in Sidebar */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-900/60 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (onOpenStats) onOpenStats();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 hover:border-blue-300 dark:hover:border-blue-700 transition-all text-left group cursor-pointer shadow-2xs"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Daily Goal
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-200/60 dark:border-amber-900/40">
                <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{userStats.streakDays}d Streak</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-600 dark:text-slate-400">
                {todayMinutes.toFixed(1)}m of {dailyGoalMinutes}m read
              </span>
              <span className={`font-mono font-bold text-xs ${isGoalMet ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                {goalPercent}%
              </span>
            </div>

            {/* Daily Goal Progress Bar */}
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isGoalMet
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-500'
                }`}
                style={{ width: `${goalPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-700/60 text-[10px] text-slate-400">
              <span className="flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                <TrendingUp className="w-3 h-3" />
                View Full Stats Dashboard
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:underline">
                Adjust Target →
              </span>
            </div>
          </button>
        </div>

        {/* Action Hubs: Google Drive, Validation Checklist, Case Studies */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              onOpenDrive();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full p-2 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-blue-800 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/60 flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Google Drive Cloud Hub</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-100 font-bold">
              Save
            </span>
          </button>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => {
                onOpenChecklist();
                if (window.innerWidth < 1024) onClose();
              }}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 text-left flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ListChecks className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-bold truncate">Validation Checklist</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenCaseStudies();
                if (window.innerWidth < 1024) onClose();
              }}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-500 hover:text-purple-600 text-left flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span className="text-[11px] font-bold truncate">5 Case Studies</span>
            </button>
          </div>
        </div>

        {/* Quick Tools Grid */}
        <div className="p-2.5 grid grid-cols-4 gap-1.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 text-center flex flex-col items-center gap-1 transition-colors cursor-pointer"
            title="Search eBook"
          >
            <Search className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-semibold">Search</span>
          </button>

          <button
            type="button"
            onClick={onOpenAIMentor}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 text-center flex flex-col items-center gap-1 transition-colors cursor-pointer"
            title="AI Founder Mentor"
          >
            <Bot className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-semibold">AI Mentor</span>
          </button>

          <button
            type="button"
            onClick={onOpenNotes}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 text-center flex flex-col items-center gap-1 transition-colors cursor-pointer"
            title="Highlights & Notes"
          >
            <Bookmark className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-semibold">Notes</span>
          </button>

          <button
            type="button"
            onClick={onOpenAudio}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 text-center flex flex-col items-center gap-1 transition-colors cursor-pointer"
            title="Audio Narration"
          >
            <Volume2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-semibold">Listen</span>
          </button>
        </div>


        {/* Table of Contents List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 px-2">
            Table of Contents
          </h2>

          {chapters.map((ch) => {
            const isActive = ch.id === currentChapterId;
            const isCompleted = userStats.completedChapters.includes(ch.id);

            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  onSelectChapter(ch.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isActive
                    ? 'bg-slate-50 dark:bg-slate-800/90 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/40 font-semibold shadow-2xs'
                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className={`text-xs font-mono shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'opacity-40'}`}>
                    {String(ch.number).padStart(2, '0')}
                  </span>
                  <div className="overflow-hidden">
                    <div className="text-xs truncate">
                      {ch.title}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1">
                  {isCompleted && (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                    {ch.readTimeMinutes}m
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Next Up Card from Professional Polish layout */}
        {nextChapter ? (
          <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <div className="bg-blue-600 rounded-xl p-4 text-white shadow-lg shadow-blue-200/50 dark:shadow-none">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">
                Next Up
              </p>
              <p className="text-sm font-semibold mb-2 line-clamp-1">
                {nextChapter.title}
              </p>
              <button
                type="button"
                onClick={() => {
                  onSelectChapter(nextChapter.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                className="w-full py-2 bg-white/20 hover:bg-white/30 transition-colors rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Read Next Chapter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 text-center font-mono shrink-0">
            Founder Field Manual • 2026 Edition
          </div>
        )}
      </aside>
    </>
  );
};

