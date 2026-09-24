import * as React from "react";
import { Modal } from "./modal";
import { Button } from "./button";
import { Input } from "./input";
import { Users } from "lucide-react";
import api from "@/lib/api";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateWorkspaceModal({ isOpen, onClose }: CreateWorkspaceModalProps) {
  const [workspaceName, setWorkspaceName] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!isOpen) return null;

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) return;

    try {
      setIsSubmitting(true);
      await api.post('/api/workspaces', { name: workspaceName });
      
      // Page refresh cheythaal puthiya workspace dashboard-il kaanam
      window.location.reload(); 
    } catch (error) {
      console.error("Failed to create workspace:", error);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
          <Users size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Let's build a Workspace</h2>
          <p className="text-xs text-slate-500">Boost your productivity by making it easier for everyone to access boards in one location.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Workspace name</label>
          <Input 
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="Taco's Co." 
            autoFocus 
            disabled={isSubmitting}
          />
          <p className="text-xs text-slate-500 mt-1">This is the name of your company, team or organization.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Workspace type</label>
          <select disabled={isSubmitting} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option>Choose...</option>
            <option>Engineering-IT</option>
            <option>Marketing</option>
            <option>Operations</option>
            <option>Sales/CRM</option>
          </select>
        </div>

        <Button 
          variant="primary" 
          className="w-full mt-4" 
          disabled={!workspaceName.trim() || isSubmitting}
          onClick={handleCreateWorkspace}
        >
          {isSubmitting ? "Creating..." : "Continue"}
        </Button>
      </div>
    </Modal>
  );
}
