"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Layout, Plus, Users, Settings } from "lucide-react";
import { MOCK_WORKSPACES, MOCK_BOARDS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { CreateBoardModal } from "@/components/ui/create-board-modal";

export default function WorkspacePage() {
  const params = useParams();
  const slug = params.workspaceSlug as string;
  
  const workspace = MOCK_WORKSPACES.find((w) => w.slug === slug);
  const boards = MOCK_BOARDS.filter((b) => b.workspaceId === workspace?.id);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = React.useState(false);

  if (!workspace) {
    return <div className="p-8 text-slate-500">Workspace not found.</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Workspace Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-3xl">
            {workspace.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{workspace.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Users size={16} /> {workspace.members.length} members</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-2">
            {workspace.members.slice(0, 5).map(member => (
               <Avatar key={member.id} initials={member.initials} size="md" className="ring-white ring-2" title={member.name} />
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-2 font-medium">
            <Plus size={16} /> Invite
          </Button>
          <Button variant="ghost" size="sm" className="px-2">
            <Settings size={20} className="text-slate-500" />
          </Button>
        </div>
      </div>

      {/* Boards Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Layout size={24} className="text-slate-900" />
          <h2 className="text-xl font-bold text-slate-900">Boards</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Create New Board Card */}
          <button 
            className="h-32 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400 transition-all flex flex-col items-center justify-center gap-2 text-slate-600 group"
            onClick={() => setIsCreateBoardOpen(true)}
          >
             <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center group-hover:bg-slate-300 group-hover:text-slate-900 transition-colors">
               <Plus size={18} />
             </div>
             <span className="font-medium text-sm group-hover:text-slate-900 transition-colors">Create new board</span>
          </button>

          {/* Existing Boards */}
          {boards.map((board) => (
            <Link key={board.id} href={`/w/${workspace.slug}/b/${board.id}`}>
              <div className="h-32 rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-sm transition-all group flex flex-col justify-between">
                <div className="font-semibold text-slate-900 group-hover:text-red-700 transition-colors">
                  {board.title}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                   <span>{board.lists.length} lists</span>
                   <div className="flex -space-x-1">
                     {board.members.slice(0, 3).map(user => (
                        <Avatar key={user.id} initials={user.initials} size="sm" className="ring-white ring-2 h-5 w-5 text-[10px]" />
                     ))}
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Modals */}
      <CreateBoardModal isOpen={isCreateBoardOpen} onClose={() => setIsCreateBoardOpen(false)} />
    </div>
  );
}
