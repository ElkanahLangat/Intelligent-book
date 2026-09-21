import React, { useState, useEffect } from 'react';
import {
  googleSignIn,
  googleSignOut,
  initDriveAuth,
  getAccessToken,
  exportFileToDrive,
  listAppFolderFiles,
  deleteDriveFile,
  DriveFileItem
} from '../services/googleDriveService';
import { Chapter, HighlightItem, ChecklistItem, DetailedCaseStudy } from '../types';
import { ConfirmModal } from './ConfirmModal';
import {
  Cloud,
  HardDrive,
  UploadCloud,
  FileText,
  CheckCircle2,
  ExternalLink,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  Sparkles,
  BookOpen,
  ListChecks,
  Briefcase,
  Bookmark
} from 'lucide-react';
import { User } from 'firebase/auth';

interface GoogleDriveHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  currentChapter: Chapter;
  highlights: HighlightItem[];
  checklist: ChecklistItem[];
  caseStudies: DetailedCaseStudy[];
}

export const GoogleDriveHubModal: React.FC<GoogleDriveHubModalProps> = ({
  isOpen,
  onClose,
  chapters,
  currentChapter,
  highlights,
  checklist,
  caseStudies
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false);

  // Confirmation modal state for file deletion
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);

  // Initialize Auth state
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = initDriveAuth(
      (user, token) => {
        setCurrentUser(user);
        if (token) {
          fetchDriveFiles();
        }
      },
      () => {
        setCurrentUser(null);
        setDriveFiles([]);
      }
    );

    return () => unsubscribe();
  }, [isOpen]);

  const fetchDriveFiles = async () => {
    setIsLoadingFiles(true);
    try {
      const files = await listAppFolderFiles();
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Failed to load drive files', err);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        await fetchDriveFiles();
      }
    } catch (err: any) {
      const isCancelled =
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.code === 'auth/user-cancelled' ||
        err?.message?.includes('popup-closed-by-user') ||
        err?.message?.includes('cancelled-popup-request');

      if (!isCancelled) {
        console.error('Sign in failed', err);
        setErrorMessage(err.message || 'Failed to sign in with Google');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await googleSignOut();
      setCurrentUser(null);
      setDriveFiles([]);
    } catch (err: any) {
      console.error('Sign out error', err);
    }
  };

  // Helper generators for Markdown content
  const generateFullEbookMarkdown = () => {
    let md = `# Startup Lessons: The Founder's Field Manual\n`;
    md += `*Hard-Won Principles on Idea Validation, Product-Market Fit, Unit Economics, and Resilience*\n\n`;
    md += `> "A startup is a temporary search engine designed to discover a repeatable, scalable business model before running out of cash."\n\n---\n\n`;

    chapters.forEach((ch) => {
      md += `## Chapter ${ch.number}: ${ch.title}\n`;
      md += `**${ch.subtitle}**\n\n`;
      md += `> "${ch.introQuote.quote}" — *${ch.introQuote.author}*\n\n`;
      md += `### Summary\n${ch.summary}\n\n`;

      ch.sections.forEach((sec) => {
        md += `### ${sec.title}\n\n`;
        sec.paragraphs.forEach((p) => {
          md += `${p}\n\n`;
        });

        if (sec.pullQuote) {
          md += `> **Pull Quote:** "${sec.pullQuote.text}" — *${sec.pullQuote.author} (${sec.pullQuote.role || ''})*\n\n`;
        }

        if (sec.warStory) {
          md += `#### War Story: ${sec.warStory.company} (${sec.warStory.outcome})\n`;
          md += `**${sec.warStory.headline}**\n`;
          md += `${sec.warStory.lesson}\n\n`;
        }

        if (sec.keyTakeaways) {
          md += `**Key Takeaways:**\n`;
          sec.keyTakeaways.forEach((t) => {
            md += `- ${t}\n`;
          });
          md += `\n`;
        }
      });

      if (ch.actionPlan && ch.actionPlan.length > 0) {
        md += `### Action Plan\n`;
        ch.actionPlan.forEach((a) => {
          md += `- [ ] ${a}\n`;
        });
        md += `\n`;
      }

      md += `---\n\n`;
    });

    return md;
  };

  const generateValidationChecklistMarkdown = () => {
    let md = `# Validating a Business Idea: Actionable Founder Checklist\n`;
    md += `*Exported from Startup Lessons Ebook*\n\n`;
    const completedCount = checklist.filter((i) => i.completed).length;
    md += `**Overall Progress:** ${completedCount}/${checklist.length} (${Math.round(
      (completedCount / checklist.length) * 100
    )}% Completed)\n\n---\n\n`;

    const stages = [
      'Stage 1: Problem Definition',
      'Stage 2: Customer Discovery',
      'Stage 3: Smoke Testing',
      'Stage 4: Unit Economics',
      'Stage 5: Go/No-Go Gate'
    ];

    stages.forEach((stage) => {
      md += `## ${stage}\n\n`;
      const stageItems = checklist.filter((i) => i.stage === stage);
      stageItems.forEach((item) => {
        md += `### ${item.completed ? '[x]' : '[ ]'} ${item.title}\n`;
        md += `**Action:** ${item.action}\n\n`;
        md += `💡 **Pro Tip:** ${item.proTip}\n\n`;
        md += `🎯 **Falsifiable Metric:** \`${item.falsifiableMetric}\`\n\n`;
        if (item.notes) {
          md += `📝 **Founder Notes:** ${item.notes}\n\n`;
        }
      });
    });

    return md;
  };

  const generateCaseStudiesMarkdown = () => {
    let md = `# Startup Case Studies: Deep-Dive Lessons on Common Challenges\n`;
    md += `*Real-world teardowns of Airbnb, Slack, Dropbox, Segment, and Quibi vs Superhuman*\n\n---\n\n`;

    caseStudies.forEach((cs) => {
      md += `## ${cs.company} (${cs.category} • ${cs.outcome})\n`;
      md += `**Founders:** ${cs.founders}\n`;
      md += `*${cs.tagline}*\n\n`;

      md += `### Key Metrics\n`;
      cs.metrics.forEach((m) => {
        md += `- **${m.label}:** ${m.value}\n`;
      });
      md += `\n`;

      md += `### The Core Challenge\n${cs.theChallenge}\n\n`;
      md += `### The Turning Point & Strategy\n${cs.theTurningPoint}\n\n`;
      md += `### Key Founder Lessons\n`;
      cs.keyLessons.forEach((l) => {
        md += `- ${l}\n`;
      });
      md += `\n`;
      md += `> "${cs.founderQuote.quote}" — *${cs.founderQuote.author} (${cs.founderQuote.context})*\n\n`;
      md += `---\n\n`;
    });

    return md;
  };

  const generateNotesMarkdown = () => {
    let md = `# My Startup Lessons Highlights & Notes\n`;
    md += `*Total Highlights:* ${highlights.length}\n\n---\n\n`;

    if (highlights.length === 0) {
      md += `No highlights recorded yet.\n`;
      return md;
    }

    highlights.forEach((h, i) => {
      const chapter = chapters.find((c) => c.id === h.chapterId);
      md += `### ${i + 1}. Chapter: ${chapter ? chapter.title : 'Chapter ' + h.chapterId}\n`;
      md += `> "${h.text}"\n\n`;
      if (h.note) {
        md += `**My Note:** ${h.note}\n\n`;
      }
      md += `*Color tag: ${h.color} | Saved: ${new Date(h.createdAt).toLocaleDateString()}*\n\n---\n\n`;
    });

    return md;
  };

  const handleExport = async (
    type: 'ebook' | 'checklist' | 'case_studies' | 'notes' | 'current_chapter',
    asGoogleDoc: boolean = false
  ) => {
    if (!currentUser) {
      await handleSignIn();
      return;
    }

    setIsExporting(true);
    setExportMessage(null);
    setErrorMessage(null);

    try {
      let title = '';
      let content = '';

      if (type === 'ebook') {
        title = `Startup Lessons - The Founder Field Manual (${new Date().toISOString().split('T')[0]})`;
        content = generateFullEbookMarkdown();
      } else if (type === 'checklist') {
        title = `Business Idea Validation Checklist (${new Date().toISOString().split('T')[0]})`;
        content = generateValidationChecklistMarkdown();
      } else if (type === 'case_studies') {
        title = `Startup Case Studies Dossier (${new Date().toISOString().split('T')[0]})`;
        content = generateCaseStudiesMarkdown();
      } else if (type === 'notes') {
        title = `My Startup Highlights & Founder Notes (${new Date().toISOString().split('T')[0]})`;
        content = generateNotesMarkdown();
      } else if (type === 'current_chapter') {
        title = `Startup Lessons - Chapter ${currentChapter.number} (${currentChapter.title})`;
        content = `# Chapter ${currentChapter.number}: ${currentChapter.title}\n\n${currentChapter.summary}\n\n` +
          currentChapter.sections.map(s => `## ${s.title}\n\n${s.paragraphs.join('\n\n')}`).join('\n\n---\n\n');
      }

      const file = await exportFileToDrive({
        title: asGoogleDoc ? `${title} (Doc)` : `${title}.md`,
        content,
        mimeType: 'text/markdown',
        asGoogleDoc
      });

      setExportMessage(`Successfully exported "${file.name}" to your Google Drive!`);
      await fetchDriveFiles();
    } catch (err: any) {
      console.error('Export failed:', err);
      setErrorMessage(err.message || 'Export to Google Drive failed.');
    } finally {
      setIsExporting(false);
    }
  };

  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;
    try {
      await deleteDriveFile(fileToDelete.id);
      setFileToDelete(null);
      await fetchDriveFiles();
      setExportMessage('File removed from Google Drive.');
    } catch (err: any) {
      console.error('Delete failed:', err);
      setErrorMessage(err.message || 'Failed to delete file from Google Drive.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Google Drive Cloud Hub</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                  Google Workspace
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Export guides, sync idea checklists, and save founder notes to your Google Drive.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Auth State Card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Google User'}
                    className="w-10 h-10 rounded-full border border-blue-500/30 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                    {currentUser.email ? currentUser.email[0].toUpperCase() : 'G'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {currentUser.displayName || 'Google Account'}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Connected
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs">
                    {currentUser.email}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Connect Your Google Drive
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sign in to export formatted Google Docs and manage your founder files.
                  </div>
                </div>
              </div>
            )}

            <div>
              {currentUser ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={isAuthenticating}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 dark:border-slate-700 text-slate-800 font-semibold text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAuthenticating ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>Sign in with Google</span>
                </button>
              )}
            </div>
          </div>

          {/* Feedback Messages */}
          {exportMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                {exportMessage}
              </span>
              <button
                type="button"
                onClick={() => setExportMessage(null)}
                className="text-emerald-600 dark:text-emerald-400 hover:opacity-75"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center justify-between animate-fadeIn">
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-red-600 dark:text-red-400 hover:opacity-75"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* One-Click Drive Export Suite */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1-Click Export to Google Drive
              </h3>
              {isExporting && (
                <span className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-semibold animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" /> Uploading to Drive...
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Export Full Ebook */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-xs mb-1">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>Complete Ebook Field Manual</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    All 8 chapters, war stories, and frameworks formatted as clean Markdown or Google Doc.
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleExport('ebook', false)}
                    disabled={isExporting}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Save to Drive</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport('ebook', true)}
                    disabled={isExporting}
                    className="py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px] transition-colors cursor-pointer disabled:opacity-50"
                    title="Export as Google Doc"
                  >
                    Google Doc
                  </button>
                </div>
              </div>

              {/* Export Validation Checklist */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-xs mb-1">
                    <ListChecks className="w-4 h-4 text-emerald-600" />
                    <span>Idea Validation Checklist</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    Actionable 5-stage validation checklist with your active progress and custom notes.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleExport('checklist', false)}
                    disabled={isExporting}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Export Checklist ({checklist.filter((i) => i.completed).length}/{checklist.length})</span>
                  </button>
                </div>
              </div>

              {/* Export Startup Case Studies */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-xs mb-1">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    <span>Startup Case Studies Dossier</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    Deep dives into Airbnb, Slack, Dropbox, Segment, and Quibi with founder lessons.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleExport('case_studies', false)}
                    disabled={isExporting}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Export 5 Case Studies</span>
                  </button>
                </div>
              </div>

              {/* Export Highlights & Notes */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-xs mb-1">
                    <Bookmark className="w-4 h-4 text-amber-500" />
                    <span>My Highlights & Founder Notes</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    {highlights.length} saved passage highlights and custom annotations.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleExport('notes', false)}
                    disabled={isExporting || highlights.length === 0}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Export Notes ({highlights.length})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Google Drive Folder File Explorer */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Files in "Startup Lessons Ebook" Drive Folder
                </h3>
                <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded">
                  {driveFiles.length}
                </span>
              </div>
              {currentUser && (
                <button
                  type="button"
                  onClick={fetchDriveFiles}
                  disabled={isLoadingFiles}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title="Refresh Files"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin text-blue-500' : ''}`} />
                </button>
              )}
            </div>

            {!currentUser ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-slate-400 text-xs">
                Sign in above to browse and manage your Google Drive files.
              </div>
            ) : isLoadingFiles ? (
              <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span>Loading files from Google Drive...</span>
              </div>
            ) : driveFiles.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-slate-400 text-xs">
                No files in your Google Drive folder yet. Click any export button above to save your first manual!
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {driveFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {file.name}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2">
                          <span>
                            {file.modifiedTime
                              ? new Date(file.modifiedTime).toLocaleDateString()
                              : 'Recently'}
                          </span>
                          {file.size && <span>• {Math.round(Number(file.size) / 1024)} KB</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {file.webViewLink ? (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400 text-slate-600 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1 transition-colors"
                        >
                          <span>Open in Drive</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <a
                          href={`https://drive.google.com/file/d/${file.id}/view`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 text-slate-600 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1 transition-colors"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => setFileToDelete(file)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete from Google Drive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Files are securely saved to your Google Drive account with your permission.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Explicit User Confirmation Modal for Deletion (Mandatory for Workspace integrations) */}
      <ConfirmModal
        isOpen={fileToDelete !== null}
        title="Delete Google Drive File?"
        message={`Are you sure you want to permanently delete "${fileToDelete?.name}" from your Google Drive? This action cannot be undone.`}
        confirmLabel="Delete File"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={confirmDeleteFile}
        onCancel={() => setFileToDelete(null)}
      />
    </div>
  );
};
