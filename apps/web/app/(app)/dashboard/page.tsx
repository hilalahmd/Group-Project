import * as React from "react";
import Link from "next/link";
import { Layout, Clock, Star, Users } from "lucide-react";
import { MOCK_WORKSPACES, MOCK_BOARDS } from "../../../lib/mock-data";

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
                <h2 className="text-lg font-semibold">Favorites</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteBoards.map((board) => {
                  const workspace = MOCK_WORKSPACES.find(w => w.id === board.workspaceId);
                  return (
                    <Link key={board.id} href={`/w/${workspace?.slug}/b/${board.id}`}>
                      <div className="h-24 rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-sm transition-all group flex flex-col justify-between">
                        <div className="font-semibold text-slate-900 group-hover:text-red-700 transition-colors">{board.title}</div>
                        <div className="text-xs text-slate-500">{workspace?.name}</div>
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
              <h2 className="text-lg font-semibold">Recently Viewed</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentBoards.map((board) => {
                const workspace = MOCK_WORKSPACES.find(w => w.id === board.workspaceId);
                return (
                  <Link key={board.id} href={`/w/${workspace?.slug}/b/${board.id}`}>
                    <div className="h-24 rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-sm transition-all group flex flex-col justify-between">
                      <div className="font-semibold text-slate-900 group-hover:text-red-700 transition-colors">{board.title}</div>
                      <div className="text-xs text-slate-500">{workspace?.name}</div>
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
            <div className="flex items-center gap-2 mb-4 text-slate-700">
              <Users size={20} className="text-slate-400" />
              <h2 className="text-lg font-semibold">Your Workspaces</h2>
            </div>
            <div className="space-y-3">
              {MOCK_WORKSPACES.map((workspace) => (
                <div key={workspace.id} className="rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-lg">
                      {workspace.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{workspace.name}</h3>
                      <p className="text-xs text-slate-500">{workspace.members.length} members</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex gap-2">
                     <Link href="#" className="flex-1 text-center py-1.5 text-xs font-medium text-slate-600 bg-slate-50 rounded hover:bg-slate-100 transition-colors">
                       View Boards
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
