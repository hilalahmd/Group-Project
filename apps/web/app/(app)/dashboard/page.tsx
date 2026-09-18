import * as React from "react";
import Link from "next/link";
import { Layout, Clock, Star, Users } from "lucide-react";
import { MOCK_WORKSPACES, MOCK_BOARDS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const recentBoards = MOCK_BOARDS.slice(0, 3);
  const favoriteBoards = MOCK_BOARDS.filter((b) => b.isFavorite);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back!</h1>
        <p className="text-slate-500">Here's what's happening across your workspaces.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content (2/3 width) */}
        <div className="md:col-span-2 space-y-10">
          
          {/* Favorite Boards */}
          {favoriteBoards.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4 text-slate-700">
                <Star size={20} className="text-slate-400" />
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">Favorites</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {favoriteBoards.map((board) => {
                  const workspace = MOCK_WORKSPACES.find(w => w.id === board.workspaceId);
                  
                  const bgStyle = board.background?.type === 'color' 
                    ? { backgroundColor: board.background.value.replace('bg-', '') }
                    : board.background?.type === 'image'
                    ? { backgroundImage: `url(${board.background.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : { backgroundColor: '#f1f5f9' };

                  const bgClass = board.background?.type === 'color' ? board.background.value : "";

                  return (
                    <Link key={board.id} href={`/w/${workspace?.slug}/b/${board.id}`}>
                      <div 
                        className={cn("h-28 rounded-xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5", bgClass)}
                        style={bgStyle}
                      >
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                        
                        <div className="absolute inset-0 p-4 flex flex-col justify-between">
                          <div className="font-bold text-white text-base drop-shadow-sm line-clamp-2">{board.title}</div>
                          <div className="text-xs text-white/80 font-medium drop-shadow-sm">{workspace?.name}</div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Recent Boards */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-slate-700">
              <Clock size={20} className="text-slate-400" />
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Recently Viewed</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recentBoards.map((board) => {
                const workspace = MOCK_WORKSPACES.find(w => w.id === board.workspaceId);
                
                const bgStyle = board.background?.type === 'color' 
                  ? { backgroundColor: board.background.value.replace('bg-', '') }
                  : board.background?.type === 'image'
                  ? { backgroundImage: `url(${board.background.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : { backgroundColor: '#f1f5f9' };

                const bgClass = board.background?.type === 'color' ? board.background.value : "";

                return (
                  <Link key={board.id} href={`/w/${workspace?.slug}/b/${board.id}`}>
                    <div 
                      className={cn("h-28 rounded-xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5", bgClass)}
                      style={bgStyle}
                    >
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                      
                      <div className="absolute inset-0 p-4 flex flex-col justify-between">
                        <div className="font-bold text-white text-base drop-shadow-sm line-clamp-2">{board.title}</div>
                        <div className="text-xs text-white/80 font-medium drop-shadow-sm">{workspace?.name}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sidebar / Workspaces (1/3 width) */}
        <div className="space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-700">
                <Users size={20} className="text-slate-400" />
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">Your Workspaces</h2>
              </div>
            </div>
            <div className="space-y-3">
              {MOCK_WORKSPACES.map((workspace) => (
                <div key={workspace.id} className="rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 overflow-hidden">
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      {workspace.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 truncate">{workspace.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{workspace.members.length} members</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
                     <Link href={`/w/${workspace.slug}`} className="block text-center py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
                       Open Workspace
                     </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
