"use client";

import React, { useState } from "react";
import { Modal } from "./modal";
import { Button } from "./button";
import { authClient } from "@/lib/auth-client";
import api from "@/lib/api";
import { LogOut, ShieldAlert, Loader2, AlertCircle } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "single" | "all"; // "single" for current session, "all" for all devices
}

export function LogoutModal({ isOpen, onClose, mode = "single" }: LogoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAllDevices = mode === "all";

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      if (isAllDevices) {
        // 1. Invalidate all sessions for user on server
        try {
          await api.post("/api/users/logout-all");
        } catch (apiErr: any) {
          console.warn("logout-all API notice:", apiErr);
          // If 401 (unauthorized / session already expired), proceed with sign-out
          if (apiErr.response?.status !== 401) {
            const msg = apiErr.response?.data?.message || "Failed to terminate all sessions on server.";
            setError(msg);
            setLoading(false);
            return;
          }
        }
      }

      // 2. Sign out via Better Auth client
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            onClose();
            // Force hard navigation to /login to flush React state & prevent back navigation
            window.location.href = "/login";
          },
          onError: (ctx) => {
            console.warn("Sign out client notice:", ctx.error);
            onClose();
            window.location.href = "/login";
          },
        },
      });
    } catch (err: any) {
      console.error("Logout execution error:", err);
      // Fallback redirect if network or runtime error occurs
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? () => {} : onClose}
      title={isAllDevices ? "Log out of all devices?" : "Log out?"}
    >
      <div className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-start gap-3">
          <div
            className={`p-3 rounded-xl shrink-0 ${
              isAllDevices ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
            }`}
          >
            {isAllDevices ? <ShieldAlert size={24} /> : <LogOut size={24} />}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-600">
              {isAllDevices
                ? "This will sign you out from all active sessions on your account, including other browsers and devices."
                : "Are you sure you want to log out of your account on this device?"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleLogout}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Logging out...
              </>
            ) : isAllDevices ? (
              "Log out everywhere"
            ) : (
              "Log out"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
