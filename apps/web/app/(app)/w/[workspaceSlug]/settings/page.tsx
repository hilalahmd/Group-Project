"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Users, Settings, Trash2, Edit3, ChevronDown } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Avatar } from "../../../../../components/ui/avatar";
import { Dropdown } from "../../../../../components/ui/dropdown";
import { MOCK_WORKSPACES } from "../../../../../lib/mock-data";

export default function WorkspaceSettingsPage() {
  const params = useParams();
  const slug = params.workspaceSlug as string;
  const workspace = MOCK_WORKSPACES.find((w) => w.slug === slug);

  if (!workspace) return <div className="p-8 text-slate-500">Workspace not found.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Workspace Settings</h1>
        <p className="text-slate-500 mt-1">Manage {workspace.name} members, roles, and preferences.</p>
      </div>

      {/* General Settings */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <Settings size={20} className="text-slate-900" />
          <h2 className="text-lg font-bold text-slate-900">General</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-900">Workspace Name</label>
            <Input defaultValue={workspace.name} className="max-w-md" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-900">Workspace Slug</label>
            <div className="flex max-w-md">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-200 bg-slate-50 text-slate-500 sm:text-sm">
                taskio.com/w/
              </span>
              <Input defaultValue={workspace.slug} className="rounded-l-none" />
            </div>
            <p className="text-xs text-slate-500">Used in URLs. Changing this might break existing links.</p>
          </div>
          <Button variant="primary" className="mt-4">Save General Settings</Button>
        </div>
      </div>

      {/* Members */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-slate-900" />
            <h2 className="text-lg font-bold text-slate-900">Members</h2>
          </div>
          <Button variant="primary" size="sm">Invite Member</Button>
        </div>
        <div className="divide-y divide-slate-100">
          {workspace.members.map((member, i) => (
            <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar initials={member.initials} size="md" />
                <div>
                  <div className="font-medium text-slate-900">{member.name} {i === 0 && <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">You</span>}</div>
                  <div className="text-xs text-slate-500">{member.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Dropdown
                  trigger={
                    <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100">
                      {i === 0 ? "Admin" : "Member"} <ChevronDown size={14} />
                    </button>
                  }
                >
                  <div className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer">Admin</div>
                  <div className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer">Member</div>
                </Dropdown>
                {i !== 0 && (
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2">
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white border border-red-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 bg-red-50/30">
          <div className="flex items-center gap-2 mb-2 text-red-700">
            <Trash2 size={20} />
            <h2 className="text-lg font-bold">Danger Zone</h2>
          </div>
          <p className="text-sm text-slate-600 mb-6">
            Deleting this workspace is permanent. All boards, lists, and cards will be destroyed.
          </p>
          <Button variant="danger">Delete Workspace</Button>
        </div>
      </div>
    </div>
  );
}
