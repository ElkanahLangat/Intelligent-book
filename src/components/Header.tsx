import React, { useState } from 'react';
import { ReadingPreferences, ReadingTheme, FontFamily, FontSize } from '../types';
import { Menu, Search, Bot, Bookmark, Volume2, Type, Check, BookOpen } from 'lucide-react';

interface Props {
  chapterTitle: string;
  chapterNumber: number;
  totalChapters: number;
  completedChaptersCount: number;
  preferences: ReadingPreferences;
  onUpdatePreferences: (prefs: Partial<ReadingPreferences>) => void;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenNotes: () => void;
  onOpenAIMentor: () => void;
  onOpenAudio: () => void;
  notesCount: number;
}

export const Header: React.FC<Props> = ({
  chapterTitle,
  chapterNumber,
  totalChapters,
  completedChaptersCount,
  preferences,
  onUpdatePreferences,
  onToggleSidebar,
  onOpenSearch,
  onOpenNotes,
  onOpenAIMentor,
  onOpenAudio,
  notesCount
}) => {
  const [showTypographyMenu, setShowTypographyMenu] = useState<boolean>(false);

  const progressPercent = Math.round((completedChaptersCount / Math.max(1, totalChapters)) * 100);

  const themes: { id: ReadingTheme; label: string; icon: string; bg: string; text: string }[] = [
    { id: 'light', label: 'Paper', icon: '☀️', bg: 'bg-[#FDFDFD]', text: 'text-slate-900' },
    { id: 'sepia', label: 'Sepia', icon: '📜', bg: 'bg-[#f5efe6]', text: 'text-[#33271d]' },
    { id: 'dark', label: 'Slate', icon: '🌑', bg: 'bg-[#0b1120]', text: 'text-slate-100' },
    { id: 'midnight', label: 'OLED', icon: '🌌', bg: 'bg-[#000000]', text: 'text-slate-100' },
  ];

  const fonts: { id: FontFamily; label: string; sample: string }[] = [
    { id: 'serif', label: 'Editorial Serif', sample: 'Merriweather, Georgia' },
    { id: 'sans', label: 'Modern Sans', sample: 'Plus Jakarta, Inter' },
    { id: 'mono', label: 'Technical Mono', sample: 'JetBrains Mono' },
  ];

  const fontSizes: { id: FontSize; label: string }[] = [
    { id: 'sm', label: 'Small' },
    { id: 'base', label: 'Default' },
    { id: 'lg', label: 'Large' },
    { id: 'xl', label: 'Extra' },
  ];

  return (
    <header id="ebook-global-header" className="sticky top-0 z-30 w-full backdrop-blur-md border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Sidebar toggle + Book/Chapter Info */}
        <div className="flex items-center gap-3.5 overflow-hidden">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Table of Contents"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white shrink-0 shadow-xs shadow-blue-500/20">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                <span>Chapter {chapterNumber} of {totalChapters}</span>
              </div>
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                {chapterTitle}
              </h1>
            </div>
          </div>
        </div>

        {/* Center/Right: Reading Progress Bar */}
        <div className="hidden lg:flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Reading Progress</span>
            <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">{progressPercent}%</span>
          </div>
          <div className="w-40 xl:w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right Actions: Search, Audio, AI Mentor, Notes, Typography Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 border-l border-slate-200 dark:border-slate-800 pl-3 sm:pl-4">
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Search Book (Cmd/Ctrl + K)"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            type="button"
            onClick={onOpenAudio}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer hidden sm:flex items-center gap-1.5"
            title="Audio Narration"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden md:inline">Listen</span>
          </button>

          <button
            type="button"
            onClick={onOpenAIMentor}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-xs shadow-blue-500/20 cursor-pointer flex items-center gap-1.5"
            title="Ask AI Founder Mentor"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">AI Mentor</span>
          </button>

          <button
            type="button"
            onClick={onOpenNotes}
            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Highlights & Notes"
          >
            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
            {notesCount > 0 && (
              <span className="absolute 0 top-0 right-0 w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center shadow-xs">
                {notesCount}
              </span>
            )}
          </button>

          {/* Typography & Theme Popover Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTypographyMenu(!showTypographyMenu)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer flex items-center gap-1"
              title="Reading Preferences"
            >
              <Type className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {showTypographyMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowTypographyMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 text-xs space-y-4 font-sans">
                  {/* Theme Picker */}
                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Reading Palette</span>
                    <div className="grid grid-cols-4 gap-2">
                      {themes.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => onUpdatePreferences({ theme: t.id })}
                          className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                            preferences.theme === t.id
                              ? 'ring-2 ring-blue-500 border-blue-500 font-bold'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          } ${t.bg} ${t.text}`}
                        >
                          <span>{t.icon}</span>
                          <span className="text-[10px] font-semibold">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Family */}
                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Typography Face</span>
                    <div className="space-y-1.5">
                      {fonts.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => onUpdatePreferences({ fontFamily: f.id })}
                          className={`w-full text-left px-3 py-2 rounded-lg border flex items-center justify-between transition-colors ${
                            preferences.fontFamily === f.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-semibold'
                              : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div>
                            <div className="font-medium">{f.label}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{f.sample}</div>
                          </div>
                          {preferences.fontFamily === f.id && <Check className="w-4 h-4 text-blue-600" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Text Scale</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {fontSizes.map((fs) => (
                        <button
                          key={fs.id}
                          type="button"
                          onClick={() => onUpdatePreferences({ fontSize: fs.id })}
                          className={`py-1.5 rounded-lg border text-center font-medium transition-all ${
                            preferences.fontSize === fs.id
                              ? 'bg-blue-600 text-white font-bold border-blue-600'
                              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {fs.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content Width */}
                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Reading Margin</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['narrow', 'medium', 'wide'] as const).map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => onUpdatePreferences({ contentWidth: w })}
                          className={`py-1.5 rounded-lg border text-center capitalize font-medium transition-all ${
                            preferences.contentWidth === w
                              ? 'bg-blue-600 text-white font-bold border-blue-600'
                              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

