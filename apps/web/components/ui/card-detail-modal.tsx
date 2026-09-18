import * as React from "react";
import { Modal } from "./modal";
import { Card as CardType, Label, Checklist, ChecklistItem, Comment, Attachment } from "../../lib/mock-data";
import { Avatar } from "./avatar";
import { Button } from "./button";
import { Badge } from "./badge";
import { AlignLeft, CheckSquare, Clock, MessageSquare, Paperclip, Plus, Tag, Users } from "lucide-react";

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CardType | null;
}

export function CardDetailModal({ isOpen, onClose, card }: CardDetailModalProps) {
  if (!card) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="space-y-6">
        
        {/* Header (Title & Board/List Context) */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">{card.title}</h2>
          <p className="text-sm text-slate-500">in list <span className="underline cursor-pointer">Local State</span></p>
        </div>

        {/* 2 Column Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Main Column */}
          <div className="flex-1 space-y-6">
            
            {/* Meta data row (Assignees, Labels, Due Date) */}
            <div className="flex flex-wrap gap-6">
              {/* Assignees */}
              {card.assignees.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Members</h3>
                  <div className="flex gap-1">
                    {card.assignees.map(user => (
                      <Avatar key={user.id} initials={user.initials} size="md" title={user.name} />
                    ))}
                    <button className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Labels */}
              {card.labels.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Labels</h3>
                  <div className="flex flex-wrap gap-1">
                    {card.labels.map(label => (
                      <Badge key={label.id} className={label.color.split(' ')[0] + " font-medium"}>{label.name}</Badge>
                    ))}
                    <button className="h-6 px-2 rounded-md bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors flex items-center justify-center">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Due Date */}
              {card.dueDate && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Due Date</h3>
                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-md text-sm font-medium text-slate-700">
                    <Clock size={16} className="text-slate-500" />
                    <span>{new Date(card.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-slate-700 font-semibold">
                <AlignLeft size={18} />
                <h3>Description</h3>
              </div>
              <div className="pl-6 text-sm text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100 min-h-[60px]">
                {card.description || <span className="text-slate-400 italic">Add a more detailed description...</span>}
              </div>
            </div>

            {/* Checklists */}
            {card.checklists.map(checklist => (
              <div key={checklist.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <CheckSquare size={18} />
                    <h3>{checklist.title}</h3>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">Delete</Button>
                </div>
                <div className="pl-6 space-y-2">
                  {/* Progress bar */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-slate-500 w-8">{Math.round((checklist.items.filter(i => i.isCompleted).length / checklist.items.length) * 100)}%</span>
                    <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-slate-400 transition-all" 
                        style={{ width: `${(checklist.items.filter(i => i.isCompleted).length / checklist.items.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  {/* Items */}
                  {checklist.items.map(item => (
                    <div key={item.id} className="flex items-start gap-3 group">
                      <input type="checkbox" checked={item.isCompleted} readOnly className="mt-1 border-slate-300 rounded text-slate-900 focus:ring-slate-900" />
                      <div className={`text-sm flex-1 ${item.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {item.title}
                      </div>
                    </div>
                  ))}
                  <Button variant="secondary" size="sm" className="mt-2 text-xs">Add an item</Button>
                </div>
              </div>
            ))}

            {/* Comments */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold">
                <MessageSquare size={18} />
                <h3>Activity</h3>
              </div>
              <div className="pl-6 space-y-4">
                {/* Comment Input */}
                <div className="flex gap-3">
                  <Avatar initials="HA" size="md" />
                  <div className="flex-1 bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-slate-900">
                    <textarea 
                      className="w-full p-2 text-sm outline-none resize-none placeholder:text-slate-400 min-h-[60px]" 
                      placeholder="Write a comment..." 
                    />
                    <div className="px-2 py-2 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                      <div className="flex gap-1 text-slate-400">
                        <Paperclip size={16} className="cursor-pointer hover:text-slate-600" />
                      </div>
                      <Button variant="primary" size="sm" className="h-7 text-xs">Save</Button>
                    </div>
                  </div>
                </div>
                
                {/* Comment List */}
                {card.comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar initials="YK" size="md" /> {/* Hardcoded for dummy */}
                    <div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-semibold text-slate-900">Yadhu Krishnan</span>
                        <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-slate-700 bg-white border border-slate-200 rounded-md p-2 shadow-sm">
                        {comment.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Actions Column */}
          <div className="w-full md:w-40 space-y-4">
             <div>
               <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Add to card</h4>
               <div className="space-y-1.5 flex flex-col">
                 <Button variant="secondary" size="sm" className="w-full justify-start gap-2 h-8 text-xs font-medium"><Users size={14}/> Members</Button>
                 <Button variant="secondary" size="sm" className="w-full justify-start gap-2 h-8 text-xs font-medium"><Tag size={14}/> Labels</Button>
                 <Button variant="secondary" size="sm" className="w-full justify-start gap-2 h-8 text-xs font-medium"><CheckSquare size={14}/> Checklist</Button>
                 <Button variant="secondary" size="sm" className="w-full justify-start gap-2 h-8 text-xs font-medium"><Clock size={14}/> Dates</Button>
                 <Button variant="secondary" size="sm" className="w-full justify-start gap-2 h-8 text-xs font-medium"><Paperclip size={14}/> Attachment</Button>
               </div>
             </div>
          </div>

        </div>
      </div>
    </Modal>
  );
}
