import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { HelpCircle, Check, X, Award, RotateCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  chapterId: string;
  chapterTitle: string;
  questions: QuizQuestion[];
  onQuizComplete?: (score: number) => void;
}

export const ChapterQuiz: React.FC<Props> = ({
  chapterId,
  chapterTitle,
  questions,
  onQuizComplete
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore();
    if (score === questions.length) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
    if (onQuizComplete) {
      onQuizComplete(score);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const allAnswered = questions.every(q => selectedAnswers[q.id] !== undefined);
  const score = calculateScore();

  return (
    <div id={`chapter-quiz-${chapterId}`} className="my-10 p-6 md:p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 font-sans">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-serif">Founder Diagnostic Quiz</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Test your comprehension of {chapterTitle}</p>
          </div>
        </div>

        {submitted && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-semibold">
            <Award className="w-4 h-4" />
            Score: {score} / {questions.length}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const selectedIdx = selectedAnswers[q.id];
          const isCorrect = selectedIdx === q.correctIndex;

          return (
            <div key={q.id} className="p-4 sm:p-5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex gap-3 mb-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">
                  {qIndex + 1}
                </span>
                <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                  {q.question}
                </p>
              </div>

              <div className="space-y-2 pl-9">
                {q.options.map((option, optIdx) => {
                  const isThisSelected = selectedIdx === optIdx;
                  let buttonStyle = "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300";

                  if (submitted) {
                    if (optIdx === q.correctIndex) {
                      buttonStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium";
                    } else if (isThisSelected && !isCorrect) {
                      buttonStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200";
                    } else {
                      buttonStyle = "opacity-50 border-slate-200 dark:border-slate-700 bg-transparent text-slate-400";
                    }
                  } else if (isThisSelected) {
                    buttonStyle = "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-medium shadow-xs";
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelect(q.id, optIdx)}
                      disabled={submitted}
                      className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm flex items-start justify-between gap-3 transition-all cursor-pointer ${buttonStyle}`}
                    >
                      <span>{option}</span>
                      {submitted && optIdx === q.correctIndex && (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {submitted && isThisSelected && !isCorrect && (
                        <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-4 pl-9 pt-3 border-t border-slate-100 dark:border-slate-700/80 text-xs">
                  <p className="text-slate-600 dark:text-slate-400 mb-1">
                    <span className="font-semibold text-slate-900 dark:text-slate-200">Analysis: </span>
                    {q.explanation}
                  </p>
                  <p className="text-blue-700 dark:text-blue-400 font-medium flex items-center gap-1.5 mt-1">
                    <span className="font-semibold">Founder Takeaway:</span> {q.founderTakeaway}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`px-5 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              allAnswered
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            Submit Answers
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Quiz
          </button>
        )}
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {Object.keys(selectedAnswers).length} of {questions.length} answered
        </span>
      </div>
    </div>
  );
};

