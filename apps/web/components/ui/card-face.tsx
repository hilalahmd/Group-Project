import * as React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Clock, CheckSquare, MessageSquare, Paperclip } from "lucide-react";
import { Card as CardType } from "@/lib/mock-data";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface CardFaceProps {
  card: CardType;
  index: number;
  onClick: () => void;
}

export function CardFace({ card, index, onClick }: CardFaceProps) {
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();
  const hasChecklists = card.checklists.length > 0;
  const totalChecklistItems = card.checklists.reduce((acc, cl) => acc + cl.items.length, 0);
  const completedChecklistItems = card.checklists.reduce((acc, cl) => acc + cl.items.filter(i => i.isCompleted).length, 0);

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={cn(
            "group rounded-lg border bg-white shadow-sm hover:border-slate-300 hover:shadow-md transition-all mb-3 cursor-pointer flex flex-col overflow-hidden",
            snapshot.isDragging ? "border-slate-300 shadow-md ring-1 ring-slate-200 rotate-1" : "border-slate-200"
          )}
        >
          {/* Cover Image */}
          {card.coverImageUrl && (
            <div className="w-full h-32 shrink-0 overflow-hidden bg-slate-100">
              <img 
                src={card.coverImageUrl} 
                alt="Card Cover" 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Card Body */}
          <div className="p-3">
            {/* Labels */}
            {card.labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {card.labels.slice(0, 4).map(label => (
                  <div key={label.id} className={cn("px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide", label.color)} title={label.name}>
                    {label.name}
                  </div>
                ))}
              </div>
            )}

            {/* Title */}
            <h4 className="text-sm font-medium text-slate-900 mb-2 leading-tight">{card.title}</h4>

            {/* Badges & Avatars */}
            <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                {card.dueDate && (
                  <div className={cn("flex items-center gap-1 rounded px-1.5 py-0.5", isOverdue ? "bg-red-100 text-red-700 font-medium" : "bg-slate-100")}>
                    <Clock size={12} />
                    <span>{new Date(card.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                )}
                {hasChecklists && (
                  <div className="flex items-center gap-1 text-slate-400">
                    <CheckSquare size={14} />
                    <span>{completedChecklistItems}/{totalChecklistItems}</span>
                  </div>
                )}
                {card.comments.length > 0 && (
                  <div className="flex items-center gap-1 text-slate-400">
                    <MessageSquare size={14} />
                    <span>{card.comments.length}</span>
                  </div>
                )}
                {card.attachments.length > 0 && (
                  <div className="flex items-center gap-1 text-slate-400">
                    <Paperclip size={14} />
                    <span>{card.attachments.length}</span>
                  </div>
                )}
              </div>

              {/* Assignees */}
              {card.assignees.length > 0 && (
                <div className="flex -space-x-1 shrink-0">
                  {card.assignees.map(user => (
                    <Avatar key={user.id} initials={user.initials} size="sm" className="ring-white ring-2 h-6 w-6 text-[10px]" title={user.name} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
