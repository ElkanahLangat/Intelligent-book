import React, { useState } from 'react';
import { ReadingPreferences, ReadingTheme, FontFamily, FontSize, UserStats } from '../types';
import { User as FirebaseUser } from 'firebase/auth';
import {
  Menu,
  Search,
  Bot,
  Bookmark,
  Volume2,
  Type,
  Check,
  BookOpen,
  HardDrive,
  ListChecks,
  Briefcase,
  Flame,
  Target,
  TrendingUp,
  Sparkles,
  LogIn,
  LogOut,
  ShieldCheck,
  CloudCheck
} from 'lucide-react';

interface Props {
  chapterTitle: string;
  chapterNumber: number;
  totalChapters: number;
  completedChaptersCount: number;
  userStats: UserStats;
  preferences: ReadingPreferences;
  onUpdatePreferences: (prefs: Partial<ReadingPreferences>) => void;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenNotes: () => void;
  onOpenAIMentor: () => void;
  onOpenAudio: () => void;
  onOpenDrive: () => void;
  onOpenChecklist: () => void;
  onOpenCaseStudies: () => void;
  onOpenStats: () => void;
  notesCount: number;
  currentUser?: FirebaseUser | null;
  onSignInWithGoogle?: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<Props> = ({
  chapterTitle,
  chapterNumber,
  totalChapters,
  completedChaptersCount,
  userStats,
  preferences,
  onUpdatePreferences,
  onToggleSidebar,
  onOpenSearch,
  onOpenNotes,
  onOpenAIMentor,
  onOpenAudio,
  onOpenDrive,
  onOpenChecklist,
  onOpenCaseStudies,
  onOpenStats,
  notesCount,
  currentUser,
  onSignInWithGoogle,
  onSignOut
}) => {
  const [showTypographyMenu, setShowTypographyMenu] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  const progressPercent = Math.round((completedChaptersCount / Math.max(1, totalChapters)) * 100);

  const dailyGoalMinutes = userStats.dailyReadingGoalMinutes || 15;
  const todayMinutes = (userStats.todayReadingSeconds || 0) / 60;
  const goalPercent = Math.min(100, Math.round((todayMinutes / dailyGoalMinutes) * 100));
  const isGoalMet = todayMinutes >= dailyGoalMinutes;

  const themes: { id: ReadingTheme; label: string; icon: string; bg: string; text: string }[] = [
    { id: 'deepblue', label: 'Deep Blue', icon: '🌊', bg: 'bg-[#0b132b]', text: 'text-blue-100' },
    { id: 'light', label: 'Paper', icon: '☀️', bg: 'bg-[#ffffff]', text: 'text-slate-900' },
    { id: 'dark', label: 'Black Slate', icon: '🌑', bg: 'bg-[#090d16]', text: 'text-slate-100' },
    { id: 'midnight', label: 'OLED', icon: '🌌', bg: 'bg-[#000000]', text: 'text-slate-100' },
    { id: 'sepia', label: 'Sepia', icon: '📜', bg: 'bg-[#f5efe6]', text: 'text-[#33271d]' },
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
    <header id="ebook-global-header" className="sticky top-0 z-30 w-full backdrop-blur-md border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 transition-colors font-sans">
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
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate max-w-[150px] sm:max-w-xs md:max-w-md">
                {chapterTitle}
              </h1>
            </div>
          </div>
        </div>

        {/* Center/Right: Daily Reading Goal Tracker Pill (Clickable) */}
        <button
          type="button"
          onClick={onOpenStats}
          className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer group shadow-2xs"
          title="Open Daily Reading Goal & Stats Dashboard"
        >
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-md bg-blue-600/10 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Target className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <span>Daily Goal</span>
                <span className="flex items-center text-amber-600 dark:text-amber-400 font-bold">
                  <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {userStats.streakDays}d
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span>{todayMinutes.toFixed(1)} / {dailyGoalMinutes}m</span>
                <span className={`text-[10px] font-mono ${isGoalMet ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-blue-600 dark:text-blue-400'}`}>
                  {isGoalMet ? '100% ✓' : `${goalPercent}%`}
                </span>
              </div>
            </div>
          </div>

          <div className="w-20 lg:w-28 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isGoalMet
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-500'
              }`}
              style={{ width: `${goalPercent}%` }}
            />
          </div>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 border-l border-slate-200 dark:border-slate-800 pl-2 sm:pl-3">
          {/* Mobile Goal & Stats Button */}
          <button
            type="button"
            onClick={onOpenStats}
            className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer"
            title="Daily Goal & Stats"
          >
            <Target className="w-4 h-4" />
            <span className="text-[10px] font-bold font-mono">{goalPercent}%</span>
          </button>

          {/* Google Drive Cloud Button */}
          <button
            type="button"
            onClick={onOpenDrive}
            className="px-2.5 py-1.5 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Google Drive Cloud Hub"
          >
            <HardDrive className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden md:inline">Google Drive</span>
          </button>

          {/* Idea Validation Checklist Button */}
          <button
            type="button"
            onClick={onOpenChecklist}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer hidden sm:flex items-center gap-1"
            title="Idea Validation Checklist"
          >
            <ListChecks className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden lg:inline">Validation</span>
          </button>

          {/* Startup Case Studies Dossier Button */}
          <button
            type="button"
            onClick={onOpenCaseStudies}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer hidden sm:flex items-center gap-1"
            title="Startup Case Studies Dossier"
          >
            <Briefcase className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden lg:inline">Case Studies</span>
          </button>

          {/* Stats Dashboard Icon Button (Desktop/Laptop) */}
          <button
            type="button"
            onClick={onOpenStats}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer hidden sm:flex items-center gap-1"
            title="Reading Stats Dashboard"
          >
            <TrendingUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600 dark:text-blue-400" />
          </button>

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
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-xs shadow-blue-500/20 cursor-pointer flex items-center gap-1.5"
            title="Ask AI Founder Mentor"
          >
            <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center shadow-xs">
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
                    <div className="grid grid-cols-5 gap-1.5">
                      {themes.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => onUpdatePreferences({ theme: t.id })}
                          className={`p-1.5 rounded-lg border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            preferences.theme === t.id
                              ? 'ring-2 ring-blue-500 border-blue-500 font-bold scale-105'
                              : 'border-slate-300 dark:border-slate-700 hover:border-slate-400'
                          } ${t.bg} ${t.text}`}
                        >
                          <span className="text-sm">{t.icon}</span>
                          <span className="text-[9px] font-semibold truncate max-w-full">{t.label}</span>
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

          {/* Firebase Authentication: Google Sign-in & Profile */}
          <div className="relative">
            {currentUser ? (
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full border border-blue-500/40 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:border-blue-500 transition-all cursor-pointer shadow-xs"
                title={`Signed in as ${currentUser.displayName || currentUser.email}`}
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-blue-400"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold hidden md:inline truncate max-w-[100px]">
                  {currentUser.displayName?.split(' ')[0] || 'Founder'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" title="Firestore Realtime Sync Active" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSignInWithGoogle}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer shadow-xs"
                title="Sign in with Google to sync highlights and progress to Firebase"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* User Account Popover */}
            {showUserMenu && currentUser && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 text-xs space-y-3 font-sans">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Profile"
                        className="w-10 h-10 rounded-full ring-2 ring-blue-500"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                        {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <div className="font-bold text-slate-800 dark:text-white truncate">
                        {currentUser.displayName || 'Founder'}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-[11px] font-medium border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Firestore Sync</span>
                    </div>
                    <span className="font-bold text-[10px] uppercase">Active</span>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-normal px-1">
                    Your highlights, notes, and reading progress are synced securely across all your devices using Firebase Auth and Firestore.
                  </p>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        if (onSignOut) onSignOut();
                      }}
                      className="w-full py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950/40 text-slate-700 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
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


