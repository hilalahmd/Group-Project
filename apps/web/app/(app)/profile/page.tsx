"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Save,
  Loader2,
  Calendar,
  AtSign,
  RefreshCw,
  BadgeCheck,
  UserCheck,
  Monitor,
  Laptop,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogoutModal } from "@/components/ui/logout-modal";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  displayName?: string | null;
  emailVerified: boolean;
  avatarUrl?: string | null;
  image?: string | null;
  createdAt?: string;
  isGoogleUser: boolean;
  accounts?: { providerId: string }[];
  currentSession?: {
    id: string;
    createdAt: string;
    expiresAt: string;
    userAgent?: string | null;
    ipAddress?: string | null;
  } | null;
  activeSessionsCount?: number;
}

function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function ProfilePage(): React.JSX.Element | null {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  // Full User Profile from database API
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [fetching, setFetching] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Logout Modal State
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [logoutMode, setLogoutMode] = useState<"single" | "all">("single");

  const openLogoutModal = (mode: "single" | "all") => {
    setLogoutMode(mode);
    setLogoutModalOpen(true);
  };

  // Edit Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    username: "",
    displayName: "",
  });
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Change Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Fetch real user profile from backend
  const loadProfile = useCallback(async () => {
    try {
      setFetching(true);
      setFetchError(null);
      const res = await api.get("/api/users/profile");
      const user: UserProfile = res.data.user;

      setUserProfile(user);
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        username: user.username || "",
        displayName: user.displayName || "",
      });
    } catch (err: any) {
      console.error("Failed to load profile:", err);
      const msg = err.response?.data?.message || "Failed to load profile information.";
      setFetchError(msg);
    } finally {
      setFetching(false);
    }
  }, []);

  // Route Protection & Profile Loading Effect
  useEffect(() => {
    if (!sessionPending && !session?.user) {
      router.push("/login");
    } else if (session?.user) {
      loadProfile();
    }
  }, [session, sessionPending, router, loadProfile]);

  // Input Handlers
  const handleProfileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Profile Information Update
  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (!profileForm.name.trim()) {
      setProfileError("Name cannot be empty.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profileForm.email.trim() || !emailRegex.test(profileForm.email.trim())) {
      setProfileError("Please enter a valid email address.");
      return;
    }

    if (profileForm.username.trim() && profileForm.username.trim().length < 3) {
      setProfileError("Username must be at least 3 characters long.");
      return;
    }

    setProfileLoading(true);

    try {
      const res = await api.put("/api/users/profile", {
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
        username: profileForm.username.trim() || null,
        displayName: profileForm.displayName.trim() || null,
      });

      setProfileSuccess(res.data.message || "Profile updated successfully!");

      if (res.data.user) {
        setUserProfile(res.data.user);
        setProfileForm({
          name: res.data.user.name || "",
          email: res.data.user.email || "",
          username: res.data.user.username || "",
          displayName: res.data.user.displayName || "",
        });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update profile. Please try again.";
      setProfileError(msg);
    } finally {
      setProfileLoading(false);
    }
  };

  // Submit Password Change (Normal Users Only)
  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!passwordForm.currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }

    if (!passwordForm.newPassword) {
      setPasswordError("New password is required.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await api.put("/api/users/profile/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      setPasswordSuccess(res.data.message || "Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Failed to update password. Please check your current password.";
      setPasswordError(msg);
    } finally {
      setPasswordLoading(false);
    }
  };

  // Loading State
  if (sessionPending || fetching) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-slate-500 font-medium">
          <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
          <p className="text-sm">Loading profile information...</p>
        </div>
      </div>
    );
  }

  // Error loading state
  if (fetchError && !userProfile) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
          <h2 className="text-lg font-bold text-red-900">Failed to load profile</h2>
          <p className="text-sm text-red-700">{fetchError}</p>
          <Button variant="outline" onClick={loadProfile} className="gap-2 mx-auto">
            <RefreshCw size={16} /> Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!session || !session.user || !userProfile) {
    return null;
  }

  // Generate User Initials (based on name, display name, username, or email fallback)
  const displayTitleName = userProfile.displayName || userProfile.name || session.user.name || userProfile.username || userProfile.email || "User";
  
  const getAvatarInitials = (): string => {
    const raw =
      userProfile.displayName ||
      userProfile.name ||
      session?.user?.name ||
      userProfile.username ||
      (userProfile.email ? userProfile.email.split("@")[0] : "");
    if (!raw) return "U";

    const parts = raw.trim().split(/[\s._-]+/).filter(Boolean);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return raw.slice(0, 2).toUpperCase();
  };

  const userInitials = getAvatarInitials();

  // Avatar source (Google profile pic or custom avatar URL)
  const rawAvatar = userProfile.avatarUrl || userProfile.image || session?.user?.image;
  const avatarSrc = rawAvatar && rawAvatar.trim().length > 0 ? rawAvatar.trim() : undefined;

  // Format Created Date
  const memberSinceDate = userProfile.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profile & Account</h1>
        <p className="text-slate-500 mt-1">
          Manage your personal details, authentication methods, and security preferences.
        </p>
      </div>

      {/* User Info Overview Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <Avatar
          src={avatarSrc}
          initials={userInitials}
          size="lg"
          className="w-20 h-20 text-2xl font-bold bg-gradient-to-br from-slate-800 to-slate-950 text-white ring-4 ring-slate-100 shadow-sm shrink-0"
        />
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900">{displayTitleName}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {userProfile.emailVerified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck size={13} /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <AlertCircle size={13} /> Unverified
                </span>
              )}

              {userProfile.isGoogleUser ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  <GoogleIcon className="w-3.5 h-3.5" /> Google Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  <KeyRound size={13} /> Email & Password
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-1">
            <Mail size={14} className="text-slate-400" /> {userProfile.email}
          </p>

          {userProfile.username && (
            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1 font-mono">
              <AtSign size={13} className="text-slate-400" /> {userProfile.username}
            </p>
          )}
        </div>
      </div>

      {/* 1. Personal Information Section */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
            <UserIcon size={20} />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-900">Personal Information</h2>
            <p className="text-xs text-slate-500">
              Update your account name, email address, and public handles.
            </p>
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
                <UserIcon size={16} className="text-slate-400" /> Full Name
              </label>
              <Input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleProfileInputChange}
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
                value={profileForm.email}
                onChange={handleProfileInputChange}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <AtSign size={16} className="text-slate-400" /> Username
              </label>
              <Input
                type="text"
                name="username"
                value={profileForm.username}
                onChange={handleProfileInputChange}
                placeholder="username"
              />
              <p className="text-[11px] text-slate-400">Used for your unique profile URL or tagging.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <UserCheck size={16} className="text-slate-400" /> Display Name
              </label>
              <Input
                type="text"
                name="displayName"
                value={profileForm.displayName}
                onChange={handleProfileInputChange}
                placeholder="Display Name (optional)"
              />
              <p className="text-[11px] text-slate-400">Public name displayed across workspace boards.</p>
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

      {/* 2. Authentication & Security Section */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {userProfile.isGoogleUser ? (
          /* GOOGLE OAUTH USER UI */
          <div>
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900">Connected Accounts</h2>
                <p className="text-xs text-slate-500">
                  Manage external authentication providers connected to your account.
                </p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                    <GoogleIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      Google
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{userProfile.email}</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  <CheckCircle2 size={14} className="text-emerald-600" /> Connected with Google
                </span>
              </div>

              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/60 text-sm text-blue-900 flex items-start gap-3">
                <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Google Authentication Active</p>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Your account is connected with Google. Password management is handled by Google.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* NORMAL EMAIL/PASSWORD USER UI */
          <div>
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
                <KeyRound size={20} />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900">Password & Security</h2>
                <p className="text-xs text-slate-500">
                  Manage your account password to ensure your account remains secure.
                </p>
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
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordInputChange}
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
                    value={passwordForm.newPassword}
                    onChange={handlePasswordInputChange}
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
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordInputChange}
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
                      <Lock size={16} /> Change Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* 3. Security & Active Sessions Section */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900">Security & Active Sessions</h2>
              <p className="text-xs text-slate-500">
                Manage your current session and active device logins.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Session Info */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 shadow-xs">
                <Monitor size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">Current Session</h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active now
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {userProfile.currentSession?.userAgent || "Current browser & device"}
                </p>
                {userProfile.currentSession?.ipAddress && (
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    IP: {userProfile.currentSession.ipAddress}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openLogoutModal("single")}
                className="gap-1.5 text-slate-700 hover:text-slate-900"
              >
                <LogOut size={14} /> Log out
              </Button>
            </div>
          </div>

          {/* All Devices Logout Action */}
          <div className="border border-red-100 rounded-xl p-4 bg-red-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white border border-red-200 rounded-xl text-red-600 shadow-xs">
                <Laptop size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Log out of all devices</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sign out from all active sessions on your account across all devices ({userProfile.activeSessionsCount || 1} active session{userProfile.activeSessionsCount === 1 ? '' : 's'}).
                </p>
              </div>
            </div>

            <Button
              variant="danger"
              size="sm"
              onClick={() => openLogoutModal("all")}
              className="gap-1.5 shrink-0"
            >
              <ShieldAlert size={14} /> Log out of all devices
            </Button>
          </div>
        </div>
      </div>

      {/* 4. Account Information Metadata */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Metadata</p>
            <p className="text-sm font-medium text-slate-900 mt-0.5">
              Member since <span className="font-semibold text-slate-900">{memberSinceDate}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <Badge variant="outline" className="font-normal py-1 px-3">
            Authentication Provider: {userProfile.isGoogleUser ? "Google OAuth" : "Email / Password"}
          </Badge>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        mode={logoutMode}
      />
    </div>
  );
}
