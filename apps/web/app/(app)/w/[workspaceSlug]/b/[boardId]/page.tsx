"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, MoreHorizontal, MessageSquare, Paperclip, CheckSquare, Clock, Star, ClipboardList, Settings } from "lucide-react";
import { MOCK_BOARDS, MOCK_USERS, List as ListType, Card as CardType } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CardDetailModal } from "@/components/ui/card-detail-modal";
import { CardFace } from "@/components/ui/card-face";
import { InviteMemberModal } from "@/components/ui/invite-member-modal";
import { cn } from "@/lib/utils";

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
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);

  if (!board) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-200">
          <Layout size={32} className="text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Board not found</h1>
        <p className="max-w-md text-sm text-slate-500 mb-8">
          The board you are looking for does not exist or you don't have permission to view it.
        </p>
        <Button variant="primary" onClick={() => window.history.back()}>
          Go back
        </Button>
      </div>
    );
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

  const bgStyle = board.background?.type === 'color' 
    ? { backgroundColor: board.background.value.replace('bg-', '') } // Fallback logic if needed, but normally we use Tailwind classes
    : board.background?.type === 'image'
    ? { backgroundImage: `url(${board.background.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: '#f8fafc' }; // slate-50 fallback

  const bgClass = board.background?.type === 'color' ? board.background.value : "";

  return (
    <div className={cn("h-full flex flex-col relative", bgClass)} style={bgStyle}>
      
      {/* Board Header Overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] pointer-events-none z-0"></div>

      {/* Main Board Container */}
      <div className="relative z-10 flex flex-col h-full bg-transparent">
        {/* Board Header */}
        <div className="h-16 px-6 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-900">{board.title}</h1>
            <button className={cn("p-1.5 rounded-md hover:bg-slate-200/50 transition-colors", board.isFavorite ? "text-amber-500" : "text-slate-500")}>
              <Star size={18} fill={board.isFavorite ? "currentColor" : "none"} />
            </button>
            <div className="h-4 w-px bg-slate-300 mx-2" />
            <div className="flex -space-x-2">
              {board.members.map(member => (
                <Avatar key={member.id} initials={member.initials} size="sm" className="ring-white ring-2" title={member.name} />
              ))}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs font-medium ml-2 text-slate-700 bg-white/50 hover:bg-white/80"
              onClick={() => setIsInviteModalOpen(true)}
            >
              <Plus size={14} className="mr-1" /> Invite
            </Button>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="sm" className="h-8 text-slate-700 bg-white/50 hover:bg-white/80">
               <MoreHorizontal size={18} />
             </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-3 flex items-center gap-3 shrink-0">
           <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2.5 top-2.5 text-slate-500">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="Search..." 
                className="h-9 w-48 pl-8 pr-3 text-sm rounded-md bg-white/90 backdrop-blur-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm"
              />
           </div>
           <Button variant="ghost" size="sm" className="h-9 text-sm text-slate-700 bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-white shadow-sm">
             <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center mr-2 text-[10px] font-bold text-slate-500">
               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
             </div>
             People
           </Button>
           <Button variant="ghost" size="sm" className="h-9 text-sm text-slate-700 bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-white shadow-sm">
             <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center mr-2 text-[10px] font-bold text-slate-500">
               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
             </div>
             Labels
           </Button>
        </div>

        {/* Board Canvas */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 pt-2">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full items-start gap-4">
            {board.lists.map((list) => (
              <div key={list.id} className="flex-shrink-0 w-72 max-h-full flex flex-col rounded-xl bg-[#f4f5f7] shadow-sm">
                
                {/* List Header */}
                <div className="p-3 pl-4 flex items-center justify-between shrink-0">
                  <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                    {list.title}
                    {list.emoji && <span>{list.emoji}</span>}
                  </h3>
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
                      className={cn(
                        "flex-1 overflow-y-auto px-3 py-1 min-h-[10px] transition-colors", 
                        snapshot.isDraggingOver ? "bg-slate-200/50 rounded-lg" : "",
                        list.cards.length === 0 ? "min-h-[60px]" : ""
                      )}
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
                    <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm space-y-2 mb-1">
                      <textarea 
                        autoFocus
                        className="w-full text-sm p-1 outline-none resize-none placeholder:text-slate-400 font-medium" 
                        placeholder="Enter a title for this card..."
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddCard(list.id); }
                          if (e.key === 'Escape') setAddingCardToListId(null);
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <Button className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white px-3 font-semibold text-xs" onClick={() => handleAddCard(list.id)}>
                          Add card
                        </Button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100" onClick={() => setAddingCardToListId(null)}>
                          <Plus size={20} className="rotate-45" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      className="flex items-center gap-2 w-full p-2 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 rounded-lg transition-colors text-left"
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
                  className="flex items-center gap-2 w-full p-3 bg-white/40 border-none text-sm font-medium text-slate-700 rounded-xl hover:bg-white/60 transition-all text-left shadow-sm"
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
      </div>
      
      {/* Card Detail Modal */}
      <CardDetailModal 
        isOpen={!!selectedCard} 
        onClose={() => setSelectedCard(null)} 
        card={selectedCard} 
      />

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
}
