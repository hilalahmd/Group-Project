import * as React from "react";
import { User, Lock, Mail, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { MOCK_USERS } from "@/lib/mock-data";

export default function UserSettingsPage() {
  const currentUser = MOCK_USERS[0] || { name: "User", email: "user@example.com", initials: "U" };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-500 mt-1">Manage your profile and account security.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-6 md:items-center">
          <div className="relative group">
            <Avatar initials={currentUser.initials} size="lg" className="w-24 h-24 text-2xl" />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
              <Camera size={24} />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Profile Picture</h3>
            <p className="text-sm text-slate-500 mt-1 mb-3">Upload a new avatar. Max 2MB.</p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">Upload new</Button>
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">Remove</Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <User size={16} className="text-slate-500" /> Full Name
            </label>
            <Input defaultValue={currentUser.name} className="max-w-md" />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Mail size={16} className="text-slate-500" /> Email Address
            </label>
            <Input defaultValue={currentUser.email} type="email" className="max-w-md" />
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Save Changes</Button>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={20} className="text-slate-900" />
            <h3 className="text-lg font-bold text-slate-900">Security</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Update your password to keep your account secure.
          </p>
          <Button variant="secondary">Change Password</Button>
        </div>
      </div>
    </div>
  );
}
