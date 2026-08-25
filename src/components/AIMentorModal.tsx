import React, { useState } from 'react';
import { Chapter } from '../types';
import { Bot, Sparkles, Send, X, Copy, Check, Lightbulb, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  chapter: Chapter;
  isOpen: boolean;
  onClose: () => void;
  onSaveAsNote?: (text: string) => void;
}

export const AIMentorModal: React.FC<Props> = ({
  chapter,
  isOpen,
  onClose,
  onSaveAsNote
}) => {
  const [activeTab, setActiveTab] = useState<'qna' | 'audit' | 'action-plan'>('qna');
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [startupContext, setStartupContext] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAsk = async (customPrompt?: string, modeOverride?: 'qna' | 'audit' | 'action-plan') => {
    const promptToSend = customPrompt || userPrompt;
    if (!promptToSend.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setAiResponse(null);

    const targetMode = modeOverride || activeTab;
    const modeMap: Record<string, string> = {
      'qna': 'chapter-qna',
      'audit': 'idea-audit',
      'action-plan': 'action-plan'
    };

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterTitle: chapter.title,
          chapterSummary: chapter.summary,
          userPrompt: promptToSend,
          startupContext: startupContext || 'Early Stage B2B SaaS / Consumer App',
          mode: modeMap[targetMode]
        })
      });

      const data = await res.json();
      if (data.advice) {
        setAiResponse(data.advice);
      } else if (data.fallbackAdvice) {
        setAiResponse(data.fallbackAdvice);
      } else {
        throw new Error('No advice received');
      }
    } catch (err: any) {
      console.error('Advisor request failed:', err);
      // Helpful fallback response
      setAiResponse(
        `### Core Principle from ${chapter.title}:\n\n` +
        `1. **Focus on the Hair-on-Fire Pain:** Make sure you are speaking with 5 target users every single week without pitching your solution in the first 15 minutes.\n` +
        `2. **Validate with Real Commitments:** Letters of Intent (LOIs), paid pilots, or credit card pre-authorizations are the only real truth.\n` +
        `3. **Immediate 7-Day Action:** Strip 50% of unnecessary features from your roadmap and launch a concierge MVP to 10 handpicked testers.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (aiResponse) {
      navigator.clipboard.writeText(aiResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const quickPrompts = [
    `How do I know if my early churn rate is normal or catastrophic?`,
    `What is the best way to handle a co-founder who is not pulling their weight?`,
    `How do I price my product if competitors are giving away a free tier?`
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base font-serif">AI Startup Advisor</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Gemini Flash
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md">
                Advising on <span className="font-medium text-slate-700 dark:text-slate-300">{chapter.title}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setActiveTab('qna'); setAiResponse(null); }}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'qna'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Ask Chapter Q&A
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('audit'); setAiResponse(null); }}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Audit My Startup Idea
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('action-plan'); setAiResponse(null); }}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'action-plan'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            7-Day Action Plan
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-slate-800 dark:text-slate-200 text-sm">
          {/* Active Mode Prompts & Instructions */}
          {activeTab === 'qna' && !aiResponse && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200">
                <span className="font-semibold">Author & Mentor Stance:</span> Ask about specific edge-cases, how to apply these frameworks to your industry, or how to avoid common rookie mistakes.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Quick Tactical Questions:
                </label>
                <div className="space-y-1.5">
                  {quickPrompts.map((qp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setUserPrompt(qp);
                        handleAsk(qp, 'qna');
                      }}
                      className="w-full text-left p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <span>"{qp}"</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-blue-600 dark:text-blue-400 transition-opacity shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && !aiResponse && (
            <div className="p-3.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200">
              <span className="font-semibold">Brutal Idea Stress-Test:</span> Describe what you are building, your target customer, and how you charge. The AI Mentor will evaluate your idea against {chapter.title}'s core rules and flag dangerous assumptions.
            </div>
          )}

          {activeTab === 'action-plan' && !aiResponse && (
            <div className="p-3.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200">
              <span className="font-semibold">7-Day Execution Blueprint:</span> Tell the mentor your current bottleneck (e.g. 0 paying users, high churn, co-founder disagreement). You will receive an immediate, no-BS 3-step action sprint.
            </div>
          )}

          {/* Form Input */}
          {!aiResponse && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {activeTab === 'audit' 
                    ? 'Describe your startup pitch / idea:' 
                    : activeTab === 'action-plan' 
                    ? 'What is your current top blocker / goal?' 
                    : 'Your question for the author:'}
                </label>
                <textarea
                  rows={3}
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder={
                    activeTab === 'audit'
                      ? 'e.g. AI-powered automated bookkeeping for dental clinics charging $199/month...'
                      : activeTab === 'action-plan'
                      ? 'e.g. We have 50 free signups but zero users converted to our $49 tier after 14 days...'
                      : 'e.g. How do I convince enterprise buyers when I have no SOC2 compliance yet?'
                  }
                  className="w-full p-3 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Startup Stage / Context (optional):
                </label>
                <input
                  type="text"
                  value={startupContext}
                  onChange={(e) => setStartupContext(e.target.value)}
                  placeholder="e.g. Pre-seed, 2 co-founders, $150k raised, B2B SaaS"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleAsk()}
                  disabled={isLoading || !userPrompt.trim()}
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Consulting Founder Knowledgebase...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{activeTab === 'audit' ? 'Audit My Startup Concept' : activeTab === 'action-plan' ? 'Generate 7-Day Sprint' : 'Get Mentor Guidance'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* AI Response View */}
          {aiResponse && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {aiResponse}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Advice'}</span>
                  </button>

                  {onSaveAsNote && (
                    <button
                      type="button"
                      onClick={() => {
                        onSaveAsNote(`[AI Mentor Insight - ${chapter.title}]\n` + aiResponse);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Save as Field Note</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => { setAiResponse(null); setUserPrompt(''); }}
                  className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                >
                  Ask Another Question →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

