"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BoardItem, boardApi } from '../../../lib/api';

export default function BoardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.id as string;

  const [board, setBoard] = useState<BoardItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // New list state
  const [showAddList, setShowAddList] = useState<boolean>(false);
  const [newListTitle, setNewListTitle] = useState<string>('');

  // New card state per list
  const [activeListId, setActiveListId] = useState<string | number | null>(null);
  const [newCardTitle, setNewCardTitle] = useState<string>('');

  const loadBoard = async () => {
    if (!boardId) return;
    setLoading(true);
    try {
      const data = await boardApi.getBoardById(boardId);
      if (data) {
        setBoard(data);
      } else {
        setError('Board not found.');
      }
    } catch (err) {
      console.error('Error fetching board:', err);
      setError('Failed to load board details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  const handleAddList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim() || !board) return;

    try {
      const created = await boardApi.createList(board.id, newListTitle.trim());
      if (created) {
        setNewListTitle('');
        setShowAddList(false);
        loadBoard();
      }
    } catch (err) {
      console.error('Failed to add list:', err);
    }
  };

  const handleAddCard = async (e: React.FormEvent, listId: string | number) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    try {
      const created = await boardApi.createCard(listId, newCardTitle.trim());
      if (created) {
        setNewCardTitle('');
        setActiveListId(null);
        loadBoard();
      }
    } catch (err) {
      console.error('Failed to add card:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#18181b] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
          <span className="text-xs font-semibold text-zinc-400">Loading Board...</span>
        </div>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#18181b] text-white gap-4">
        <h2 className="text-xl font-bold text-red-400">{error || 'Board not found'}</h2>
        <button
          onClick={() => router.push('/boards')}
          className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-black hover:bg-zinc-200 transition"
        >
          ← Back to Boards Hub
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#121214] text-zinc-100 font-sans antialiased overflow-hidden">
      
      {/* Board Navbar */}
      <header
        className={`flex h-14 items-center justify-between border-b border-zinc-800/80 ${
          board.coverImage ? 'bg-cover bg-center' : `bg-gradient-to-r ${board.coverColor || 'from-zinc-900 to-black'}`
        } px-6 backdrop-blur-md relative`}
        style={board.coverImage ? { backgroundImage: `url(${board.coverImage})` } : undefined}
      >
        {board.coverImage && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        )}
        <div className="relative z-10 flex items-center gap-4">
          <button
            onClick={() => router.push('/boards')}
            className="flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 text-xs font-bold text-white hover:bg-black/70 transition border border-white/10"
          >
            ← Boards Hub
          </button>

          <div className="h-4 w-px bg-white/20" />

          <h1 className="text-lg font-bold text-white drop-shadow">
            {board.name}
          </h1>

          {board.category && (
            <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white border border-white/10">
              {board.category}
            </span>
          )}
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => setShowAddList(true)}
            className="rounded-lg bg-white px-3.5 py-1.5 text-xs font-bold text-black hover:bg-zinc-200 transition shadow-md"
          >
            + Add List
          </button>
        </div>
      </header>

      {/* Board Canvas */}
      <main className="flex-1 overflow-x-auto p-6 bg-[#18181b]">
        <div className="flex h-full items-start gap-4">
          
          {/* Lists */}
          {board.lists && board.lists.map((list) => (
            <div
              key={list.id}
              className="flex w-72 max-h-full flex-col rounded-2xl border border-zinc-800 bg-[#121214] shadow-xl shrink-0"
            >
              {/* List Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800/60">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  {list.name}
                </h3>
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-400">
                  {list.cards?.length || 0}
                </span>
              </div>

              {/* Cards Scroll Container */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {list.cards && list.cards.length > 0 ? (
                  list.cards.map((card) => (
                    <div
                      key={card.id}
                      className="group relative rounded-xl border border-zinc-800 bg-[#18181b] p-3 shadow-md transition-all duration-200 hover:border-zinc-600 hover:shadow-lg"
                    >
                      <h4 className="text-xs font-semibold text-white group-hover:text-zinc-200">
                        {card.title}
                      </h4>
                      {card.description && (
                        <p className="mt-1 text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                          {card.description}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-zinc-600 italic">
                    No cards in this list
                  </div>
                )}
              </div>

              {/* Add Card Footer */}
              <div className="p-3 border-t border-zinc-800/60">
                {activeListId === list.id ? (
                  <form onSubmit={(e) => handleAddCard(e, list.id)} className="space-y-2">
                    <input
                      type="text"
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                      placeholder="Enter card title..."
                      autoFocus
                      required
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-white"
                    />
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setActiveListId(null)}
                        className="rounded-lg px-2.5 py-1 text-xs text-zinc-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-lg bg-white px-3 py-1 text-xs font-bold text-black hover:bg-zinc-200"
                      >
                        Add Card
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => {
                      setActiveListId(list.id);
                      setNewCardTitle('');
                    }}
                    className="flex w-full items-center gap-2 rounded-xl p-2 text-xs font-medium text-zinc-400 hover:bg-zinc-800/80 hover:text-white transition"
                  >
                    <span>+</span> Add a card
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add List Column */}
          {showAddList ? (
            <div className="w-72 rounded-2xl border border-zinc-700 bg-[#121214] p-4 shadow-xl shrink-0">
              <form onSubmit={handleAddList} className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Add New List
                </h4>
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="Enter list title..."
                  autoFocus
                  required
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-white"
                />
                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddList(false)}
                    className="rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-white px-3.5 py-1.5 text-xs font-bold text-black hover:bg-zinc-200"
                  >
                    Add List
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button
              onClick={() => setShowAddList(true)}
              className="flex h-12 w-72 items-center gap-2 rounded-2xl border border-dashed border-zinc-800 bg-[#121214]/60 px-4 text-xs font-semibold text-zinc-400 hover:border-zinc-600 hover:bg-[#121214] hover:text-white transition shrink-0"
            >
              <span>+</span> Add another list
            </button>
          )}

        </div>
      </main>

    </div>
  );
}
