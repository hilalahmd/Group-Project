"use client";

import * as React from "react";
import { Layout } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
          <Layout size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Taskio</h1>
        <p className="text-slate-500 mb-8">
          Let's get started by creating your first workspace. A workspace is where your team collaborates on boards.
        </p>

        <div className="space-y-4 text-left">
          <div>
            <label className="text-sm font-semibold text-slate-900 mb-1 block">Workspace Name</label>
            <Input placeholder="e.g. Acme Corp, Engineering Team..." className="w-full" />
          </div>
          <Button variant="primary" className="w-full h-11 text-base">Create Workspace</Button>
        </div>
      </div>
    </div>
  );
}
