import React, { useState, useMemo } from 'react';
import { Chapter } from '../types';
import { Search, X, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  chapters: Chapter[];
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (chapterId: string, paragraphIndex?: number) => void;
}

interface SearchResult {
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  sectionTitle: string;
  snippet: string;
  matchType: 'paragraph' | 'keyTakeaway' | 'warStory' | 'pullQuote';
}

export const SearchModal: React.FC<Props> = ({
  chapters,
  isOpen,
  onClose,
  onSelectResult
}) => {
  const [query, setQuery] = useState<string>('');

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];

    const q = query.toLowerCase();
    const hits: SearchResult[] = [];

    chapters.forEach(ch => {
      ch.sections.forEach(sec => {
        // Search paragraphs
        sec.paragraphs.forEach((p) => {
          if (p.toLowerCase().includes(q)) {
            hits.push({
              chapterId: ch.id,
              chapterNumber: ch.number,
              chapterTitle: ch.title,
              sectionTitle: sec.title,
              snippet: p,
              matchType: 'paragraph'
            });
          }
        });

        // Search Key takeaways
        sec.keyTakeaways?.forEach(kt => {
          if (kt.toLowerCase().includes(q)) {
            hits.push({
              chapterId: ch.id,
              chapterNumber: ch.number,
              chapterTitle: ch.title,
              sectionTitle: sec.title,
              snippet: kt,
              matchType: 'keyTakeaway'
            });
          }
        });

        // Search War stories
        if (sec.warStory) {
          const ws = sec.warStory;
          if (
            ws.company.toLowerCase().includes(q) ||
            ws.headline.toLowerCase().includes(q) ||
            ws.lesson.toLowerCase().includes(q)
          ) {
            hits.push({
              chapterId: ch.id,
              chapterNumber: ch.number,
              chapterTitle: ch.title,
              sectionTitle: `War Story: ${ws.company}`,
              snippet: `${ws.headline} — ${ws.lesson}`,
              matchType: 'warStory'
            });
          }
        }

        // Search Pull quotes
        if (sec.pullQuote && (sec.pullQuote.text.toLowerCase().includes(q) || sec.pullQuote.author.toLowerCase().includes(q))) {
          hits.push({
            chapterId: ch.id,
            chapterNumber: ch.number,
            chapterTitle: ch.title,
            sectionTitle: `Quote by ${sec.pullQuote.author}`,
            snippet: sec.pullQuote.text,
            matchType: 'pullQuote'
          });
        }
      });
    });

    return hits.slice(0, 20); // Limit to top 20
  }, [chapters, query]);

  if (!isOpen) return null;

  const highlightMatch = (text: string, search: string) => {
    if (!search.trim()) return text;
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} className="bg-blue-100 dark:bg-blue-900/60 text-blue-950 dark:text-blue-200 rounded-xs px-0.5 font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/60 backdrop-blur-xs font-sans">
      <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-900/80">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all chapters, war stories, frameworks, and metrics..."
            className="w-full text-sm sm:text-base bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 text-xs font-mono bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 sm:p-4 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          {query.trim().length >= 2 && results.length === 0 && (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              No results found for "<span className="font-semibold text-slate-700 dark:text-slate-300">{query}</span>".
              <p className="mt-1 text-slate-400 dark:text-slate-500">Try searching for keywords like "retention", "pricing", "vesting", "runway", or "Mom Test".</p>
            </div>
          )}

          {query.trim().length < 2 && (
            <div className="py-8 px-4 text-center text-slate-500 dark:text-slate-400 text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold mb-3 border border-blue-200/60 dark:border-blue-800/60">
                <Sparkles className="w-3.5 h-3.5" />
                Popular Founder Searches
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
                {['Sean Ellis 40%', 'Default Alive', 'The Mom Test', '4-Year Vesting', 'LTV CAC 3x', 'Superhuman PMF'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.map((r, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onSelectResult(r.chapterId);
                onClose();
              }}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all group flex items-start justify-between gap-4 cursor-pointer"
            >
              <div className="space-y-1 overflow-hidden">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  <span className="truncate">{r.chapterTitle}</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-slate-500 dark:text-slate-400 truncate">{r.sectionTitle}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {highlightMatch(r.snippet, query)}
                </p>
              </div>

              <div className="shrink-0 pt-1 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

