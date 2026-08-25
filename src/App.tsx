/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { CHAPTERS, EBOOK_METADATA } from './data/chaptersData';
import { Chapter, ReadingPreferences, HighlightItem, UserStats } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Reader } from './components/Reader';
import { NotesDrawer } from './components/NotesDrawer';
import { SearchModal } from './components/SearchModal';
import { AIMentorModal } from './components/AIMentorModal';
import { AudioPlayer } from './components/AudioPlayer';

const STORAGE_KEYS = {
  PREFS: 'startup_ebook_preferences_v1',
  HIGHLIGHTS: 'startup_ebook_highlights_v1',
  STATS: 'startup_ebook_stats_v1',
  CURRENT_CHAPTER: 'startup_ebook_current_chapter_v1'
};

const DEFAULT_PREFERENCES: ReadingPreferences = {
  theme: 'light',
  fontFamily: 'serif',
  fontSize: 'base',
  lineHeight: 'relaxed',
  contentWidth: 'medium',
  autoScroll: false
};

const DEFAULT_STATS: UserStats = {
  completedChapters: [],
  totalReadingSeconds: 0,
  quizScores: {},
  streakDays: 1,
  lastReadDate: new Date().toISOString()
};

export default function App() {
  // State initialization with localStorage recovery
  const [currentChapterId, setCurrentChapterId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_CHAPTER) || CHAPTERS[0].id;
    } catch {
      return CHAPTERS[0].id;
    }
  });

  const [preferences, setPreferences] = useState<ReadingPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PREFS);
      return saved ? { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const [highlights, setHighlights] = useState<HighlightItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userStats, setUserStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      return saved ? { ...DEFAULT_STATS, ...JSON.parse(saved) } : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  // UI Modal / Drawer States
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAIMentorOpen, setIsAIMentorOpen] = useState<boolean>(false);
  const [isAudioOpen, setIsAudioOpen] = useState<boolean>(false);
  const [currentAudioParagraphIndex, setCurrentAudioParagraphIndex] = useState<number>(0);

  // Sync current chapter to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_CHAPTER, currentChapterId);
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    // Scroll to top when changing chapter
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentAudioParagraphIndex(0);
  }, [currentChapterId]);

  // Sync preferences
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(preferences));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [preferences]);

  // Sync highlights
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [highlights]);

  // Sync user stats
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(userStats));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [userStats]);

  // Reading time counter
  useEffect(() => {
    const timer = setInterval(() => {
      setUserStats(prev => ({
        ...prev,
        totalReadingSeconds: prev.totalReadingSeconds + 1
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsAIMentorOpen(false);
        setIsNotesOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Current Chapter calculations
  const currentChapterIndex = useMemo(() => {
    const idx = CHAPTERS.findIndex(c => c.id === currentChapterId);
    return idx !== -1 ? idx : 0;
  }, [currentChapterId]);

  const currentChapter = CHAPTERS[currentChapterIndex];
  const previousChapter = currentChapterIndex > 0 ? CHAPTERS[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < CHAPTERS.length - 1 ? CHAPTERS[currentChapterIndex + 1] : null;

  // Extract all paragraphs in the current chapter for the Audio Narrator
  const allParagraphsInCurrentChapter = useMemo(() => {
    const list: string[] = [];
    currentChapter.sections.forEach(sec => {
      sec.paragraphs.forEach(p => list.push(p));
    });
    return list;
  }, [currentChapter]);

  // Handlers
  const handleUpdatePreferences = (updated: Partial<ReadingPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updated }));
  };

  const handleAddHighlight = (item: Omit<HighlightItem, 'id' | 'createdAt'>) => {
    const newItem: HighlightItem = {
      ...item,
      id: `hl-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    setHighlights(prev => [newItem, ...prev]);
  };

  const handleDeleteHighlight = (id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
  };

  const handleToggleComplete = (chapterId: string) => {
    setUserStats(prev => {
      const isAlready = prev.completedChapters.includes(chapterId);
      const nextList = isAlready
        ? prev.completedChapters.filter(id => id !== chapterId)
        : [...prev.completedChapters, chapterId];
      return {
        ...prev,
        completedChapters: nextList
      };
    });
  };

  const handleJumpToHighlight = (chapterId: string, paragraphIndex: number) => {
    setCurrentChapterId(chapterId);
  };

  // Determine theme class
  const themeClass = preferences.theme === 'sepia'
    ? 'theme-sepia bg-[#f4ecd8] text-[#433422]'
    : preferences.theme === 'dark'
    ? 'theme-dark dark bg-[#1c1917] text-stone-100'
    : preferences.theme === 'midnight'
    ? 'theme-midnight dark bg-[#000000] text-stone-100'
    : 'theme-light bg-[#faf9f6] text-stone-900';

  return (
    <div id="startup-ebook-app-root" className={`min-h-screen flex flex-col transition-colors duration-200 ${themeClass}`}>
      {/* Global Header */}
      <Header
        chapterTitle={currentChapter.title}
        chapterNumber={currentChapter.number}
        totalChapters={CHAPTERS.length}
        completedChaptersCount={userStats.completedChapters.length}
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotes={() => setIsNotesOpen(true)}
        onOpenAIMentor={() => setIsAIMentorOpen(true)}
        onOpenAudio={() => setIsAudioOpen(true)}
        notesCount={highlights.length}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex w-full">
        {/* Table of Contents Sidebar */}
        <Sidebar
          chapters={CHAPTERS}
          currentChapterId={currentChapterId}
          onSelectChapter={(id) => setCurrentChapterId(id)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          userStats={userStats}
          onOpenNotes={() => setIsNotesOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAIMentor={() => setIsAIMentorOpen(true)}
          onOpenAudio={() => setIsAudioOpen(true)}
        />

        {/* Reading Main Content Area */}
        <main className="flex-1 lg:pl-80 w-full overflow-x-hidden min-h-[calc(100vh-4rem)]">
          <Reader
            chapter={currentChapter}
            previousChapter={previousChapter}
            nextChapter={nextChapter}
            onNavigateChapter={(id) => setCurrentChapterId(id)}
            preferences={preferences}
            highlights={highlights}
            onAddHighlight={handleAddHighlight}
            isCompleted={userStats.completedChapters.includes(currentChapter.id)}
            onToggleComplete={handleToggleComplete}
            onOpenAIMentor={() => setIsAIMentorOpen(true)}
            currentAudioParagraphIndex={isAudioOpen ? currentAudioParagraphIndex : -1}
          />
        </main>
      </div>

      {/* Floating Audio Narrator Player */}
      <AudioPlayer
        textToRead={allParagraphsInCurrentChapter}
        currentParagraphIndex={currentAudioParagraphIndex}
        chapterTitle={currentChapter.title}
        onParagraphChange={(idx) => setCurrentAudioParagraphIndex(idx)}
        isOpen={isAudioOpen}
        onClose={() => setIsAudioOpen(false)}
      />

      {/* Search Modal */}
      <SearchModal
        chapters={CHAPTERS}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={(chapterId) => setCurrentChapterId(chapterId)}
      />

      {/* Notes & Highlights Drawer */}
      <NotesDrawer
        highlights={highlights}
        chapters={CHAPTERS}
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        onDeleteHighlight={handleDeleteHighlight}
        onJumpToHighlight={handleJumpToHighlight}
      />

      {/* AI Founder Mentor Modal */}
      <AIMentorModal
        chapter={currentChapter}
        isOpen={isAIMentorOpen}
        onClose={() => setIsAIMentorOpen(false)}
        onSaveAsNote={(noteText) => {
          handleAddHighlight({
            chapterId: currentChapter.id,
            paragraphIndex: 0,
            text: `[AI Advisor Note] ${currentChapter.title}`,
            color: 'amber',
            note: noteText
          });
        }}
      />
    </div>
  );
}
