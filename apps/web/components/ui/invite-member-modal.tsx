import * as React from "react";
import { Modal } from "./modal";
import { Button } from "./button";
import { Input } from "./input";
import { Users } from "lucide-react";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteMemberModal({ isOpen, onClose }: InviteMemberModalProps) {
  const [email, setEmail] = React.useState("");

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
          <Users size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Invite to Board</h2>
          <p className="text-xs text-slate-500">Collaborate by inviting team members.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email address</label>
          <Input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@example.com" 
            autoFocus 
          />
        </div>

        <Button 
          variant="primary" 
          className="w-full mt-4" 
          disabled={!email.trim()}
          onClick={() => {
            // Mock submission
            onClose();
          }}
        >
          Send Invite
        </Button>
      </div>
    </Modal>
  );
}
