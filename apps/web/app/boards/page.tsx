"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BoardItem, boardApi } from '../../lib/api';
import TemplateCard from './components/TemplateCard';
import TemplatePreviewModal from './components/TemplatePreviewModal';
import CreateBoardModal from './components/CreateBoardModal';

export default function BoardsPage() {
  const router = useRouter();

  // State
  const [templates, setTemplates] = useState<BoardItem[]>([]);
  const [userBoards, setUserBoards] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('choose a category');
  const [sortBy, setSortBy] = useState<string>('Most recently active');
  const [filterCollection, setFilterCollection] = useState<string>('Choose a collection');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [previewTemplate, setPreviewTemplate] = useState<BoardItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Initial Data Fetching
  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedTemplates, fetchedBoards] = await Promise.all([
        boardApi.getTemplates({
          category: selectedCategory !== 'choose a category' ? selectedCategory : undefined,
          search: searchQuery.trim() || undefined
        }),
        boardApi.getBoards({
          search: searchQuery.trim() || undefined,
          sort: sortBy === 'Alphabetical (A-Z)' ? 'name' : sortBy === 'Newest' ? 'created' : 'recent'
        })
      ]);

      setTemplates(fetchedTemplates);
      setUserBoards(fetchedBoards);
    } catch (err) {
      console.error('Failed to load boards/templates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, sortBy, searchQuery]);

  const handleBoardCreated = (boardId: string | number) => {
    router.push(`/boards/${boardId}`);
  };

  return (
    <div className="min-h-screen bg-[#18181b] text-zinc-100 font-sans antialiased selection:bg-white selection:text-black">
      
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-zinc-800 bg-[#121214]/90 px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white font-black text-xs text-black">
            📋
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">
            Boards
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-xs font-bold text-black hover:bg-zinc-200 transition shadow-sm"
          >
            <span>+</span> Create Board
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">

        {/* ================= SECTION 1: MOST POPULAR TEMPLATES ================= */}
        <section className="rounded-2xl border border-zinc-800/80 bg-[#121214] p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-zinc-800/60 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Most popular templates
                </h2>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                <span>Get going faster with a template from the Trello community or</span>
                
                {/* Category Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-200 outline-none focus:border-white focus:ring-1 focus:ring-white transition cursor-pointer"
                >
                  <option value="choose a category">choose a category</option>
                  <option value="Personal & Productivity">Personal & Productivity</option>
                  <option value="HR & Operations">HR & Operations</option>
                  <option value="Engineering & Product">Engineering & Product</option>
                  <option value="Project Management">Project Management</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setSelectedCategory('choose a category')}
              className="hidden sm:flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white transition"
              title="Clear Category Filter"
            >
              ✕
            </button>
          </div>

          {/* Template Cards Grid */}
          {loading && templates.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-44 rounded-xl border border-zinc-800 bg-zinc-900/50" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={(tpl) => setPreviewTemplate(tpl)}
                />
              ))}
            </div>
          )}

          {/* Footer Gallery Link */}
          <div className="mt-5">
            <button
              onClick={() => setSelectedCategory('choose a category')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline transition inline-flex items-center gap-1"
            >
              Browse the full template gallery →
            </button>
          </div>
        </section>

        {/* ================= SECTION 2: SEARCH, SORT & FILTER BAR ================= */}
        <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 py-2">
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Sort by */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-48 rounded-xl border border-zinc-700 bg-[#121214] px-3.5 py-2 text-xs font-medium text-white outline-none focus:border-white focus:ring-1 focus:ring-white transition cursor-pointer"
              >
                <option value="Most recently active">Most recently active</option>
                <option value="Alphabetical (A-Z)">Alphabetical (A-Z)</option>
                <option value="Newest">Newest</option>
              </select>
            </div>

            {/* Filter by */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Filter by
              </label>
              <select
                value={filterCollection}
                onChange={(e) => setFilterCollection(e.target.value)}
                className="w-48 rounded-xl border border-zinc-700 bg-[#121214] px-3.5 py-2 text-xs font-medium text-white outline-none focus:border-white focus:ring-1 focus:ring-white transition cursor-pointer"
              >
                <option value="Choose a collection">Choose a collection</option>
                <option value="Workspace Boards">Workspace Boards</option>
                <option value="Personal Boards">Personal Boards</option>
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Search
            </label>
            <div className="relative w-full md:w-64">
              <span className="absolute inset-y-0 left-3 flex items-center text-zinc-500 text-xs">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search boards"
                className="w-full rounded-xl border border-zinc-700 bg-[#121214] pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-3 flex items-center text-xs text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

        </section>

        {/* ================= SECTION 3: USER BOARDS GRID ================= */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Tile 1: Create New Board Tile */}
            <div
              onClick={() => setShowCreateModal(true)}
              className="group relative flex h-36 flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-800 bg-[#121214] p-4 text-center cursor-pointer transition-all duration-300 hover:border-zinc-500 hover:bg-zinc-900/60"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 group-hover:bg-white group-hover:text-black transition-colors mb-2">
                +
              </div>
              <span className="text-xs font-semibold text-zinc-300 group-hover:text-white">
                Create new board
              </span>
            </div>

            {/* Tile N: User Created Boards */}
            {userBoards.map((board) => (
              <div
                key={board.id}
                onClick={() => router.push(`/boards/${board.id}`)}
                className="group relative flex h-36 flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-[#121214] p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-zinc-500 hover:shadow-xl hover:shadow-white/5"
              >
                {/* Board cover background accent */}
                {board.coverImage ? (
                  <div
                    className="absolute inset-x-0 top-0 h-16 bg-cover bg-center opacity-90 transition-opacity group-hover:opacity-100"
                    style={{ backgroundImage: `url(${board.coverImage})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-black/30" />
                  </div>
                ) : (
                  <div
                    className={`absolute inset-x-0 top-0 h-16 bg-gradient-to-r ${board.coverColor || 'from-purple-700 to-indigo-900'} opacity-90 transition-opacity group-hover:opacity-100`}
                  />
                )}
                
                <div className="relative z-10 pt-10">
                  <h3 className="font-bold text-sm text-white group-hover:text-zinc-200 line-clamp-1">
                    {board.name}
                  </h3>
                  {board.description && (
                    <p className="mt-0.5 text-[11px] text-zinc-400 line-clamp-1">
                      {board.description}
                    </p>
                  )}
                </div>

                <div className="relative z-10 flex items-center justify-between border-t border-zinc-800/80 pt-2 text-[10px] font-medium text-zinc-500">
                  <span>Workspace Board</span>
                  <span className="text-xs">→</span>
                </div>
              </div>
            ))}

          </div>
        </section>

      </main>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onBoardCreated={handleBoardCreated}
        />
      )}

      {/* Create Blank Board Modal */}
      {showCreateModal && (
        <CreateBoardModal
          onClose={() => setShowCreateModal(false)}
          onBoardCreated={handleBoardCreated}
        />
      )}

    </div>
  );
}
