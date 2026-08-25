import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack, X, Gauge, ChevronUp, ChevronDown } from 'lucide-react';

interface Props {
  textToRead: string[];
  currentParagraphIndex: number;
  chapterTitle: string;
  onParagraphChange: (index: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AudioPlayer: React.FC<Props> = ({
  textToRead,
  currentParagraphIndex,
  chapterTitle,
  onParagraphChange,
  isOpen,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize SpeechSynthesis and voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const updateVoices = () => {
        if (!synthRef.current) return;
        const availableVoices = synthRef.current.getVoices();
        // Prefer natural English voices
        const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
        setVoices(englishVoices.length > 0 ? englishVoices : availableVoices);
      };

      updateVoices();
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = updateVoices;
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Play paragraph
  const playParagraph = (index: number) => {
    if (!synthRef.current || !textToRead[index]) return;

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(textToRead[index]);
    utterance.rate = playbackRate;
    if (voices[selectedVoiceIndex]) {
      utterance.voice = voices[selectedVoiceIndex];
    }

    utterance.onend = () => {
      if (index + 1 < textToRead.length) {
        onParagraphChange(index + 1);
        playParagraph(index + 1);
      } else {
        setIsPlaying(false);
      }
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error", e);
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      playParagraph(currentParagraphIndex);
    }
  };

  const handleNext = () => {
    if (currentParagraphIndex + 1 < textToRead.length) {
      const nextIdx = currentParagraphIndex + 1;
      onParagraphChange(nextIdx);
      if (isPlaying) {
        playParagraph(nextIdx);
      }
    }
  };

  const handlePrev = () => {
    if (currentParagraphIndex > 0) {
      const prevIdx = currentParagraphIndex - 1;
      onParagraphChange(prevIdx);
      if (isPlaying) {
        playParagraph(prevIdx);
      }
    }
  };

  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (isPlaying) {
      playParagraph(currentParagraphIndex);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="ebook-audio-narration-bar" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl transition-all duration-300 font-sans">
      <div className="rounded-xl border border-slate-700 bg-slate-900/95 backdrop-blur-md text-white shadow-2xl p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Volume2 className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <span className="text-xs font-semibold text-slate-300">Audio Narrator: </span>
              <span className="text-xs text-blue-400 font-medium truncate">{chapterTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isMinimized ? "Expand Player" : "Collapse Player"}
            >
              {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                if (synthRef.current) synthRef.current.cancel();
                setIsPlaying(false);
                onClose();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Audio"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="space-y-3">
            {/* Paragraph progress indicator */}
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Paragraph {currentParagraphIndex + 1} of {textToRead.length}</span>
              <span>{Math.round(((currentParagraphIndex + 1) / Math.max(1, textToRead.length)) * 100)}% read</span>
            </div>

            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentParagraphIndex + 1) / Math.max(1, textToRead.length)) * 100}%` }}
              />
            </div>

            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentParagraphIndex === 0}
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  title="Previous Paragraph"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={togglePlay}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlaying ? 'Pause' : 'Listen'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentParagraphIndex + 1 >= textToRead.length}
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  title="Next Paragraph"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Multiplier & Voices */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-800 rounded-lg p-0.5 text-xs">
                  {[0.8, 1.0, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => changeSpeed(rate)}
                      className={`px-2 py-1 rounded-md font-medium transition-all cursor-pointer ${
                        playbackRate === rate
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                {voices.length > 0 && (
                  <select
                    value={selectedVoiceIndex}
                    onChange={(e) => {
                      setSelectedVoiceIndex(Number(e.target.value));
                      if (isPlaying) playParagraph(currentParagraphIndex);
                    }}
                    className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 max-w-[130px] sm:max-w-[160px] truncate cursor-pointer"
                  >
                    {voices.slice(0, 8).map((voice, idx) => (
                      <option key={idx} value={idx}>
                        {voice.name.replace(/Google|Microsoft|Apple/gi, '').trim()}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

