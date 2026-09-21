import React, { useState, useRef, useEffect } from 'react';
import { Chapter } from '../types';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Copy,
  Check,
  Lightbulb,
  RotateCcw,
  User,
  Mic,
  Square,
  Globe,
  Database,
  Search,
  ExternalLink,
  Shield,
  Briefcase,
  Zap,
  TrendingUp,
  Cpu,
  FileText
} from 'lucide-react';
import { useVoiceRecorder } from '../utils/useVoiceRecorder';
import { DEFAULT_DATASETS, KnowledgeDataset } from '../data/defaultDatasets';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: Array<{ title: string; url: string }>;
  modelUsed?: string;
}

interface Props {
  chapter: Chapter;
  isOpen: boolean;
  onClose: () => void;
  onSaveAsNote?: (text: string) => void;
}

type MentorRole = 'yc-partner' | 'wealth-strategist' | 'habits-architect' | 'dataset-analyst' | 'brutal-auditor';

export const AIMentorModal: React.FC<Props> = ({
  chapter,
  isOpen,
  onClose,
  onSaveAsNote
}) => {
  // Founder Name Memory (from note.ipynb simple_chatbot pattern)
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('founder_user_name') || 'Elkanah';
  });
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(userName);

  // Role & Model State
  const [role, setRole] = useState<MentorRole>('yc-partner');
  const [modelName, setModelName] = useState<string>('gemini-3.5-flash');
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(false);

  // Custom Knowledge-Base Dataset State (from note.ipynb)
  const [activeTab, setActiveTab] = useState<'chat' | 'dataset'>('chat');
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('startup-metrics');
  const [customDatasetText, setCustomDatasetText] = useState<string>(DEFAULT_DATASETS[0].content);

  // Multi-Turn Conversation Thread
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: `Hello **${userName}**! I am your AI Startup & Execution Mentor.\n\nI can advise you across:\n- **Y-Combinator Strategy**: Launch velocity, finding product-market fit, and talk-to-users dogma\n- **The Psychology of Wealth**: Compounding, managing cash runway, and separating self-worth from metrics\n- **Atomic Founder Habits**: Daily 3-win routines, managing your things, and executive focus\n- **Custom Dataset Q&A**: Scan your uploaded pitch decks, documents, or data (like in your notebook)\n- **Live Google Search Grounding**: Real-time web intelligence on market valuations and competitors\n\nHow can I help you accelerate today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash'
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Voice recording hook with gemini-3.5-transcribe
  const {
    isRecording,
    isTranscribing,
    duration,
    error: voiceError,
    startRecording,
    stopRecording
  } = useVoiceRecorder((transcribedText) => {
    if (transcribedText) {
      setInputPrompt(prev => prev ? `${prev} ${transcribedText}` : transcribedText);
    }
  });

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  if (!isOpen) return null;

  const handleSaveName = () => {
    const trimmed = nameInput.trim() || 'Founder';
    setUserName(trimmed);
    localStorage.setItem('founder_user_name', trimmed);
    setIsEditingName(false);
  };

  const handleSelectDataset = (ds: KnowledgeDataset) => {
    setSelectedDatasetId(ds.id);
    setCustomDatasetText(ds.content);
    setRole('dataset-analyst');
  };

  const quickPrompts = [
    { label: "Search Market Intel", prompt: "Search recent trends in AI startup venture funding and valuations this quarter.", search: true },
    { label: "Psychology of Wealth", prompt: "Explain the psychology of wealth: why is wealth what you don't see?", search: false },
    { label: "Atomic Habits", prompt: "Give me the Daily 3-Win protocol for managing my things and avoiding founder burnout.", search: false },
    { label: "Scan Project Orion", prompt: "According to the dataset, who is the commander of Project Orion, and what is its destination?", search: false, datasetId: 'note-ipynb-orion' },
    { label: "Stress Test Pricing", prompt: "How should an early B2B product set its value metric and avoid dangerous underpricing?", search: false }
  ];

  const handleSendMessage = async (customPrompt?: string, forceSearch?: boolean) => {
    const textToSend = (customPrompt || inputPrompt).trim();
    if (!textToSend || isLoading) return;

    const willSearch = forceSearch !== undefined ? forceSearch : useSearchGrounding;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputPrompt('');
    setIsLoading(true);

    try {
      // Pass full multi-turn conversation messages array to maintain context
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            content: m.text
          })),
          userName,
          role,
          modelName: willSearch ? 'gemini-3.5-flash' : modelName,
          useSearchGrounding: willSearch,
          customDataset: customDatasetText,
          chapterTitle: chapter.title,
          chapterSummary: chapter.summary,
          startupContext: `Founder ${userName}, chapter: ${chapter.title}`
        })
      });

      const data = await response.json();
      const replyText = data?.advice || "I reviewed your question and generated guidance.";

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data?.sources || [],
        modelUsed: data?.model || (willSearch ? 'gemini-3.5-flash (Search Grounded)' : modelName)
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      const fallbackMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: `### Strategic Guidance for ${userName}\n\n1. **First Principles Validation:**\nFocus 80% of your current runway de-risking the single riskiest hypothesis.\n2. **Talk Directly to Users:**\nConduct 5 unscripted customer interviews this week. Measure pain by what they spent trying to solve it.\n3. **Stay Default Alive:**\nKeep personal and company burn strictly bounded. Survival through iteration cycles is how asymmetric returns compound.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'offline-smart-fallback'
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToNotes = (id: string, text: string) => {
    if (onSaveAsNote) {
      onSaveAsNote(`[AI Mentor Insight - ${chapter.title}]\n\n${text}`);
      setSavedId(id);
      setTimeout(() => setSavedId(null), 2000);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        text: `Chat refreshed for **${userName}**. What venture, habit, dataset, or wealth challenge are we solving?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: modelName
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs font-sans">
      <div className="w-full max-w-4xl h-[90vh] flex flex-col rounded-2xl bg-[#090d16] text-white border border-[#1e2d54] shadow-2xl overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-b border-[#1e2d54] bg-[#070d1e] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-900/40">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-white text-base">Founder AI Mentor & Intelligence Engine</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  Multi-Turn Gemini
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Founder:</span>
                {isEditingName ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-white border border-slate-700 text-xs w-28 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSaveName}
                      className="text-xs text-blue-400 hover:text-blue-300 font-bold px-1"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingName(true)}
                    className="text-blue-400 hover:underline font-semibold"
                    title="Click to change your name"
                  >
                    {userName} (edit)
                  </button>
                )}
                <span>•</span>
                <span className="text-slate-500 truncate max-w-[200px] sm:max-w-xs">{chapter.title}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* View Switcher: Chat vs Knowledge Base */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'chat' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Chat Thread
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dataset')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === 'dataset' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-3 h-3 text-cyan-400" />
                Knowledge Base
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetChat}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset Conversation"
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

        {/* Controls & Grounding Header Ribbon */}
        <div className="px-4 py-2 bg-[#0c152c] border-b border-[#1e2d54] flex items-center justify-between flex-wrap gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Role Selector */}
            <div className="flex items-center gap-1 text-slate-300">
              <span className="text-[11px] text-slate-400">Role:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as MentorRole)}
                className="bg-slate-900 text-white border border-slate-700 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="yc-partner">🚀 YC Managing Partner</option>
                <option value="wealth-strategist">💎 Psychology of Wealth</option>
                <option value="habits-architect">⚡ Atomic Habits & Focus</option>
                <option value="dataset-analyst">📑 Knowledge Base Analyst</option>
                <option value="brutal-auditor">⚖️ Brutal VC Auditor</option>
              </select>
            </div>

            {/* Model Selector */}
            <div className="flex items-center gap-1 text-slate-300">
              <span className="text-[11px] text-slate-400">Model:</span>
              <select
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="bg-slate-900 text-white border border-slate-700 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="gemini-3.5-flash">gemini-3.5-flash (Standard & Search)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fastest)</option>
                <option value="gemini-3.8-flash">gemini-3.8-flash (Deep Reasoning)</option>
              </select>
            </div>
          </div>

          {/* Google Search Grounding Toggle */}
          <button
            type="button"
            onClick={() => setUseSearchGrounding(!useSearchGrounding)}
            className={`px-2.5 py-1 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              useSearchGrounding
                ? 'bg-blue-600 text-white border-blue-400 shadow-sm shadow-blue-500/30'
                : 'bg-slate-900/90 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Toggle Google Search Grounding to fetch live web data"
          >
            <Globe className={`w-3.5 h-3.5 ${useSearchGrounding ? 'text-white' : 'text-blue-400'}`} />
            <span>Google Search Data</span>
            <span className={`text-[10px] px-1 rounded ${useSearchGrounding ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-400'}`}>
              {useSearchGrounding ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {/* TAB 1: Chat View */}
        {activeTab === 'chat' && (
          <>
            {/* Quick Prompts Carousel */}
            <div className="px-4 py-2 bg-[#091124] border-b border-[#1e2d54] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[10px] uppercase font-bold text-blue-400 shrink-0">Prompts:</span>
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (qp.datasetId) {
                      const found = DEFAULT_DATASETS.find(d => d.id === qp.datasetId);
                      if (found) handleSelectDataset(found);
                    }
                    handleSendMessage(qp.prompt, qp.search);
                  }}
                  className="px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-blue-600 hover:text-white text-slate-300 border border-slate-700/60 transition-colors shrink-0 cursor-pointer text-[11px] font-medium flex items-center gap-1"
                >
                  {qp.search && <Globe className="w-3 h-3 text-cyan-400" />}
                  <span>{qp.label}</span>
                </button>
              ))}
            </div>

            {/* Chat Thread Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[92%] sm:max-w-[85%] ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-[#121f42] text-blue-200 border border-[#203362]'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div
                      className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                          : 'bg-[#0d162f] text-slate-100 border border-[#1e2d54] rounded-tl-none whitespace-pre-wrap'
                      }`}
                    >
                      {msg.text}

                      {/* Web Search Citations & Grounding Sources */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-700/60 text-xs">
                          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1.5 text-[11px]">
                            <Globe className="w-3.5 h-3.5" />
                            <span>Google Search Grounding Sources:</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.sources.map((s, sIdx) => (
                              <a
                                key={sIdx}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px] transition-colors"
                              >
                                <span className="truncate max-w-[180px]">{s.title}</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metadata & Actions */}
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-400">
                        {msg.modelUsed && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            {msg.modelUsed}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="px-2 py-0.5 rounded hover:bg-slate-800 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
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
                            className="px-2 py-0.5 rounded hover:bg-slate-800 text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {savedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 font-semibold">Saved to Notes</span>
                              </>
                            ) : (
                              <>
                                <Lightbulb className="w-3 h-3" />
                                <span>Save Note</span>
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
                <div className="flex gap-3 max-w-[85%] mr-auto items-center">
                  <div className="w-8 h-8 rounded-full bg-[#121f42] text-blue-200 flex items-center justify-center text-xs font-bold border border-[#203362] shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#0d162f] border border-[#1e2d54] text-xs text-slate-300 flex items-center gap-2.5">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    <span>
                      {useSearchGrounding ? 'Scanning Google Search & synthesizing insights...' : 'Gemini Advisor is analyzing...'}
                    </span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Voice Recording / Transcribing Indicator Banner */}
            {(isRecording || isTranscribing) && (
              <div className="px-4 py-2 bg-red-950/80 border-t border-red-800 flex items-center justify-between text-xs text-red-200 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="font-bold">
                    {isRecording ? `Recording audio with microphone (${duration}s)...` : 'Transcribing voice via gemini-3.5-transcribe...'}
                  </span>
                </div>
                {isRecording && (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="px-2.5 py-1 rounded bg-red-700 hover:bg-red-600 text-white font-bold flex items-center gap-1 text-xs cursor-pointer"
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span>Done & Transcribe</span>
                  </button>
                )}
              </div>
            )}

            {voiceError && (
              <div className="px-4 py-1.5 bg-amber-950/70 text-amber-300 text-xs border-t border-amber-800 flex items-center justify-between">
                <span>{voiceError}</span>
                <span className="text-[10px] opacity-70">Check browser microphone permissions</span>
              </div>
            )}

            {/* Input Bar with Audio Transcription Mic */}
            <div className="p-3 sm:p-4 bg-[#070d1e] border-t border-[#1e2d54] shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    placeholder="Ask about your startup, habits, wealth psychology, or talk via microphone..."
                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#0b132b] text-white border border-[#1e2d54] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
                  />

                  {/* Speech-to-Text Microphone Button (gemini-3.5-transcribe) */}
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isTranscribing}
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isRecording
                        ? 'bg-red-600 text-white ring-2 ring-red-400 animate-pulse'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title={isRecording ? 'Stop recording voice memo' : 'Speak via microphone (Audio Transcription)'}
                  >
                    {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !inputPrompt.trim()}
                  className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Ask</span>
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
                <span>Multi-turn memory active • Audio speech input powered by gemini-3.5-transcribe</span>
                {useSearchGrounding && (
                  <span className="text-cyan-400 font-semibold flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Live Search Grounding Enabled
                  </span>
                )}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: Interactive Knowledge-Base & Dataset View (from note.ipynb) */}
        {activeTab === 'dataset' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#090d16]">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                Custom Knowledge-Base & Dataset Scanner
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Inspired by your interactive knowledge-base notebook (<code className="text-slate-300">note.ipynb</code>).
                Load a dataset below or paste your own startup business plan, investor memo, or project facts to extract answers with zero hallucinations.
              </p>
            </div>

            {/* Dataset Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DEFAULT_DATASETS.map((ds) => (
                <button
                  key={ds.id}
                  type="button"
                  onClick={() => handleSelectDataset(ds)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedDatasetId === ds.id
                      ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500'
                      : 'border-slate-800 bg-[#0d162f] hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{ds.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {ds.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{ds.content.slice(0, 100)}...</p>
                </button>
              ))}
            </div>

            {/* Dataset Content Editor / Viewer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  Active Dataset Content (Editable):
                </label>
                <span className="text-[11px] text-slate-500">
                  {customDatasetText.split('\n').length} lines • {customDatasetText.length} chars
                </span>
              </div>
              <textarea
                value={customDatasetText}
                onChange={(e) => setCustomDatasetText(e.target.value)}
                rows={8}
                className="w-full p-3 rounded-xl bg-[#0b132b] text-slate-200 border border-[#1e2d54] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                placeholder="Paste any custom dataset, pitch deck notes, or documentation here..."
              />
            </div>

            {/* Suggested Dataset Questions */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300">Suggested Questions for This Dataset:</span>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_DATASETS.find(d => d.id === selectedDatasetId)?.suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveTab('chat');
                      handleSendMessage(q);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-600 hover:text-white text-blue-200 border border-blue-700/60 text-xs transition-colors cursor-pointer text-left"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button to Query */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <Bot className="w-4 h-4" />
                <span>Return to Chat & Query This Dataset</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
