"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "../../../components/ui/button";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleResend = async () => {
    if (!initialEmail) {
      setError("Email address is missing.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await authClient.sendVerificationEmail({
        email: initialEmail,
        callbackURL: "/dashboard",
      });

      if (error) {
        setError(error.message || "Failed to resend verification email");
        return;
      }

      setSuccess("Verification email resent successfully! Please check your inbox.");
    } catch (err: any) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 p-8 bg-white shadow-sm text-center">
      <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900">
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Check your email</h1>
      <p className="text-sm text-slate-500 mb-8">
        We've sent a verification link to <span className="font-medium text-slate-900">{initialEmail || "your email"}</span>. 
        Please check your inbox to verify your account.
      </p>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-600 font-medium">
          {success}
        </div>
      )}

      <Button
        onClick={handleResend}
        disabled={loading || !initialEmail}
        variant="outline"
        className="w-full h-11 text-base font-semibold"
      >
        {loading ? "Sending..." : "Resend verification email"}
      </Button>
      
      <p className="mt-8 text-sm font-medium text-slate-500">
        Verified your email?{" "}
        <a href="/login" className="text-slate-900 font-semibold hover:underline">
          Go to login
        </a>
      </p>
    </div>
  );
}

export default function VerifyEmailPage(): React.JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans text-slate-900">
      <Suspense fallback={<div className="w-full max-w-md p-8 text-center text-slate-500">Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
