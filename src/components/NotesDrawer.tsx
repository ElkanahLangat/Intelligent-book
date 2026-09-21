import React, { useState } from 'react';
import { HighlightItem, Chapter } from '../types';
import { Bookmark, Trash2, Download, Copy, Check, X, FileText, Plus, Tag, Sparkles, Mic, Square } from 'lucide-react';
import { useVoiceRecorder } from '../utils/useVoiceRecorder';

interface Props {
  highlights: HighlightItem[];
  chapters: Chapter[];
  isOpen: boolean;
  onClose: () => void;
  onDeleteHighlight: (id: string) => void;
  onJumpToHighlight: (chapterId: string, paragraphIndex: number) => void;
  onAddNote?: (item: Omit<HighlightItem, 'id' | 'createdAt'>) => void;
  currentChapterId?: string;
}

export const NotesDrawer: React.FC<Props> = ({
  highlights,
  chapters,
  isOpen,
  onClose,
  onDeleteHighlight,
  onJumpToHighlight,
  onAddNote,
  currentChapterId
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyAllStatus, setCopyAllStatus] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // New Note State
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [newNoteCategory, setNewNoteCategory] = useState<string>('Startup');
  const [newNoteColor, setNewNoteColor] = useState<'yellow' | 'green' | 'blue' | 'purple'>('green');

  // Audio voice transcription hook for notes
  const {
    isRecording,
    isTranscribing,
    duration,
    error: voiceError,
    startRecording,
    stopRecording
  } = useVoiceRecorder((transcribedText) => {
    if (transcribedText) {
      setNewNoteText(prev => prev ? `${prev} ${transcribedText}` : transcribedText);
    }
  });

  if (!isOpen) return null;

  const filteredHighlights = selectedColor
    ? highlights.filter(h => h.color === selectedColor)
    : highlights;

  const getChapterTitle = (chapterId: string) => {
    const ch = chapters.find(c => c.id === chapterId);
    return ch ? ch.title : chapterId;
  };

  const handleSaveCustomNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !onAddNote) return;

    onAddNote({
      chapterId: currentChapterId || chapters[0].id,
      paragraphIndex: 0,
      text: `[${newNoteCategory}] ${newNoteText.trim()}`,
      color: newNoteColor === 'yellow' ? 'yellow' : newNoteColor === 'green' ? 'green' : newNoteColor === 'blue' ? 'blue' : 'purple',
      note: undefined
    });

    setNewNoteText('');
    setShowAddForm(false);
  };

  const copySingleNote = (id: string, text: string, note?: string) => {
    const fullText = note ? `"${text}"\nReflection: ${note}` : text;
    navigator.clipboard.writeText(fullText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAllToClipboard = () => {
    if (highlights.length === 0) return;
    let text = `# Founder Notebook: Field Notes, Habits & Wealth Psychology\n\n`;
    highlights.forEach(h => {
      text += `[${getChapterTitle(h.chapterId)}]\n"${h.text}"\n`;
      if (h.note) text += `Reflection: ${h.note}\n`;
      text += `\n`;
    });
    navigator.clipboard.writeText(text);
    setCopyAllStatus(true);
    setTimeout(() => setCopyAllStatus(false), 2000);
  };

  const exportAsMarkdown = () => {
    if (highlights.length === 0) return;
    let md = `# Founder Notebook: Field Notes, Habits & Wealth Psychology\n`;
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
          md += `\n*Reflection:* ${h.note}\n`;
        }
        md += `\n`;
      });
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `founder-field-notes-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Vivid Green, Yellow, Blue, and Purple card styling with high contrast readability
  const colorBadgeClass: Record<string, string> = {
    yellow: 'bg-amber-950/40 text-amber-100 border-l-4 border-amber-400 border-amber-500/30 shadow-md',
    green: 'bg-emerald-950/40 text-emerald-100 border-l-4 border-emerald-400 border-emerald-500/30 shadow-md',
    blue: 'bg-blue-950/40 text-blue-100 border-l-4 border-blue-400 border-blue-500/30 shadow-md',
    purple: 'bg-purple-950/40 text-purple-100 border-l-4 border-purple-400 border-purple-500/30 shadow-md',
    amber: 'bg-amber-950/40 text-amber-100 border-l-4 border-amber-400 border-amber-500/30 shadow-md'
  };

  const categories = ['Startup', 'Habit', 'Psychology of Wealth', 'Money', 'Managing Things'];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs font-sans">
      <div className="w-full max-w-lg bg-[#090d16] text-slate-100 border-l border-slate-800 h-full shadow-2xl flex flex-col">
        {/* Header - Deep Blue & Black Aesthetic */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#070d1e]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-900/40">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Founder Notebook & Field Notes</h3>
              <p className="text-xs text-slate-400">
                {highlights.length} records • Startups, habits, wealth psychology & management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onAddNote && (
              <button
                type="button"
                onClick={() => setShowAddForm(prev => !prev)}
                className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Record new insight or note"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Record</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Add Note Form (Record Data with Green & Yellow colors) */}
        {showAddForm && onAddNote && (
          <form onSubmit={handleSaveCustomNote} className="p-4 bg-[#0b132b] border-b border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Record Data & Notebook Entry
              </span>
              
              {/* Color Selector: Highlight colorful Green & Yellow */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 mr-1">Color:</span>
                {(['green', 'yellow', 'blue', 'purple'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewNoteColor(c)}
                    className={`w-5 h-5 rounded-full border cursor-pointer transition-transform ${
                      c === 'green' ? 'bg-emerald-500 border-emerald-400' :
                      c === 'yellow' ? 'bg-amber-400 border-amber-300' :
                      c === 'blue' ? 'bg-blue-500 border-blue-400' : 'bg-purple-500 border-purple-400'
                    } ${newNoteColor === c ? 'ring-2 ring-white scale-110' : 'opacity-70'}`}
                  />
                ))}
              </div>
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setNewNoteCategory(cat)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors cursor-pointer ${
                    newNoteCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative">
              <textarea
                rows={3}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Record your observation, habit commitment, money rule, or tap mic to speak..."
                className="w-full p-2.5 pr-9 rounded-lg bg-[#070d1e] text-slate-100 border border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                autoFocus
              />
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isTranscribing}
                className={`absolute right-2 bottom-3 p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={isRecording ? 'Stop voice recording' : 'Dictate note with microphone (Audio Transcription)'}
              >
                {isRecording ? <Square className="w-3.5 h-3.5 fill-current" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
            </div>

            {(isRecording || isTranscribing) && (
              <div className="px-2 py-1 bg-red-950/60 rounded border border-red-800/80 text-[10px] text-red-200 flex items-center justify-between animate-pulse">
                <span>{isRecording ? `Recording voice memo (${duration}s)...` : 'Transcribing voice note with Gemini...'}</span>
                {isRecording && (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="font-bold underline text-red-100 cursor-pointer"
                  >
                    Done
                  </button>
                )}
              </div>
            )}

            {voiceError && (
              <div className="text-[10px] text-amber-400 px-1">
                {voiceError}
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Mic className="w-3 h-3 text-blue-400" /> Voice notes supported
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1 rounded text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
                >
                  Save Record
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Action Toolbar & Color Filters */}
        <div className="p-3 border-b border-slate-800 flex items-center justify-between gap-2 bg-[#070d1e]/80 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] mr-1">Filter:</span>
            {['green', 'yellow', 'blue', 'purple'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedColor(selectedColor === c ? null : c)}
                className={`w-4 h-4 rounded-full border cursor-pointer ${
                  c === 'green' ? 'bg-emerald-500 border-emerald-400' :
                  c === 'yellow' ? 'bg-amber-400 border-amber-300' :
                  c === 'blue' ? 'bg-blue-500 border-blue-400' : 'bg-purple-500 border-purple-400'
                } ${selectedColor === c ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                title={`Filter by ${c}`}
              />
            ))}
            {selectedColor && (
              <button
                type="button"
                onClick={() => setSelectedColor(null)}
                className="text-[11px] text-blue-400 hover:underline ml-1 cursor-pointer"
              >
                All
              </button>
            )}
          </div>

          {highlights.length > 0 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={copyAllToClipboard}
                className="px-2.5 py-1 rounded-md border border-slate-700 hover:bg-slate-800 text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                title="Copy all notes to clipboard seamlessly"
              >
                {copyAllStatus ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copyAllStatus ? 'Copied All!' : 'Copy All'}</span>
              </button>
              <button
                type="button"
                onClick={exportAsMarkdown}
                className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                title="Export as Markdown File"
              >
                <Download className="w-3 h-3" />
                <span>Export .md</span>
              </button>
            </div>
          )}
        </div>

        {/* Highlights & Records List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {filteredHighlights.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-blue-400" />
              <p className="font-semibold text-slate-200">No notes recorded yet</p>
              <p className="mt-1.5 text-[11px] max-w-xs mx-auto text-slate-400 leading-relaxed">
                Click <span className="text-blue-400 font-semibold">"Record"</span> above to jot down habits, money rules, or startup insights, or highlight any text in the chapters.
              </p>
            </div>
          ) : (
            filteredHighlights.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  colorBadgeClass[item.color] || colorBadgeClass.green
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                  <span className="font-bold text-blue-600 dark:text-blue-300 truncate max-w-[240px]">
                    {getChapterTitle(item.chapterId)}
                  </span>
                  <span className="text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div
                  onClick={() => {
                    onJumpToHighlight(item.chapterId, item.paragraphIndex);
                    onClose();
                  }}
                  className="cursor-pointer"
                >
                  <p className="text-xs sm:text-sm font-serif leading-relaxed whitespace-pre-wrap">
                    {item.text}
                  </p>

                  {item.note && (
                    <div className="mt-2.5 pt-2 border-t border-slate-300/60 dark:border-slate-700/60 text-[11px] font-sans font-medium text-slate-700 dark:text-slate-200">
                      <span className="opacity-75 font-bold">Reflection: </span>
                      {item.note}
                    </div>
                  )}
                </div>

                {/* Seamless Actions on each note */}
                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px]">
                  <button
                    type="button"
                    onClick={() => copySingleNote(item.id, item.text, item.note)}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                    title="Copy this note"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Note</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteHighlight(item.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Delete record"
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
