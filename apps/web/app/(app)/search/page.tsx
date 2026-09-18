"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Layout, CheckSquare, Clock } from "lucide-react";
import { MOCK_BOARDS, MOCK_WORKSPACES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const lowercaseQuery = query.toLowerCase();

  // Very basic search logic for mock data
  const boardResults = query 
    ? MOCK_BOARDS.filter(b => b.title.toLowerCase().includes(lowercaseQuery))
    : [];

  const cardResults = query
    ? MOCK_BOARDS.flatMap(b => b.lists.flatMap(l => l.cards)).filter(c => 
        c.title.toLowerCase().includes(lowercaseQuery) || 
        c.description?.toLowerCase().includes(lowercaseQuery)
      )
    : [];

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <Search size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Search Taskio</h2>
        <p className="text-slate-500 max-w-sm">
          Enter a keyword to search across all your boards, cards, and workspaces.
        </p>
      </div>
    );
  }

  const hasResults = boardResults.length > 0 || cardResults.length > 0;

  if (!hasResults) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <Search size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">No results found</h2>
        <p className="text-slate-500 max-w-sm">
          We couldn't find anything matching "{query}". Try different keywords.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Board Results */}
      {boardResults.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 text-slate-700">
            <Layout size={20} className="text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Boards</h2>
            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full ml-2">
              {boardResults.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {boardResults.map((board) => {
              const workspace = MOCK_WORKSPACES.find(w => w.id === board.workspaceId);
              const bgStyle = board.background?.type === 'image'
                ? { backgroundImage: `url(${board.background.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : board.background?.type === 'color' ? undefined : { backgroundColor: '#f1f5f9' };
              const bgClass = board.background?.type === 'color' ? board.background.value : "";

              return (
                <Link key={board.id} href={`/w/${workspace?.slug}/b/${board.id}`}>
                  <div 
                    className={cn("h-24 rounded-xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5", bgClass)}
                    style={bgStyle}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                      <div className="font-bold text-white text-sm drop-shadow-sm line-clamp-2">{board.title}</div>
                      <div className="text-xs text-white/80 font-medium drop-shadow-sm">{workspace?.name}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Card Results */}
      {cardResults.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 text-slate-700">
            <CheckSquare size={20} className="text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Cards</h2>
            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full ml-2">
              {cardResults.length}
            </span>
          </div>
          <div className="space-y-3">
            {cardResults.map((card) => (
              <Link key={card.id} href={`/c/${card.id}`}>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex gap-4 items-start">
                  {card.coverImageUrl && (
                    <div 
                      className="w-16 h-12 rounded-md bg-cover bg-center shrink-0" 
                      style={{ backgroundImage: `url(${card.coverImageUrl})` }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 truncate mb-1">{card.title}</h3>
                    {card.description && (
                      <p className="text-sm text-slate-500 line-clamp-1 mb-2">{card.description}</p>
                    )}
                    <div className="flex items-center gap-3">
                      {card.labels.map(l => (
                         <span key={l.id} className={cn("text-[10px] font-bold px-2 py-0.5 rounded shrink-0", l.color)}>
                           {l.name}
                         </span>
                      ))}
                      {card.dueDate && (
                        <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                           <Clock size={12} />
                           {new Date(card.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Search Results</h1>
      </div>
      
      <Suspense fallback={<div className="py-12 text-center text-slate-500 font-medium">Searching...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
