"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function ForgotPasswordPage(): React.JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await authClient.forgetPassword({
        email,
        redirectTo: "/reset-password",
      });

      if (error) {
        setError(error.message || "Failed to send reset link");
        return;
      }

      setSuccess("If an account exists, a reset link has been sent to your email.");
      
    } catch (err: any) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 p-8 bg-white shadow-sm">
        
        {/* Header / Branding */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900">
            <span className="text-xl font-bold text-white">T</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reset your password</h1>
          <p className="mt-2 text-sm text-slate-500">Enter your email to receive a reset link</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 font-medium text-center">
            {error}
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-600 font-medium text-center">
            {success}
          </div>
        )}

        {/* Form Controls */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-900">
              Email address
            </label>
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@acme.dev"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full h-11 text-base mt-2"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        {/* Footer Link */}
        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Remember your password?{" "}
          <a href="/login" className="text-slate-900 font-semibold hover:underline">
            Back to sign in
          </a>
        </p>
      </div>
    </div>
  );
}
