"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, CheckCircle2, AlertCircle, KeyRound, ShieldCheck, Save, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";

export default function ProfilePage(): React.JSX.Element | null {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Profile info state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Route Protection Effect
  useEffect(() => {
    if (!isPending && (!session || !session.user)) {
      router.push("/login");
    } else if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [session, isPending, router]);

  // Handle inputs
  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Profile Info Update
  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (!profileData.name.trim()) {
      setProfileError("Name cannot be empty.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profileData.email.trim() || !emailRegex.test(profileData.email.trim())) {
      setProfileError("Please enter a valid email address.");
      return;
    }

    setProfileLoading(true);

    try {
      const res = await api.put("/api/users/profile", {
        name: profileData.name.trim(),
        email: profileData.email.trim(),
      });

      setProfileSuccess(res.data.message || "Profile updated successfully!");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update profile. Please try again.";
      setProfileError(msg);
    } finally {
      setProfileLoading(false);
    }
  };

  // Submit Password Change
  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!passwordData.currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordError("New password is required.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await api.put("/api/users/profile/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      setPasswordSuccess(res.data.message || "Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update password. Please check your current password.";
      setPasswordError(msg);
    } finally {
      setPasswordLoading(false);
    }
  };

  // Unauthenticated or Loading State protection
  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <Loader2 className="w-6 h-6 animate-spin text-slate-900" />
          <span>Verifying authentication...</span>
        </div>
      </div>
    );
  }

  if (!session || !session.user) {
    return null;
  }

  const userInitials = session.user.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profile & Account</h1>
        <p className="text-slate-500 mt-1">Manage your public profile and account security settings.</p>
      </div>

      {/* User Info Overview Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <Avatar initials={userInitials} size="lg" className="w-20 h-20 text-xl font-bold bg-slate-900 text-white ring-4 ring-slate-100 shadow-inner" />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{session.user.name}</h2>
            {session.user.emailVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit mx-auto sm:mx-0">
                <ShieldCheck size={13} /> Verified
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">{session.user.email}</p>
        </div>
      </div>

      {/* Profile Details Section */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <User size={20} className="text-slate-700" />
          <div>
            <h2 className="font-bold text-lg text-slate-900">Personal Information</h2>
            <p className="text-xs text-slate-500">Update your account name and email address.</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
          {profileError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 font-medium">
              <AlertCircle size={18} className="shrink-0 text-red-600" />
              <span>{profileError}</span>
            </div>
          )}

          {profileSuccess && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 font-medium">
              <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
              <span>{profileSuccess}</span>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <User size={16} className="text-slate-400" /> Full Name
              </label>
              <Input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Mail size={16} className="text-slate-400" /> Email Address
              </label>
              <Input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={profileLoading}
              variant="primary"
              className="px-6 gap-2"
            >
              {profileLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Password Change Section */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <KeyRound size={20} className="text-slate-700" />
          <div>
            <h2 className="font-bold text-lg text-slate-900">Change Password</h2>
            <p className="text-xs text-slate-500">Ensure your account is using a strong password.</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
          {passwordError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 font-medium">
              <AlertCircle size={18} className="shrink-0 text-red-600" />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 font-medium">
              <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          <div className="space-y-4 max-w-lg">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Lock size={16} className="text-slate-400" /> Current Password
              </label>
              <Input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Lock size={16} className="text-slate-400" /> New Password
              </label>
              <Input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="•••••••• (min 8 characters)"
                required
                minLength={8}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Lock size={16} className="text-slate-400" /> Confirm New Password
              </label>
              <Input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={passwordLoading}
              variant="primary"
              className="px-6 gap-2"
            >
              {passwordLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <Lock size={16} /> Update Password
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
