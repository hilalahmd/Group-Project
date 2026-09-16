"use client";

import React, { useState } from 'react';
import { BoardItem, boardApi } from '../../../lib/api';

interface TemplatePreviewModalProps {
  template: BoardItem | null;
  onClose: () => void;
  onBoardCreated: (newBoardId: string | number) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  onClose,
  onBoardCreated
}) => {
  const [boardName, setBoardName] = useState(template?.name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!template) return null;

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardName.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const newBoard = await boardApi.applyTemplate({
        templateId: template.id,
        name: boardName.trim()
      });

      if (newBoard) {
        onBoardCreated(newBoard.id);
        onClose();
      }
    } catch (err: any) {
      console.error('Failed to apply template:', err);
      setError(err?.response?.data?.message || 'Failed to apply template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-800 bg-[#121214] text-white shadow-2xl">
        
        {/* Header Cover Bar */}
        <div className={`relative h-28 w-full bg-gradient-to-r ${template.coverColor || 'from-zinc-800 to-black'} p-6 flex items-end justify-between`}>
          <div className="z-10">
            <span className="inline-block rounded bg-white/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md mb-1 border border-white/20">
              {template.category || 'Template'}
            </span>
            <h2 className="text-2xl font-black text-white drop-shadow-md">
              {template.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-zinc-300 hover:bg-black/80 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Description */}
          {template.description && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                About this template
              </h4>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {template.description}
              </p>
            </div>
          )}

          {/* List Structure Preview */}
          {template.lists && template.lists.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                Included Lists ({template.lists.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {template.lists.map((list) => (
                  <div
                    key={list.id}
                    className="rounded-xl border border-zinc-800 bg-[#18181b] p-3 space-y-2"
                  >
                    <div className="font-semibold text-xs text-white border-b border-zinc-800 pb-2 flex justify-between items-center">
                      <span>{list.name}</span>
                      <span className="text-[10px] text-zinc-500">{list.cards?.length || 0} cards</span>
                    </div>
                    <div className="space-y-1.5">
                      {list.cards?.slice(0, 3).map((card) => (
                        <div
                          key={card.id}
                          className="rounded-md bg-zinc-900 border border-zinc-800 p-2 text-xs text-zinc-300 shadow-sm"
                        >
                          {card.title}
                        </div>
                      ))}
                      {list.cards && list.cards.length > 3 && (
                        <div className="text-[10px] text-zinc-500 italic text-center">
                          +{list.cards.length - 3} more cards
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-950/60 border border-red-800/80 p-3 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleApply} className="space-y-4 pt-2 border-t border-zinc-800">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                New Board Title
              </label>
              <input
                type="text"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                placeholder="e.g. My Project Sprint"
                required
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !boardName.trim()}
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-black hover:bg-zinc-200 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    Applying...
                  </>
                ) : (
                  'Create Board from Template'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;
