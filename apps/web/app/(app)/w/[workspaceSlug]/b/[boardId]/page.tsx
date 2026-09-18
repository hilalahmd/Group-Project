"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, MoreHorizontal, MessageSquare, Paperclip, CheckSquare, Clock, Star, ClipboardList, Settings } from "lucide-react";
import { MOCK_BOARDS, MOCK_USERS, List as ListType, Card as CardType } from "../../../../../../lib/mock-data";
import { Button } from "../../../../../../components/ui/button";
import { Avatar } from "../../../../../../components/ui/avatar";
import { Badge } from "../../../../../../components/ui/badge";
import { CardDetailModal } from "../../../../../../components/ui/card-detail-modal";
import { cn } from "../../../../../../lib/utils";

// --- Sub-components ---

function CardFace({ card, index, onClick }: { card: CardType, index: number, onClick: () => void }) {
  // Check if overdue
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
            "group rounded-lg border bg-white p-3 shadow-sm hover:border-slate-300 hover:shadow transition-all mb-2 cursor-pointer",
            snapshot.isDragging ? "border-slate-300 shadow-md ring-1 ring-slate-200 rotate-1" : "border-slate-200"
          )}
        >
          {/* Labels */}
          {card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {card.labels.slice(0, 4).map(label => (
                <div key={label.id} className={cn("h-2 w-8 rounded-full", label.color.split(' ')[0])} title={label.name} />
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
              <div className="flex -space-x-1">
                {card.assignees.map(user => (
                  <Avatar key={user.id} initials={user.initials} size="sm" className="ring-white ring-2" title={user.name} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

// --- Main Page Component ---

export default function BoardPage() {
  const params = useParams();
  const boardId = params.boardId as string;
  
  // Find initial board data
  const initialBoard = MOCK_BOARDS.find(b => b.id === boardId);

  // Local React State for the Board (Drag and Drop + Add operations)
  const [board, setBoard] = React.useState(initialBoard);
  const [isAddingList, setIsAddingList] = React.useState(false);
  const [newListTitle, setNewListTitle] = React.useState("");
  
  const [addingCardToListId, setAddingCardToListId] = React.useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = React.useState("");

  const [selectedCard, setSelectedCard] = React.useState<CardType | null>(null);

  if (!board) {
    return <div className="p-8 text-slate-500">Board not found.</div>;
  }

  // Handle Drag & Drop
  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return; // Dropped outside
    if (destination.droppableId === source.droppableId && destination.index === source.index) return; // Didn't move

    const sourceList = board.lists.find(l => l.id === source.droppableId);
    const destList = board.lists.find(l => l.id === destination.droppableId);

    if (!sourceList || !destList) return;

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same list
      const newCards = Array.from(sourceList.cards);
      const [movedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, movedCard);

      const newLists = board.lists.map(l => l.id === sourceList.id ? { ...l, cards: newCards } : l);
      setBoard({ ...board, lists: newLists });
    } else {
      // Moving to a different list
      const sourceCards = Array.from(sourceList.cards);
      const destCards = Array.from(destList.cards);
      
      const [movedCard] = sourceCards.splice(source.index, 1);
      destCards.splice(destination.index, 0, movedCard);

      const newLists = board.lists.map(l => {
        if (l.id === sourceList.id) return { ...l, cards: sourceCards };
        if (l.id === destList.id) return { ...l, cards: destCards };
        return l;
      });
      setBoard({ ...board, lists: newLists });
    }
  };

  // Add List
  const handleAddList = () => {
    if (!newListTitle.trim()) {
      setIsAddingList(false);
      return;
    }
    const newList: ListType = {
      id: `list-${Date.now()}`,
      title: newListTitle.trim(),
      cards: []
    };
    setBoard({ ...board, lists: [...board.lists, newList] });
    setNewListTitle("");
    setIsAddingList(false);
  };

  // Add Card
  const handleAddCard = (listId: string) => {
    if (!newCardTitle.trim()) {
      setAddingCardToListId(null);
      return;
    }
    const newCard: CardType = {
      id: `card-${Date.now()}`,
      title: newCardTitle.trim(),
      labels: [],
      assignees: [],
      checklists: [],
      comments: [],
      attachments: []
    };
    const newLists = board.lists.map(l => l.id === listId ? { ...l, cards: [...l.cards, newCard] } : l);
    setBoard({ ...board, lists: newLists });
    setNewCardTitle("");
    setAddingCardToListId(null);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Board Header */}
      <div className="h-14 border-b border-slate-200 px-6 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-900">{board.title}</h1>
          <button className={cn("p-1.5 rounded-md hover:bg-slate-100 transition-colors", board.isFavorite ? "text-yellow-500" : "text-slate-400")}>
            <Star size={18} fill={board.isFavorite ? "currentColor" : "none"} />
          </button>
          <div className="h-4 w-px bg-slate-300 mx-2" />
          <div className="flex -space-x-2">
            {board.members.map(member => (
              <Avatar key={member.id} initials={member.initials} size="sm" className="ring-white ring-2" title={member.name} />
            ))}
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-xs font-medium ml-2 text-slate-600">
            <Plus size={14} className="mr-1" /> Invite
          </Button>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="sm" className="h-8 text-slate-600">
             <MoreHorizontal size={18} />
           </Button>
        </div>
      </div>

      {/* Board Canvas */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 bg-slate-50">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full items-start gap-4">
            {board.lists.map((list) => (
              <div key={list.id} className="flex-shrink-0 w-72 max-h-full flex flex-col rounded-xl bg-slate-100 border border-slate-200/60 shadow-sm">
                
                {/* List Header */}
                <div className="p-3 pl-4 flex items-center justify-between shrink-0">
                  <h3 className="font-semibold text-sm text-slate-900">{list.title}</h3>
                  <button className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                {/* List Cards (Droppable) */}
                <Droppable droppableId={list.id} type="card">
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                      className={cn("flex-1 overflow-y-auto px-3 py-1 min-h-[50px] transition-colors", snapshot.isDraggingOver ? "bg-slate-200/50" : "")}
                    >
                      {list.cards.map((card, index) => (
                        <CardFace key={card.id} card={card} index={index} onClick={() => setSelectedCard(card)} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {/* List Footer (Add Card) */}
                <div className="p-2 shrink-0">
                  {addingCardToListId === list.id ? (
                    <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm space-y-2">
                      <textarea 
                        autoFocus
                        className="w-full text-sm p-1 outline-none resize-none placeholder:text-slate-400" 
                        placeholder="Enter a title for this card..."
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddCard(list.id); }
                          if (e.key === 'Escape') setAddingCardToListId(null);
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <Button variant="primary" size="sm" onClick={() => handleAddCard(list.id)}>Add card</Button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100" onClick={() => setAddingCardToListId(null)}>
                          <Plus size={20} className="rotate-45" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      className="flex items-center gap-2 w-full p-2 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition-colors text-left"
                      onClick={() => {
                        setAddingCardToListId(list.id);
                        setNewCardTitle("");
                      }}
                    >
                      <Plus size={16} /> Add a card
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Add List Button */}
            <div className="flex-shrink-0 w-72">
              {isAddingList ? (
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm space-y-2">
                   <input 
                      autoFocus
                      type="text"
                      className="w-full text-sm p-2 outline-none border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-transparent" 
                      placeholder="Enter list title..."
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { e.preventDefault(); handleAddList(); }
                        if (e.key === 'Escape') setIsAddingList(false);
                      }}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="primary" size="sm" onClick={handleAddList}>Add list</Button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100" onClick={() => setIsAddingList(false)}>
                        <Plus size={20} className="rotate-45" />
                      </button>
                    </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAddingList(true)}
                  className="flex items-center gap-2 w-full p-3 bg-white/50 border border-slate-200 border-dashed text-sm font-medium text-slate-600 rounded-xl hover:bg-white hover:border-slate-300 hover:text-slate-900 transition-all text-left"
                >
                  <Plus size={16} /> Add another list
                </button>
              )}
            </div>

            {/* Spacer for right padding in horizontal scroll */}
            <div className="w-4 shrink-0" />
            
            {/* Empty Board State */}
            {board.lists.length === 0 && !isAddingList && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto mt-12 bg-white rounded-xl border border-slate-200 shadow-sm border-dashed">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Layout size={24} className="text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">This board is empty</h2>
                <p className="text-slate-500 mb-6">
                  Get started by adding your first list to organize your cards. Lists represent stages in your workflow.
                </p>
                <Button variant="primary" onClick={() => setIsAddingList(true)} className="gap-2">
                  <Plus size={16} /> Add your first list
                </Button>
              </div>
            )}
          </div>
        </DragDropContext>
      </div>
      
      {/* Card Detail Modal */}
      <CardDetailModal 
        isOpen={!!selectedCard} 
        onClose={() => setSelectedCard(null)} 
        card={selectedCard} 
      />
    </div>
  );
}
