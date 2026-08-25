import React, { useState } from 'react';
import { Chapter, ReadingPreferences, HighlightItem } from '../types';
import { InteractiveFrameworks } from './InteractiveFrameworks';
import { ChapterQuiz } from './ChapterQuiz';
import { 
  Quote, 
  CheckCircle2, 
  Circle, 
  Highlighter, 
  ArrowLeft, 
  ArrowRight, 
  Award, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ListChecks, 
  Flame,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  chapter: Chapter;
  previousChapter: Chapter | null;
  nextChapter: Chapter | null;
  onNavigateChapter: (chapterId: string) => void;
  preferences: ReadingPreferences;
  highlights: HighlightItem[];
  onAddHighlight: (highlight: Omit<HighlightItem, 'id' | 'createdAt'>) => void;
  isCompleted: boolean;
  onToggleComplete: (chapterId: string) => void;
  onOpenAIMentor: () => void;
  currentAudioParagraphIndex: number;
}

export const Reader: React.FC<Props> = ({
  chapter,
  previousChapter,
  nextChapter,
  onNavigateChapter,
  preferences,
  highlights,
  onAddHighlight,
  isCompleted,
  onToggleComplete,
  onOpenAIMentor,
  currentAudioParagraphIndex
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [highlightingParagraph, setHighlightingParagraph] = useState<number | null>(null);
  const [highlightColor, setHighlightColor] = useState<'yellow' | 'green' | 'blue' | 'purple' | 'amber'>('blue');
  const [customNote, setCustomNote] = useState<string>('');

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleMarkCompleted = () => {
    onToggleComplete(chapter.id);
    if (!isCompleted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Content width classes
  const widthClasses: Record<string, string> = {
    narrow: 'max-w-xl',
    medium: 'max-w-2xl',
    wide: 'max-w-3xl'
  };

  // Font family classes
  const fontClasses: Record<string, string> = {
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono'
  };

  // Font size classes
  const fontSizeClasses: Record<string, string> = {
    sm: 'text-sm sm:text-base leading-relaxed',
    base: 'text-base sm:text-lg leading-relaxed sm:leading-loose',
    lg: 'text-lg sm:text-xl leading-relaxed sm:leading-loose',
    xl: 'text-xl sm:text-2xl leading-loose'
  };

  const saveHighlight = (paragraphIndex: number, text: string) => {
    onAddHighlight({
      chapterId: chapter.id,
      paragraphIndex,
      text,
      color: highlightColor,
      note: customNote.trim() || undefined
    });
    setHighlightingParagraph(null);
    setCustomNote('');
  };

  const chapterHighlights = highlights.filter(h => h.chapterId === chapter.id);

  return (
    <article id={`reader-chapter-${chapter.id}`} className={`mx-auto ${widthClasses[preferences.contentWidth]} py-8 sm:py-12 px-4 sm:px-6 transition-all font-sans`}>
      {/* Chapter Title & Header */}
      <header className="mb-10 pb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            {chapter.category} • Chapter {chapter.number}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto font-mono">
            <Clock className="w-3.5 h-3.5" />
            {chapter.readTimeMinutes} min read
          </span>
          {isCompleted && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 ml-2">
              <CheckCircle2 className="w-4 h-4" /> Completed
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-serif leading-tight">
          {chapter.title}
        </h1>
        <div className="h-1 w-12 bg-blue-500 mt-4 rounded-full" />
        
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-serif italic mt-3 mb-6">
          {chapter.subtitle}
        </p>

        {/* Intro Quote Box */}
        {chapter.introQuote && (
          <div className="border-l-4 border-blue-500 pl-5 sm:pl-6 py-3 my-6 font-serif italic text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed bg-blue-50/40 dark:bg-blue-950/20 rounded-r-lg">
            <p>
              "{chapter.introQuote.quote}"
            </p>
            <div className="text-xs font-sans not-italic font-semibold text-blue-700 dark:text-blue-300 mt-2">
              — {chapter.introQuote.author}
            </div>
          </div>
        )}
      </header>

      {/* Chapter Sections */}
      <div className={`space-y-12 ${fontClasses[preferences.fontFamily]}`}>
        {chapter.sections.map((section, sIdx) => (
          <section key={section.id} id={section.id} className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif border-b border-slate-200/80 dark:border-slate-800 pb-2">
              {section.title}
            </h2>

            {/* Paragraphs with Highlight Actions */}
            <div className={`space-y-5 text-slate-800 dark:text-slate-200 ${fontSizeClasses[preferences.fontSize]}`}>
              {section.paragraphs.map((para, pIdx) => {
                const globalIndex = sIdx * 10 + pIdx;
                const isCurrentAudio = currentAudioParagraphIndex === globalIndex;
                const existingHighlight = chapterHighlights.find(h => h.paragraphIndex === globalIndex);

                return (
                  <div
                    key={pIdx}
                    className={`relative group transition-all duration-200 p-2 sm:p-2.5 -mx-2 sm:-mx-2.5 rounded-lg ${
                      isCurrentAudio 
                        ? 'bg-blue-100/70 dark:bg-blue-950/60 ring-2 ring-blue-500' 
                        : existingHighlight 
                        ? 'bg-blue-50/60 dark:bg-blue-950/30 border-l-2 border-blue-500' 
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <p className="leading-relaxed">
                      {para}
                    </p>

                    {/* Quick Highlight / Note Trigger on Hover */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 rounded-lg p-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setHighlightingParagraph(highlightingParagraph === globalIndex ? null : globalIndex)}
                        className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                        title="Highlight & Add Founder Note"
                      >
                        <Highlighter className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Highlight Popover Drawer */}
                    {highlightingParagraph === globalIndex && (
                      <div className="mt-3 p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl text-xs space-y-2.5 font-sans">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Save Insight to Field Notes</span>
                          <div className="flex items-center gap-1.5">
                            {(['blue', 'green', 'amber', 'purple'] as const).map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => setHighlightColor(c)}
                                className={`w-4 h-4 rounded-full border ${
                                  c === 'blue' ? 'bg-blue-500' : c === 'green' ? 'bg-emerald-500' : c === 'amber' ? 'bg-amber-400' : 'bg-purple-500'
                                } ${highlightColor === c ? 'ring-2 ring-slate-900 dark:ring-white scale-110' : 'opacity-70'}`}
                              />
                            ))}
                          </div>
                        </div>

                        <input
                          type="text"
                          value={customNote}
                          onChange={(e) => setCustomNote(e.target.value)}
                          placeholder="Add your founder reflection or experiment idea (optional)..."
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setHighlightingParagraph(null)}
                            className="px-2.5 py-1 rounded text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => saveHighlight(globalIndex, para)}
                            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* War Story Box */}
            {section.warStory && (
              <div className="my-8 p-5 sm:p-6 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 shadow-md font-sans">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-blue-400 tracking-wider uppercase flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-blue-400" />
                    Case Study: {section.warStory.company}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    section.warStory.outcome === 'Success'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : section.warStory.outcome === 'Pivot'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {section.warStory.outcome}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold mb-2 font-serif text-white">
                  {section.warStory.headline}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {section.warStory.lesson}
                </p>

                {section.warStory.quote && (
                  <div className="pt-3 border-t border-slate-800 text-xs italic font-serif text-blue-200">
                    "{section.warStory.quote}"
                    {section.warStory.founder && (
                      <span className="block text-[11px] not-italic font-sans text-slate-400 mt-1">
                        — {section.warStory.founder}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Pull Quote */}
            {section.pullQuote && (
              <figure className="my-8 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center">
                <Quote className="w-8 h-8 mx-auto text-blue-500/40 mb-3" />
                <blockquote className="font-serif italic text-lg sm:text-xl text-slate-900 dark:text-slate-100 leading-snug mb-3">
                  "{section.pullQuote.text}"
                </blockquote>
                <figcaption className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 font-sans">
                  {section.pullQuote.author}
                  {section.pullQuote.role && (
                    <span className="block text-xs font-normal text-slate-400 dark:text-slate-500">
                      {section.pullQuote.role}
                    </span>
                  )}
                </figcaption>
              </figure>
            )}

            {/* Embedded Framework Tool */}
            {section.framework && (
              <InteractiveFrameworks framework={section.framework} />
            )}

            {/* Key Takeaways Box with Professional Polish */}
            {section.keyTakeaways && (
              <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 font-sans">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3 uppercase tracking-wider text-xs">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Key Chapter Insights
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {section.keyTakeaways.map((takeaway, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Interactive Checklist */}
            {section.checklist && (
              <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-sans">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3 uppercase tracking-wider text-xs">
                  <ListChecks className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Founder Execution Checklist
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  {section.checklist.map((item, cIdx) => {
                    const itemId = `${section.id}-check-${cIdx}`;
                    const isChecked = !!checkedItems[itemId];

                    return (
                      <div
                        key={cIdx}
                        onClick={() => toggleCheck(itemId)}
                        className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                      >
                        <button type="button" className="mt-0.5 shrink-0 text-blue-600">
                          {isChecked ? <CheckCircle2 className="w-4 h-4 fill-blue-600 text-white" /> : <Circle className="w-4 h-4 text-slate-400" />}
                        </button>
                        <span className={`${isChecked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Chapter Action Plan */}
      {chapter.actionPlan && chapter.actionPlan.length > 0 && (
        <div className="my-10 p-6 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/20 font-sans">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Tactical 7-Day Action Plan
            </h3>
            <button
              type="button"
              onClick={onOpenAIMentor}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Tailor with AI
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Execute these 3 concrete steps before opening the next chapter:
          </p>
          <div className="space-y-2.5">
            {chapter.actionPlan.map((action, aIdx) => (
              <div key={aIdx} className="flex items-start gap-3 p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  {aIdx + 1}
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {action}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diagnostic Quiz at End of Chapter */}
      {chapter.quiz && chapter.quiz.length > 0 && (
        <ChapterQuiz
          chapterId={chapter.id}
          chapterTitle={chapter.title}
          questions={chapter.quiz}
        />
      )}

      {/* Chapter Completion Button */}
      <div className="my-10 p-6 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center space-y-3 font-sans">
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Finished reading {chapter.title}? Mark it complete to update your field progress.
        </p>
        <button
          type="button"
          onClick={handleMarkCompleted}
          className={`px-6 py-2.5 rounded-lg font-bold text-xs sm:text-sm inline-flex items-center gap-2 transition-all cursor-pointer ${
            isCompleted
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-500/20'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{isCompleted ? '✓ Chapter Completed' : 'Mark Chapter as Finished'}</span>
        </button>
      </div>

      {/* Bottom Chapter Navigation Bar from Professional Polish */}
      <nav className="h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sm:px-8 mt-12 rounded-xl border font-sans">
        {previousChapter ? (
          <button
            type="button"
            onClick={() => onNavigateChapter(previousChapter.id)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Previous Chapter</span>
            <span className="sm:hidden">Prev</span>
          </button>
        ) : (
          <div className="w-20" />
        )}

        <div className="text-center">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest block">
            Chapter {chapter.number}
          </span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px] sm:max-w-[240px] block">
            {chapter.title}
          </span>
        </div>

        {nextChapter ? (
          <button
            type="button"
            onClick={() => onNavigateChapter(nextChapter.id)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors cursor-pointer group"
          >
            <span className="hidden sm:inline">Next Chapter</span>
            <span className="sm:hidden">Next</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <div className="text-right text-xs font-semibold text-emerald-600">
            🎉 Complete
          </div>
        )}
      </nav>
    </article>
  );
};

