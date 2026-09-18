"use client";

import React from "react";
import Link from "next/link";
import { Users, Plus, Settings } from "lucide-react";
import { MOCK_WORKSPACES } from "@/lib/mock-data";
import { Button } from "../../../components/ui/button";

export default function WorkspacesPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Workspaces</h1>
          <p className="text-slate-500">Manage all the workspaces you belong to.</p>
        </div>
        <Button variant="primary" className="gap-2 shadow-sm font-semibold">
          <Plus size={18} />
          New Workspace
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_WORKSPACES.map((workspace) => (
          <div key={workspace.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col">
            <div className="h-20 bg-gradient-to-r from-slate-800 to-slate-900 flex items-center justify-center">
               <div className="w-14 h-14 rounded-xl bg-white text-slate-900 flex items-center justify-center font-bold text-3xl shadow-sm mt-10">
                 {workspace.name.charAt(0)}
               </div>
            </div>
            
            <div className="p-6 pt-10 flex-1 flex flex-col">
              <h2 className="text-xl font-bold text-slate-900 text-center mb-1">{workspace.name}</h2>
              <p className="text-sm text-slate-500 text-center mb-6">{workspace.members.length} members</p>
              
              <div className="mt-auto space-y-3">
                <Link href={`/w/${workspace.slug}`}>
                  <Button variant="outline" className="w-full justify-center font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border-slate-200">
                    Open Workspace
                  </Button>
                </Link>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 justify-center gap-2 text-slate-600 border-slate-200">
                    <Users size={16} /> Members
                  </Button>
                  <Button variant="outline" className="px-3 text-slate-600 border-slate-200">
                    <Settings size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
