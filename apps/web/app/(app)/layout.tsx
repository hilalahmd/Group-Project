"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Plus, Settings, Home, Layout, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Avatar } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Dropdown } from "../../components/ui/dropdown";
import { MOCK_WORKSPACES, MOCK_USERS, MOCK_BOARDS } from "../../lib/mock-data";
import { cn } from "../../lib/utils";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const pathname = usePathname();
  
  const currentUser = MOCK_USERS[0]; // Assuming Hilal is logged in
  const currentWorkspace = MOCK_WORKSPACES[0];
  const favoriteBoards = MOCK_BOARDS.filter(b => b.isFavorite);

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-100 shrink-0">
          {isSidebarOpen && (
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-slate-900">
              <div className="bg-slate-900 text-white rounded-md w-6 h-6 flex items-center justify-center text-xs">T</div>
              Taskio
            </Link>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-md hover:bg-slate-100 text-slate-500 transition-colors mx-auto"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            <Link href="/dashboard">
              <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                pathname === "/dashboard" ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}>
                <Home size={18} className="shrink-0" />
                {isSidebarOpen && <span>Dashboard</span>}
              </div>
            </Link>
          </nav>

          {isSidebarOpen && (
            <>
              <div className="mt-8 mb-2 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Workspaces
              </div>
              <div className="px-3 space-y-1">
                {MOCK_WORKSPACES.map(w => (
                  <div key={w.id} className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer">
                    <div className="w-6 h-6 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-medium shrink-0">
                      {w.name.charAt(0)}
                    </div>
                    <span className="truncate">{w.name}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 mb-2 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Favorite Boards
              </div>
              <div className="px-3 space-y-1">
                {favoriteBoards.map(b => (
                  <Link href={`/w/${currentWorkspace.slug}/b/${b.id}`} key={b.id}>
                    <div className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      pathname.includes(b.id) ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}>
                      <Layout size={18} className="shrink-0 text-slate-400" />
                      <span className="truncate">{b.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="p-4 border-t border-slate-100">
          <Dropdown
            trigger={
              <div className={cn("flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-md -mx-2 transition-colors", !isSidebarOpen && "justify-center mx-0")}>
                <Avatar initials={currentUser.initials} size="sm" />
                {isSidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                )}
              </div>
            }
          >
            <div className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer flex items-center gap-2">
              <Settings size={16} /> Settings
            </div>
            <div className="border-t border-slate-100 my-1" />
            <div className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer">
              Log out
            </div>
          </Dropdown>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex-1 flex items-center max-w-md">
            <Dropdown
              trigger={
                <div className="relative w-full cursor-text">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search boards, tasks..."
                    className="w-full h-9 pl-9 pr-4 rounded-md border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all cursor-text pointer-events-none"
                    readOnly
                  />
                </div>
              }
              align="left"
            >
              <div className="px-4 py-2 border-b border-slate-100">
                <input
                  type="text"
                  autoFocus
                  placeholder="Search boards, tasks..."
                  className="w-full text-sm outline-none placeholder:text-slate-400"
                />
              </div>
              <div className="py-2">
                <div className="px-4 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent Boards</div>
                <Link href={`/w/${MOCK_WORKSPACES[0].slug}/b/${MOCK_BOARDS[0].id}`} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  <div className="font-medium text-slate-900">{MOCK_BOARDS[0].title}</div>
                  <div className="text-xs text-slate-500">{MOCK_WORKSPACES[0].name}</div>
                </Link>
                <Link href={`/w/${MOCK_WORKSPACES[0].slug}/b/${MOCK_BOARDS[1].id}`} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  <div className="font-medium text-slate-900">{MOCK_BOARDS[1].title}</div>
                  <div className="text-xs text-slate-500">{MOCK_WORKSPACES[0].name}</div>
                </Link>
              </div>
            </Dropdown>
          </div>
          <div className="flex items-center gap-4 ml-4">
            
            <Dropdown
              trigger={
                <button className="text-slate-500 hover:text-slate-900 transition-colors relative mt-1" aria-label="Notifications">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
                </button>
              }
            >
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Notifications</h3>
                <span className="text-xs text-slate-500 cursor-pointer hover:text-slate-900">Mark all read</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                  <div className="text-sm text-slate-900"><span className="font-semibold">Vyshnav P</span> mentioned you in <span className="font-medium">Setup Next.js project</span></div>
                  <div className="text-xs text-slate-500 mt-1">2 hours ago</div>
                </div>
                <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer">
                  <div className="text-sm text-slate-900"><span className="font-semibold">Afra</span> assigned you to <span className="font-medium">Design minimal landing page</span></div>
                  <div className="text-xs text-slate-500 mt-1">5 hours ago</div>
                </div>
              </div>
              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <span className="text-xs font-medium text-slate-600 cursor-pointer hover:text-slate-900">View all</span>
              </div>
            </Dropdown>

            <Dropdown
              trigger={
                <Button variant="danger" size="sm" className="gap-1 rounded-full px-4 font-semibold shadow-sm">
                  <Plus size={16} />
                  Create
                </Button>
              }
            >
              <div className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-2 font-medium">
                <Layout size={16} className="text-slate-400" /> Create Board
              </div>
              <div className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-2 font-medium">
                <Users size={16} className="text-slate-400" /> Create Workspace
              </div>
            </Dropdown>
            
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto relative">
          {children}
        </div>
      </main>
    </div>
  );
}
