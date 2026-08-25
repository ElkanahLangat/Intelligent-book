import React from 'react';
import { Chapter, UserStats } from '../types';
import { BookOpen, CheckCircle, Clock, Award, Bookmark, Search, Bot, Volume2, X, ArrowRight } from 'lucide-react';

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
  onOpenAudio
}) => {
  const completedCount = userStats.completedChapters.length;
  const progressPercent = Math.round((completedCount / Math.max(1, chapters.length)) * 100);

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

        {/* Quick Tools Grid */}
        <div className="p-3 grid grid-cols-4 gap-1.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 text-center flex flex-col items-center gap-1 transition-colors cursor-pointer"
            title="Search eBook"
          >
            <Search className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-semibold">Search</span>
          </button>

          <button
            type="button"
            onClick={onOpenAIMentor}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 text-center flex flex-col items-center gap-1 transition-colors cursor-pointer"
            title="AI Founder Mentor"
          >
            <Bot className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-semibold">AI Mentor</span>
          </button>

          <button
            type="button"
            onClick={onOpenNotes}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 text-center flex flex-col items-center gap-1 transition-colors cursor-pointer"
            title="Highlights & Notes"
          >
            <Bookmark className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-semibold">Notes</span>
          </button>

          <button
            type="button"
            onClick={onOpenAudio}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 text-center flex flex-col items-center gap-1 transition-colors cursor-pointer"
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

