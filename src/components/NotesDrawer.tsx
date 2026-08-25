import React, { useState } from 'react';
import { HighlightItem, Chapter } from '../types';
import { Bookmark, Highlighter, Trash2, Download, Copy, Check, X, FileText, Sparkles, Filter } from 'lucide-react';

interface Props {
  highlights: HighlightItem[];
  chapters: Chapter[];
  isOpen: boolean;
  onClose: () => void;
  onDeleteHighlight: (id: string) => void;
  onJumpToHighlight: (chapterId: string, paragraphIndex: number) => void;
}

export const NotesDrawer: React.FC<Props> = ({
  highlights,
  chapters,
  isOpen,
  onClose,
  onDeleteHighlight,
  onJumpToHighlight
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const filteredHighlights = selectedColor
    ? highlights.filter(h => h.color === selectedColor)
    : highlights;

  const getChapterTitle = (chapterId: string) => {
    const ch = chapters.find(c => c.id === chapterId);
    return ch ? ch.title : chapterId;
  };

  const exportAsMarkdown = () => {
    let md = `# Startup Lessons: My Founder Field Notes & Highlights\n`;
    md += `Exported on ${new Date().toLocaleDateString()}\n\n`;

    const grouped: Record<string, HighlightItem[]> = {};
    highlights.forEach(h => {
      if (!grouped[h.chapterId]) grouped[h.chapterId] = [];
      grouped[h.chapterId].push(h);
    });

    Object.keys(grouped).forEach(chId => {
      md += `## ${getChapterTitle(chId)}\n\n`;
      grouped[chId].forEach(h => {
        md += `> "${h.text}"\n`;
        if (h.note) {
          md += `\n*Founder Reflection:* ${h.note}\n`;
        }
        md += `\n`;
      });
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `startup-lessons-field-notes-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyAllToClipboard = () => {
    let text = `Startup Lessons: Founder Field Notes\n\n`;
    highlights.forEach(h => {
      text += `[${getChapterTitle(h.chapterId)}]\n"${h.text}"\n`;
      if (h.note) text += `Note: ${h.note}\n`;
      text += `\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colorBadgeClass: Record<string, string> = {
    yellow: 'bg-amber-50 dark:bg-amber-950/40 text-slate-800 dark:text-slate-200 border-amber-300 dark:border-amber-700/60',
    green: 'bg-emerald-50 dark:bg-emerald-950/40 text-slate-800 dark:text-slate-200 border-emerald-300 dark:border-emerald-700/60',
    blue: 'bg-blue-50 dark:bg-blue-950/40 text-slate-800 dark:text-slate-200 border-blue-300 dark:border-blue-700/60',
    purple: 'bg-purple-50 dark:bg-purple-950/40 text-slate-800 dark:text-slate-200 border-purple-300 dark:border-purple-700/60',
    amber: 'bg-orange-50 dark:bg-orange-950/40 text-slate-800 dark:text-slate-200 border-orange-300 dark:border-orange-700/60'
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs font-sans">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm font-serif">Highlights & Notes</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{highlights.length} saved insights</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action toolbar & color filter */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] mr-1">Filter:</span>
            {['yellow', 'green', 'blue', 'purple'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedColor(selectedColor === c ? null : c)}
                className={`w-4 h-4 rounded-full border cursor-pointer ${
                  c === 'yellow' ? 'bg-amber-400 border-amber-500' : c === 'green' ? 'bg-emerald-500 border-emerald-600' : c === 'blue' ? 'bg-blue-500 border-blue-600' : 'bg-purple-500 border-purple-600'
                } ${selectedColor === c ? 'ring-2 ring-slate-900 dark:ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
              />
            ))}
            {selectedColor && (
              <button
                type="button"
                onClick={() => setSelectedColor(null)}
                className="text-[11px] text-slate-500 hover:underline ml-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {highlights.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyAllToClipboard}
                className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={exportAsMarkdown}
                className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-semibold text-[11px] flex items-center gap-1 shadow-xs hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Export .md</span>
              </button>
            </div>
          )}
        </div>

        {/* Highlights List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3 divide-y divide-slate-100 dark:divide-slate-800/40">
          {filteredHighlights.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
              <p className="font-medium text-slate-600 dark:text-slate-300">No highlights saved yet</p>
              <p className="mt-1 text-[11px] max-w-xs mx-auto text-slate-500">
                Select any text or click the highlight icon on any paragraph while reading to save quotes and add founder reflections.
              </p>
            </div>
          ) : (
            filteredHighlights.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 group">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                  <span className="font-semibold text-blue-600 dark:text-blue-400 truncate max-w-[220px]">
                    {getChapterTitle(item.chapterId)}
                  </span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>

                <div
                  onClick={() => {
                    onJumpToHighlight(item.chapterId, item.paragraphIndex);
                    onClose();
                  }}
                  className={`p-3 rounded-lg border text-xs leading-relaxed cursor-pointer transition-all hover:shadow-xs ${
                    colorBadgeClass[item.color] || colorBadgeClass.yellow
                  }`}
                >
                  <p className="italic font-serif">"{item.text}"</p>

                  {item.note && (
                    <div className="mt-2 pt-2 border-t border-slate-300/40 dark:border-slate-700/40 text-[11px] font-sans not-italic font-medium text-slate-700 dark:text-slate-300">
                      <span className="opacity-75">Note: </span>
                      {item.note}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => onDeleteHighlight(item.id)}
                    className="text-[11px] text-rose-500 hover:text-rose-700 p-1 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

