export type ReadingTheme = 'light' | 'sepia' | 'dark' | 'midnight';
export type FontFamily = 'serif' | 'sans' | 'mono';
export type FontSize = 'sm' | 'base' | 'lg' | 'xl';

export interface HighlightItem {
  id: string;
  chapterId: string;
  sectionId?: string;
  paragraphIndex: number;
  text: string;
  color: 'yellow' | 'green' | 'blue' | 'purple' | 'amber';
  note?: string;
  createdAt: string;
}

export interface BookmarkItem {
  chapterId: string;
  paragraphIndex: number;
  snippet: string;
  chapterTitle: string;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  founderTakeaway: string;
}

export interface WarStory {
  company: string;
  outcome: 'Success' | 'Pivot' | 'Failure' | 'Near-Death';
  headline: string;
  lesson: string;
  quote?: string;
  founder?: string;
}

export interface FrameworkData {
  type: 'pmf-score' | 'runway-calc' | 'ltv-cac' | 'equity-split';
  title: string;
  subtitle: string;
  description: string;
}

export interface SectionContent {
  id: string;
  title: string;
  paragraphs: string[];
  pullQuote?: {
    text: string;
    author: string;
    role?: string;
  };
  keyTakeaways?: string[];
  warStory?: WarStory;
  framework?: FrameworkData;
  checklist?: string[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  readTimeMinutes: number;
  category: 'Foundation' | 'Product' | 'Growth' | 'Operations' | 'Psychology';
  summary: string;
  introQuote: {
    quote: string;
    author: string;
  };
  sections: SectionContent[];
  quiz?: QuizQuestion[];
  actionPlan: string[];
}

export interface ReadingPreferences {
  theme: ReadingTheme;
  fontFamily: FontFamily;
  fontSize: FontSize;
  lineHeight: 'normal' | 'relaxed' | 'loose';
  contentWidth: 'narrow' | 'medium' | 'wide';
  autoScroll: boolean;
}

export interface UserStats {
  completedChapters: string[];
  totalReadingSeconds: number;
  quizScores: Record<string, number>;
  streakDays: number;
  lastReadDate: string;
}
