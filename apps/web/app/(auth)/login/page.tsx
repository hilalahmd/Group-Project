"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function Page(): React.JSX.Element {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

        try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError(error.message || "Invalid email or password");
        return;
      }

      setSuccess("Logged in successfully! Redirecting...");
      router.push("/dashboard");
      
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to your workspace</p>
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
              value={formData.email}
              onChange={handleChange}
              placeholder="jane@acme.dev"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-900">
                Password
              </label>
              {/* Note: Forgot password flow skipped for Phase 1/4 as per requirements */}
              <a href="/forgot-password" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                Forgot password?
              </a>
            </div>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full h-11 text-base mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs font-semibold">
            <span className="bg-white px-4 text-slate-400">Or continue with</span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="w-full font-semibold text-slate-700"
            onClick={() => {
              setLoading(true);
              setTimeout(() => router.push("/dashboard"), 500);
            }}
          >
            Microsoft
          </Button>
          <Button 
            type="button"
            variant="outline"
            className="w-full font-semibold text-slate-700"
            onClick={async () => {
              try {
                await authClient.signIn.social({
                  provider: "google",
                  callbackURL: "http://localhost:3000/dashboard"
                });
              } catch (err: any) {
                setError(err.message || "Failed to connect to authentication server.");
              }
            }}
          >
            Google
          </Button>
        </div>

        {/* Footer Link */}
        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Don't have an account?{" "}
          <a href="/register" className="text-slate-900 font-semibold hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}