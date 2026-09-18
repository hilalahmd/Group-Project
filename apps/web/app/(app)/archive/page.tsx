"use client";

import React, { useState } from "react";
import { Archive, Layout, CheckSquare, List, RotateCcw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../../../components/ui/button";

type Tab = "boards" | "lists" | "cards";

const MOCK_ARCHIVED_BOARDS = [
  { id: "b-arch-1", title: "2024 Q1 Planning", archivedAt: "2 months ago", workspace: "Acme Corp" },
  { id: "b-arch-2", title: "Old Website Redesign", archivedAt: "5 months ago", workspace: "Acme Corp" },
];

const MOCK_ARCHIVED_LISTS = [
  { id: "l-arch-1", title: "On Hold", archivedAt: "3 weeks ago", board: "Product Roadmap" },
];

const MOCK_ARCHIVED_CARDS = [
  { id: "c-arch-1", title: "Review old pull requests", archivedAt: "2 days ago", board: "Product Roadmap", list: "To Do" },
  { id: "c-arch-2", title: "Update dependency versions", archivedAt: "1 week ago", board: "Product Roadmap", list: "Done" },
];

export default function ArchivePage() {
  const [activeTab, setActiveTab] = useState<Tab>("cards");
  
  // State for mocked data so we can visually "restore" or "delete" them
  const [archivedBoards, setArchivedBoards] = useState(MOCK_ARCHIVED_BOARDS);
  const [archivedLists, setArchivedLists] = useState(MOCK_ARCHIVED_LISTS);
  const [archivedCards, setArchivedCards] = useState(MOCK_ARCHIVED_CARDS);

  const handleAction = (type: Tab, id: string, action: 'restore' | 'delete') => {
    if (type === 'boards') {
      setArchivedBoards(prev => prev.filter(item => item.id !== id));
    } else if (type === 'lists') {
      setArchivedLists(prev => prev.filter(item => item.id !== id));
    } else if (type === 'cards') {
      setArchivedCards(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500">
          <Archive size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Archive</h1>
          <p className="text-slate-500">View and manage your archived items across all workspaces.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200/50 p-1 rounded-xl w-fit mb-8">
        <button
          onClick={() => setActiveTab("cards")}
          className={cn(
            "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
            activeTab === "cards" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
          )}
        >
          <CheckSquare size={16} /> Cards
          <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs">{archivedCards.length}</span>
        </button>
        <button
          onClick={() => setActiveTab("lists")}
          className={cn(
            "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
            activeTab === "lists" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
          )}
        >
          <List size={16} /> Lists
          <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs">{archivedLists.length}</span>
        </button>
        <button
          onClick={() => setActiveTab("boards")}
          className={cn(
            "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
            activeTab === "boards" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
          )}
        >
          <Layout size={16} /> Boards
          <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs">{archivedBoards.length}</span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Cards Tab */}
        {activeTab === "cards" && (
          <div className="divide-y divide-slate-100">
            {archivedCards.length === 0 && (
              <div className="p-12 text-center text-slate-500 font-medium">No archived cards.</div>
            )}
            {archivedCards.map(card => (
              <div key={card.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <CheckSquare size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-[15px]">{card.title}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Archived {card.archivedAt} • in list <span className="text-slate-700">{card.list}</span> on <span className="text-slate-700">{card.board}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="sm" className="h-8 text-xs font-semibold" onClick={() => handleAction('cards', card.id, 'restore')}>
                    <RotateCcw size={14} className="mr-1.5" /> Restore
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100" onClick={() => handleAction('cards', card.id, 'delete')}>
                    <Trash2 size={14} className="mr-1.5" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lists Tab */}
        {activeTab === "lists" && (
          <div className="divide-y divide-slate-100">
            {archivedLists.length === 0 && (
              <div className="p-12 text-center text-slate-500 font-medium">No archived lists.</div>
            )}
            {archivedLists.map(list => (
              <div key={list.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <List size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-[15px]">{list.title}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Archived {list.archivedAt} • on <span className="text-slate-700">{list.board}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="sm" className="h-8 text-xs font-semibold" onClick={() => handleAction('lists', list.id, 'restore')}>
                    <RotateCcw size={14} className="mr-1.5" /> Restore
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100" onClick={() => handleAction('lists', list.id, 'delete')}>
                    <Trash2 size={14} className="mr-1.5" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Boards Tab */}
        {activeTab === "boards" && (
          <div className="divide-y divide-slate-100">
            {archivedBoards.length === 0 && (
              <div className="p-12 text-center text-slate-500 font-medium">No archived boards.</div>
            )}
            {archivedBoards.map(board => (
              <div key={board.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Layout size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-[15px]">{board.title}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Archived {board.archivedAt} • in workspace <span className="text-slate-700">{board.workspace}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="sm" className="h-8 text-xs font-semibold" onClick={() => handleAction('boards', board.id, 'restore')}>
                    <RotateCcw size={14} className="mr-1.5" /> Restore
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100" onClick={() => handleAction('boards', board.id, 'delete')}>
                    <Trash2 size={14} className="mr-1.5" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
