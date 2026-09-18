"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  X, CheckSquare, AlignLeft, Paperclip, 
  MessageSquare, Clock, Users, Tag,
  MoreHorizontal
} from "lucide-react";
import { MOCK_BOARDS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Button } from "../../../../components/ui/button";
import { Avatar } from "../../../../components/ui/avatar";

export default function CardDetailsPage() {
  const { cardId } = useParams();
  const router = useRouter();

  // Find card from mock data
  const card = React.useMemo(() => {
    for (const board of MOCK_BOARDS) {
      for (const list of board.lists) {
        const found = list.cards.find(c => c.id === cardId);
        if (found) return { ...found, listName: list.title, boardName: board.title };
      }
    }
    return null;
  }, [cardId]);

  const [commentText, setCommentText] = useState("");

  if (!card) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Card not found</h2>
          <p className="text-slate-500 mb-6">The card you are looking for doesn't exist or has been deleted.</p>
          <Button variant="primary" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen">
      {/* Container simulating a modal view but rendering as a full page */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        
        {/* Cover Image */}
        {card.coverImageUrl && (
          <div 
            className="w-full h-48 bg-cover bg-center" 
            style={{ backgroundImage: `url(${card.coverImageUrl})` }}
          />
        )}

        {/* Header */}
        <div className="px-8 pt-8 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div className="flex-1 pr-8">
            <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-2">{card.title}</h1>
            <p className="text-sm font-medium text-slate-500">
              in list <span className="underline decoration-slate-300 underline-offset-2">{card.listName}</span> on <span className="font-semibold text-slate-700">{card.boardName}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
              <MoreHorizontal size={20} />
            </button>
            <button onClick={() => router.back()} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Main Column */}
          <div className="flex-1 p-8 space-y-10 border-r border-slate-100">
            
            {/* Quick Info (Members, Labels, Due Date) */}
            <div className="flex flex-wrap gap-8">
              {card.assignees.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Members</h3>
                  <div className="flex items-center gap-1">
                    {card.assignees.map(user => (
                       <Avatar key={user.id} initials={user.initials} size="sm" className="ring-2 ring-white shadow-sm" />
                    ))}
                    <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors">
                      <Users size={14} />
                    </button>
                  </div>
                </div>
              )}

              {card.labels.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Labels</h3>
                  <div className="flex flex-wrap gap-2">
                    {card.labels.map(label => (
                       <span key={label.id} className={cn("px-3 py-1 rounded-md text-xs font-bold shadow-sm", label.color)}>
                         {label.name}
                       </span>
                    ))}
                    <button className="px-3 py-1 rounded-md bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors text-xs font-bold flex items-center gap-1">
                      <Tag size={12} /> Add
                    </button>
                  </div>
                </div>
              )}

              {card.dueDate && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Due Date</h3>
                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-md">
                    <Clock size={14} className="text-slate-500" />
                    <span className="text-sm font-semibold text-slate-700">{new Date(card.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <section>
              <div className="flex items-center gap-3 mb-4 text-slate-700">
                <AlignLeft size={20} className="text-slate-400" />
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Description</h3>
              </div>
              {card.description ? (
                <div className="text-[15px] leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {card.description}
                </div>
              ) : (
                <div className="text-[15px] text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100 border-dashed cursor-pointer hover:bg-slate-100 transition-colors">
                  Add a more detailed description...
                </div>
              )}
            </section>

            {/* Checklists */}
            {card.checklists.length > 0 && card.checklists.map(checklist => (
              <section key={checklist.id}>
                <div className="flex items-center gap-3 mb-4 text-slate-700">
                  <CheckSquare size={20} className="text-slate-400" />
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">{checklist.title}</h3>
                </div>
                
                {/* Progress bar */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-slate-500 w-8">
                    {Math.round((checklist.items.filter(i => i.isCompleted).length / checklist.items.length) * 100)}%
                  </span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-300" 
                      style={{ width: `${(checklist.items.filter(i => i.isCompleted).length / checklist.items.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {checklist.items.map(item => (
                    <div key={item.id} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg group transition-colors">
                      <input 
                        type="checkbox" 
                        checked={item.isCompleted} 
                        readOnly
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className={cn("text-[15px]", item.isCompleted ? "text-slate-400 line-through" : "text-slate-700 font-medium")}>
                        {item.title}
                      </span>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="mt-2 text-sm ml-7">
                    Add an item
                  </Button>
                </div>
              </section>
            ))}

            {/* Attachments */}
            {card.attachments.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4 text-slate-700">
                  <Paperclip size={20} className="text-slate-400" />
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">Attachments</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {card.attachments.map(att => (
                    <div key={att.id} className="flex gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                         <span className="text-xs font-bold text-slate-500 uppercase">{att.type.split('/')[1] || "FILE"}</span>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="text-sm font-bold text-slate-900 truncate">{att.name}</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">Added {new Date(att.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Activity & Comments */}
            <section>
              <div className="flex items-center gap-3 mb-6 text-slate-700">
                <MessageSquare size={20} className="text-slate-400" />
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Activity</h3>
              </div>
              
              {/* Comment Input */}
              <div className="flex gap-4 mb-8">
                <Avatar initials="HA" size="md" className="shrink-0 ring-2 ring-white shadow-sm mt-1" />
                <div className="flex-1 space-y-2">
                  <textarea 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full rounded-xl border border-slate-200 p-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[80px]"
                  />
                  <Button variant="primary" disabled={!commentText.trim()} className="px-6 font-semibold shadow-sm">
                    Save
                  </Button>
                </div>
              </div>

              {/* Feed */}
              <div className="space-y-6">
                {card.comments.map(comment => (
                  <div key={comment.id} className="flex gap-4">
                    <Avatar initials="YK" size="md" className="shrink-0 ring-2 ring-white shadow-sm mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">Yadhu Krishnan</span>
                        <span className="text-xs font-medium text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-[15px] text-slate-700 bg-slate-50 p-3 rounded-xl rounded-tl-none border border-slate-100">
                        {comment.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
          </div>

          {/* Sidebar Actions */}
          <div className="w-full md:w-64 bg-slate-50/50 p-6 space-y-6 shrink-0">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Add to card</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2 bg-white font-medium text-slate-700 border-slate-200">
                  <Users size={16} className="text-slate-400" /> Members
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 bg-white font-medium text-slate-700 border-slate-200">
                  <Tag size={16} className="text-slate-400" /> Labels
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 bg-white font-medium text-slate-700 border-slate-200">
                  <CheckSquare size={16} className="text-slate-400" /> Checklist
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 bg-white font-medium text-slate-700 border-slate-200">
                  <Clock size={16} className="text-slate-400" /> Dates
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 bg-white font-medium text-slate-700 border-slate-200">
                  <Paperclip size={16} className="text-slate-400" /> Attachment
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2 bg-white font-medium text-slate-700 border-slate-200">
                  Archive
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 bg-white font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border-slate-200">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
