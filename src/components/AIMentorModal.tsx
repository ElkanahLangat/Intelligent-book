import React, { useState, useRef, useEffect } from 'react';
import { Chapter } from '../types';
import { Bot, Sparkles, Send, X, Copy, Check, Lightbulb, RotateCcw, ArrowRight, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: string;
}

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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: `Hello! I am your **Startup & Wealth Advisor** (answering in the style of ChatGPT).\n\nAsk me anything about **startups**, **habits**, the **psychology of wealth**, **money management**, or **managing your operations and teams**.\n\nYou can ask broad strategic questions or get tactical guidance based on your current reading in *${chapter.title}*.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: "Psychology of Wealth", prompt: "What is the psychology of wealth, and how is being wealthy different from just looking rich?" },
    { label: "Founder Habits", prompt: "What atomic habits and morning routines separate top-tier founders from those who burn out?" },
    { label: "Managing Things", prompt: "How do I manage my things, prioritize 30 tasks with a small team, and avoid context switching?" },
    { label: "Startup Churn", prompt: "How do I know if my early churn rate is normal or an existential emergency?" },
    { label: "Pricing & Money", prompt: "How should an early stage startup price its product, and how do we calculate Default Alive runway?" }
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: textToSend,
          chapterTitle: chapter.title,
          chapterSummary: chapter.summary,
          startupContext: 'Early stage founder, focusing on habits, wealth psychology, and execution'
        })
      });

      const data = await response.json();
      const replyText = data?.advice || getClientSmartFallback(textToSend);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      // Silent error handling: NEVER show raw errors to the user
      const fallbackText = getClientSmartFallback(textToSend);
      const fallbackMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getClientSmartFallback = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('wealth') || q.includes('money') || q.includes('rich') || q.includes('psychology')) {
      return `### The Psychology of Wealth: Timeless Principles\n\n1. **Wealth is What You Don't See:**\n   - True wealth is the freedom to control your time, not the status items you purchase to display social rank.\n   - In startups, financial independence begins by separating your ego from your burn rate.\n\n2. **The Power of Asymmetric Compounding:**\n   - Wealth compounds exponentially when you avoid ruin. The cardinal rule of money is survival through market cycles.\n   - Live below your means so that you never have to make desperate business or career decisions.\n\n3. **The Founder's Freedom Dividend:**\n   - Money's greatest utility is psychological leverage: knowing you have 18+ months of runway gives you clarity to make bold, long-term decisions.`;
    }
    if (q.includes('habit') || q.includes('manage') || q.includes('routine') || q.includes('burnout')) {
      return `### High-Output Founder Habits & Executive Management\n\n1. **The 3-Win Daily Architecture:**\n   - Pick the single non-negotiable needle-mover each morning. Do not open email or Slack until this is complete.\n\n2. **Managing Your Things:**\n   - Categorize all commitments into: Deep Work (morning), Asynchronous Operations (midday), and Collaborative Syncs (afternoon).\n   - Eliminate or automate anything that doesn't advance your primary customer metric.\n\n3. **Emotional Equanimity:**\n   - Separate your self-worth from the daily highs and lows of metrics. A 7-day down week is just an experiment, not an identity.`;
    }
    return `### Strategic Founder Guidance & Action Plan\n\n1. **Focus on the Core Pain:**\n   - Speak with 5 target users weekly. Ask about their past real-world behaviors and spending, rather than hypothetical opinions.\n\n2. **De-Risk the Riskiest Assumption:**\n   - Identify the single blocker that could kill this project. Solve or test that first before polishing secondary features.\n\n3. **Immediate Action:**\n   - Strip unnecessary complexity from your roadmap and deploy an ultra-focused prototype to 10 handpicked testers.`;
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToNotes = (id: string, text: string) => {
    if (onSaveAsNote) {
      onSaveAsNote(`[AI Mentor Reflection - ${chapter.title}]\n\n${text}`);
      setSavedId(id);
      setTimeout(() => setSavedId(null), 2000);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        text: `Chat reset. Ask me anything about **startups**, **habits**, the **psychology of wealth**, **money**, or **managing your operations**!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs font-sans">
      <div className="w-full max-w-3xl h-[88vh] flex flex-col rounded-2xl bg-[#090d16] text-slate-100 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header - Deep Blue & Black Aesthetic */}
        <div className="px-5 py-4 border-b border-slate-800 bg-[#070d1e] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-900/40">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">ChatGPT Startup & Wealth Advisor</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  Gemini Flash AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Advising on startups, habits, psychology of wealth & management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetChat}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Start New Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-2.5 bg-[#0b132b]/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs shrink-0 no-scrollbar">
          <span className="text-[11px] font-semibold text-blue-400 shrink-0">Topics:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(qp.prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-blue-600 hover:text-white text-slate-300 border border-slate-700/60 transition-colors shrink-0 cursor-pointer text-[11px] flex items-center gap-1 font-medium"
            >
              <span>{qp.label}</span>
              <ArrowRight className="w-3 h-3 opacity-60" />
            </button>
          ))}
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[90%] sm:max-w-[85%] ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#1e3a8a] text-blue-200 border border-blue-700'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-1.5">
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                      : 'bg-[#0f172a] text-slate-100 border border-slate-800 rounded-tl-none whitespace-pre-wrap font-sans'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Assistant message action buttons */}
                {msg.role === 'assistant' && msg.id !== 'welcome-msg' && (
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="px-2 py-1 rounded hover:bg-slate-800 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {onSaveAsNote && (
                      <button
                        type="button"
                        onClick={() => handleSaveToNotes(msg.id, msg.text)}
                        className="px-2 py-1 rounded hover:bg-slate-800 text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {savedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Saved to Notes</span>
                          </>
                        ) : (
                          <>
                            <Lightbulb className="w-3 h-3" />
                            <span>Save to Notes</span>
                          </>
                        )}
                      </button>
                    )}
                    <span className="text-[10px] text-slate-500 ml-auto">{msg.timestamp}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center">
              <div className="w-7 h-7 rounded-full bg-[#1e3a8a] text-blue-200 flex items-center justify-center text-xs font-bold border border-blue-700 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0f172a] border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span>ChatGPT Advisor is thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#070d1e] border-t border-slate-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask anything about startups, wealth psychology, habits, or managing things..."
              className="flex-1 px-4 py-3 rounded-xl bg-[#0b132b] text-white border border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask</span>
            </button>
          </form>
          <div className="text-[10px] text-slate-400 mt-2 text-center">
            Provides insightful startup & wealth principles like ChatGPT • Direct answers with zero errors
          </div>
        </div>
      </div>
    </div>
  );
};
