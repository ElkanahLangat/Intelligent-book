import React, { useState } from 'react';
import { ChecklistItem } from '../types';
import {
  ListChecks,
  CheckCircle2,
  Circle,
  Lightbulb,
  Target,
  Edit3,
  UploadCloud,
  RotateCcw,
  X,
  ChevronRight,
  Filter
} from 'lucide-react';

interface ValidationChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  checklist: ChecklistItem[];
  onToggleItem: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onResetChecklist: () => void;
  onExportToDrive: () => void;
}

export const ValidationChecklistModal: React.FC<ValidationChecklistModalProps> = ({
  isOpen,
  onClose,
  checklist,
  onToggleItem,
  onUpdateNotes,
  onResetChecklist,
  onExportToDrive
}) => {
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState<string>('');

  if (!isOpen) return null;

  const stages = [
    'All',
    'Stage 1: Problem Definition',
    'Stage 2: Customer Discovery',
    'Stage 3: Smoke Testing',
    'Stage 4: Unit Economics',
    'Stage 5: Go/No-Go Gate'
  ];

  const filteredItems =
    selectedStage === 'All'
      ? checklist
      : checklist.filter((item) => item.stage === selectedStage);

  const completedCount = checklist.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const handleStartEditingNote = (item: ChecklistItem) => {
    setEditingNoteId(item.id);
    setTempNoteText(item.notes || '');
  };

  const handleSaveNote = (id: string) => {
    onUpdateNotes(id, tempNoteText);
    setEditingNoteId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ListChecks className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  Validating a Business Idea: Actionable Checklist
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  5-Stage Framework
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                A tactical, step-by-step checklist to de-risk your startup before writing production code.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress & Stage Filters Bar */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Validation Progress:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                {completedCount} of {checklist.length} Completed ({progressPercent}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onExportToDrive}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Save to Google Drive</span>
              </button>
              <button
                type="button"
                onClick={onResetChecklist}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Reset Checklist"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Stage filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
            {stages.map((stage) => {
              const isSelected = selectedStage === stage;
              const stageCount =
                stage === 'All'
                  ? checklist.length
                  : checklist.filter((i) => i.stage === stage).length;
              const stageDone =
                stage === 'All'
                  ? completedCount
                  : checklist.filter((i) => i.stage === stage && i.completed).length;

              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setSelectedStage(stage)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <span>{stage.replace('Stage ', 'S').split(':')[0]}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {stageDone}/{stageCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Checklist Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                item.completed
                  ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => onToggleItem(item.id)}
                  className="mt-0.5 text-slate-300 hover:text-emerald-500 dark:text-slate-600 dark:hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-50 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.stage}
                    </span>
                    {item.completed && (
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Validated
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-sm font-bold transition-all ${
                      item.completed
                        ? 'text-slate-600 dark:text-slate-400 line-through'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.action}
                  </p>

                  {/* Pro Tip Box */}
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="leading-snug">
                      <span className="font-semibold">Pro Tip: </span>
                      {item.proTip}
                    </div>
                  </div>

                  {/* Falsifiable Metric Target */}
                  <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-900 dark:text-blue-200 text-xs flex items-start gap-2">
                    <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div className="leading-snug font-mono text-[11px]">
                      <span className="font-bold">Falsifiable Target: </span>
                      {item.falsifiableMetric}
                    </div>
                  </div>

                  {/* Notes / Discovery Evidence */}
                  <div className="pt-2">
                    {editingNoteId === item.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={tempNoteText}
                          onChange={(e) => setTempNoteText(e.target.value)}
                          placeholder="Record interview findings, verbatim quotes, or customer test metrics here..."
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                          rows={3}
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingNoteId(null)}
                            className="px-2.5 py-1 text-[11px] rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveNote(item.id)}
                            className="px-3 py-1 text-[11px] rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                          >
                            Save Evidence
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50 p-2 rounded-lg border border-slate-100 dark:border-slate-850">
                        <div className="truncate text-[11px] pr-2">
                          {item.notes ? (
                            <span className="text-slate-800 dark:text-slate-200">
                              <span className="font-bold">Evidence: </span>
                              {item.notes}
                            </span>
                          ) : (
                            <span className="italic text-slate-400">No notes recorded yet.</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleStartEditingNote(item)}
                          className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline shrink-0 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{item.notes ? 'Edit' : 'Add Note'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Tip: Complete Stage 1 & 2 before investing any money in software engineering.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
