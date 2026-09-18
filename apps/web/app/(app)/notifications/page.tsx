"use client";

import React, { useState } from "react";
import { Bell, Check, User, Calendar, MessageSquare, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  type: 'mention' | 'assignment' | 'due_date' | 'system';
  actor: string;
  content: string;
  target: string;
  time: string;
  isRead: boolean;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "mention",
    actor: "Vyshnav P",
    content: "mentioned you in",
    target: "Setup Next.js project",
    time: "2 hours ago",
    isRead: false,
  },
  {
    id: "n2",
    type: "assignment",
    actor: "Afra",
    content: "assigned you to",
    target: "Design minimal landing page",
    time: "5 hours ago",
    isRead: false,
  },
  {
    id: "n3",
    type: "due_date",
    actor: "System",
    content: "Card is due tomorrow:",
    target: "Implement drag and drop",
    time: "Yesterday",
    isRead: true,
  },
  {
    id: "n4",
    type: "system",
    actor: "Taskio",
    content: "Welcome to Taskio! Check out the",
    target: "getting started guide",
    time: "3 days ago",
    isRead: true,
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'mention': return <MessageSquare size={16} className="text-blue-600" />;
      case 'assignment': return <User size={16} className="text-purple-600" />;
      case 'due_date': return <Calendar size={16} className="text-amber-600" />;
      case 'system': return <AlertTriangle size={16} className="text-emerald-600" />;
    }
  };

  const getIconBg = (type: Notification['type']) => {
    switch (type) {
      case 'mention': return "bg-blue-100";
      case 'assignment': return "bg-purple-100";
      case 'due_date': return "bg-amber-100";
      case 'system': return "bg-emerald-100";
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Notifications</h1>
          <p className="text-slate-500">You have {unreadCount} unread notifications.</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllRead}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          >
            <Check size={16} />
            Mark all read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={cn(
              "flex gap-4 p-5 rounded-xl border transition-all duration-200",
              notification.isRead 
                ? "bg-white border-slate-200" 
                : "bg-blue-50/50 border-blue-100 shadow-sm"
            )}
          >
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", getIconBg(notification.type))}>
              {getIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="text-[15px] text-slate-800">
                <span className="font-bold text-slate-900">{notification.actor}</span>{" "}
                {notification.content}{" "}
                <span className="font-semibold text-slate-900">{notification.target}</span>
              </div>
              <div className="text-sm font-medium text-slate-500 mt-1">
                {notification.time}
              </div>
            </div>

            {!notification.isRead && (
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
            )}
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={24} className="text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">All caught up!</h3>
            <p className="text-sm text-slate-500">You don't have any notifications right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}
