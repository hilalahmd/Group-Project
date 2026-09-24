import * as React from "react";
import { Modal } from "./modal";
import { Button } from "./button";
import { Input } from "./input";
import { Layout } from "lucide-react";
import api from "@/lib/api";

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string; // Required: To know which workspace to save the board in
  onSuccess?: () => void; // Optional: To tell the parent component to refresh data
}

const THEMES = [
  { type: "color", value: "bg-blue-600", label: "Blue" },
  { type: "color", value: "bg-orange-500", label: "Orange" },
  { type: "color", value: "bg-emerald-600", label: "Green" },
  { type: "color", value: "bg-red-600", label: "Red" },
  { type: "color", value: "bg-purple-600", label: "Purple" },
  { type: "color", value: "bg-pink-600", label: "Pink" },
  { type: "image", value: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?q=80&w=200&auto=format&fit=crop", label: "Mountains" },
  { type: "image", value: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=200&auto=format&fit=crop", label: "Nature" },
  { type: "image", value: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=200&auto=format&fit=crop", label: "Ocean" },
];

export function CreateBoardModal({ isOpen, onClose, workspaceId, onSuccess }: CreateBoardModalProps) {
  const [selectedTheme, setSelectedTheme] = React.useState(THEMES[0]);
  const [boardTitle, setBoardTitle] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false); // Track loading state

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setBoardTitle("");
      setSelectedTheme(THEMES[0]);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Professional API submission handler
  const handleCreateBoard = async () => {
    if (!boardTitle.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      // Call our backend API
      await api.post('/api/boards', {
        workspaceId,
        name: boardTitle,
        visibility: 'workspace', // Default visibility
        background: selectedTheme, // Store the selected theme object directly
      });

      // Call onSuccess to trigger a re-fetch in the Dashboard
      if (onSuccess) {
        onSuccess();
      }
      
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to create board:", error);
      // In a real app, you might show a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
          <Layout size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Create board</h2>
          <p className="text-xs text-slate-500">A board is made up of cards ordered on lists.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">Background</label>
          <div className="grid grid-cols-5 gap-2">
            {THEMES.map((theme, i) => (
              <button
                key={i}
                onClick={() => setSelectedTheme(theme)}
                disabled={isSubmitting} // Disable while submitting
                className={`w-full aspect-video rounded-md overflow-hidden flex items-center justify-center relative hover:opacity-90 transition-opacity ${
                  selectedTheme === theme ? "ring-2 ring-slate-900 ring-offset-1" : ""
                } ${theme.type === "color" ? theme.value : ""}`}
                style={theme.type === "image" ? { backgroundImage: `url(${theme.value})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
              >
                {selectedTheme === theme && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">Board title <span className="text-red-500">*</span></label>
          <Input 
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            placeholder="e.g. Marketing Campaign" 
            autoFocus 
            required 
            disabled={isSubmitting} // Disable while submitting
          />
        </div>

        <Button 
          variant="primary" 
          className="w-full" 
          disabled={!boardTitle.trim() || isSubmitting}
          onClick={handleCreateBoard}
        >
          {isSubmitting ? "Creating..." : "Create Board"}
        </Button>
      </div>
    </Modal>
  );
}
