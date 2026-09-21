import React, { useState } from 'react';
import { DetailedCaseStudy } from '../types';
import {
  Briefcase,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Quote,
  UploadCloud,
  X,
  Building2,
  CheckCircle2,
  Filter
} from 'lucide-react';

interface CaseStudiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseStudies: DetailedCaseStudy[];
  onExportToDrive: () => void;
}

export const CaseStudiesModal: React.FC<CaseStudiesModalProps> = ({
  isOpen,
  onClose,
  caseStudies,
  onExportToDrive
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeCaseId, setActiveCaseId] = useState<string>(caseStudies[0]?.id || 'case-airbnb');

  if (!isOpen) return null;

  const categories = [
    'All',
    'Market Fit',
    'Funding',
    'Team & Pivot',
    'Premature Scaling',
    'Smoke Testing'
  ];

  const filteredCaseStudies =
    selectedCategory === 'All'
      ? caseStudies
      : caseStudies.filter((cs) => cs.category === selectedCategory);

  const activeCase =
    caseStudies.find((cs) => cs.id === activeCaseId) || caseStudies[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  Startup Case Studies Dossier
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  5 Iconic Teardowns
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Key lessons on Funding, Market Fit, Team Building, and Scaling from Airbnb, Slack, Dropbox, Segment & Quibi.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExportToDrive}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save to Google Drive</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Pills & Subnav */}
        <div className="p-3 bg-slate-50/80 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                const matching =
                  cat === 'All'
                    ? caseStudies
                    : caseStudies.filter((cs) => cs.category === cat);
                if (matching.length > 0) setActiveCaseId(matching[0].id);
              }}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Grid: Left List + Right Deep Dive */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
          {/* Left Column: Case Study Cards List */}
          <div className="md:col-span-4 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-3 space-y-2 bg-slate-50/30 dark:bg-slate-950/20">
            {filteredCaseStudies.map((cs) => {
              const isActive = cs.id === activeCase.id;
              return (
                <div
                  key={cs.id}
                  onClick={() => setActiveCaseId(cs.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'border-purple-500 bg-purple-50/40 dark:bg-purple-950/30 ring-1 ring-purple-500 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {cs.category}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                        cs.outcome === 'Success'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : cs.outcome === 'Pivot'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}
                    >
                      {cs.outcome}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-0.5 truncate">
                    {cs.company}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug">
                    {cs.tagline}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Case Deep Dive */}
          <div className="md:col-span-8 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Header Banner */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                  {activeCase.category} Challenge
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Founders: <strong className="text-slate-700 dark:text-slate-300">{activeCase.founders}</strong>
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                {activeCase.company}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                {activeCase.tagline}
              </p>
            </div>

            {/* Metrics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              {activeCase.metrics.map((m, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    {m.label}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            {/* The Challenge Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>The Core Challenge</span>
              </div>
              <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/15 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeCase.theChallenge}
              </div>
            </div>

            {/* The Turning Point Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>The Strategic Turning Point</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeCase.theTurningPoint}
              </div>
            </div>

            {/* Key Founder Lessons */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>Key Lessons & Principles for Founders</span>
              </div>
              <div className="space-y-2">
                {activeCase.keyLessons.map((lesson, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {lesson}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Founder Quote */}
            <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/20 space-y-2">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Quote className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Founder's Perspective</span>
              </div>
              <blockquote className="text-xs italic text-slate-800 dark:text-slate-200 leading-relaxed font-serif">
                "{activeCase.founderQuote.quote}"
              </blockquote>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                — <strong className="text-slate-700 dark:text-slate-300">{activeCase.founderQuote.author}</strong>, {activeCase.founderQuote.context}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Case studies curated from verified YC and founder post-mortems.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
