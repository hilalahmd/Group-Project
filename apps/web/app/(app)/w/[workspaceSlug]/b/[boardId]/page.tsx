"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, MoreHorizontal, MessageSquare, Paperclip, CheckSquare, Clock, Star, ClipboardList, Settings, Layout } from "lucide-react";
import { MOCK_BOARDS, MOCK_USERS, List as ListType, Card as CardType } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CardDetailModal } from "@/components/ui/card-detail-modal";
import { CardFace } from "@/components/ui/card-face";
import { InviteMemberModal } from "@/components/ui/invite-member-modal";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

// --- Main Page Component ---

export default function BoardPage() {
  const params = useParams();
  const boardId = params.boardId as string;
  
  const [board, setBoard] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  
  const [isAddingList, setIsAddingList] = React.useState(false);
  const [newListTitle, setNewListTitle] = React.useState("");

  React.useEffect(() => {
    const fetchBoard = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/boards/${boardId}`);
        const boardData = res.data;
        
        // Map DB fields to UI expected fields
        boardData.title = boardData.name;
        
        if (boardData.members) {
          boardData.members = boardData.members.map((m: any) => ({
            ...m,
            id: m.user?.id || m.userId,
            name: m.user?.name || 'Unknown',
            initials: m.user?.name ? m.user.name.charAt(0).toUpperCase() : 'U'
          }));
        } else {
          boardData.members = [];
        }

        if (boardData.lists) {
          boardData.lists = boardData.lists.map((l: any) => ({
            ...l,
            title: l.name,
            cards: l.cards ? l.cards.map((c: any) => ({
              ...c,
              labels: c.labels || [],
              assignees: c.assignees || [],
              checklists: c.checklists || [],
              comments: c.comments || [],
              attachments: c.attachments || []
            })) : []
          }));
        } else {
          boardData.lists = [];
        }

        setBoard(boardData);
      } catch (error) {
        console.error("Failed to fetch board:", error);
      } finally {
        setLoading(false);
      }
    };
    if (boardId) {
      fetchBoard();
    }
  }, [boardId]);
  
  const [addingCardToListId, setAddingCardToListId] = React.useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = React.useState("");

  const [selectedCard, setSelectedCard] = React.useState<CardType | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterPeople, setFilterPeople] = React.useState(false);
  const [filterLabels, setFilterLabels] = React.useState(false);

  // View State (Pro Feature)
  const [activeView, setActiveView] = React.useState<"board" | "table" | "calendar">("board");
  const [showShortcuts, setShowShortcuts] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && e.target === document.body) {
        setShowShortcuts(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium animate-pulse">Loading board...</p>
      </div>
    );
  }

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
      if (movedCard) {
        newCards.splice(destination.index, 0, movedCard);
      }

      const newLists = board.lists.map(l => l.id === sourceList.id ? { ...l, cards: newCards } : l);
      setBoard({ ...board, lists: newLists });
    } else {
      // Moving to a different list
      const sourceCards = Array.from(sourceList.cards);
      const destCards = Array.from(destList.cards);
      
      const [movedCard] = sourceCards.splice(source.index, 1);
      if (movedCard) {
        destCards.splice(destination.index, 0, movedCard);
      }

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

  const filteredLists = board.lists.map(list => {
    let filteredCards = list.cards;
    
    if (searchQuery) {
      filteredCards = filteredCards.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterPeople) {
      // Mock filter: just show cards with assignees
      filteredCards = filteredCards.filter(c => c.assignees.length > 0);
    }
    if (filterLabels) {
      // Mock filter: just show cards with labels
      filteredCards = filteredCards.filter(c => c.labels.length > 0);
    }
    return { ...list, cards: filteredCards };
  });

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

            {/* View Switcher (Pro Feature) */}
            <div className="flex bg-slate-100 rounded-md p-0.5 shadow-inner ml-4">
              <button 
                onClick={() => setActiveView("board")}
                className={cn("px-3 py-1 rounded text-xs font-semibold transition-colors", activeView === "board" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700")}
              >
                Board
              </button>
              <button 
                onClick={() => setActiveView("table")}
                className={cn("px-3 py-1 rounded text-xs font-semibold transition-colors", activeView === "table" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700")}
              >
                Table
              </button>
              <button 
                onClick={() => setActiveView("calendar")}
                className={cn("px-3 py-1 rounded text-xs font-semibold transition-colors", activeView === "calendar" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700")}
              >
                Calendar
              </button>
            </div>

          </div>
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="sm" className="h-8 text-slate-700 bg-white/50 hover:bg-white/80" onClick={() => setShowShortcuts(true)}>
               <span className="text-xs font-bold px-1.5 py-0.5 bg-white/80 rounded border border-slate-200 mr-2 shadow-sm">?</span> Shortcuts
             </Button>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-48 pl-8 pr-3 text-sm rounded-md bg-white/90 backdrop-blur-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm"
              />
           </div>
           <Button 
             variant="ghost" 
             size="sm" 
             onClick={() => setFilterPeople(!filterPeople)}
             className={cn("h-9 text-sm text-slate-700 bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-white shadow-sm", filterPeople && "bg-slate-800 text-white hover:bg-slate-900 border-slate-900")}
            >
             <div className={cn("w-4 h-4 rounded-full flex items-center justify-center mr-2 text-[10px] font-bold", filterPeople ? "bg-slate-700 text-slate-300" : "bg-slate-200 text-slate-500")}>
               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
             </div>
             People
           </Button>
           <Button 
             variant="ghost" 
             size="sm" 
             onClick={() => setFilterLabels(!filterLabels)}
             className={cn("h-9 text-sm text-slate-700 bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-white shadow-sm", filterLabels && "bg-slate-800 text-white hover:bg-slate-900 border-slate-900")}
            >
             <div className={cn("w-4 h-4 rounded-full flex items-center justify-center mr-2 text-[10px] font-bold", filterLabels ? "bg-slate-700 text-slate-300" : "bg-slate-200 text-slate-500")}>
               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
             </div>
             Labels
           </Button>
        </div>

        {/* Board Canvas */}
        {activeView === "board" && (
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 pt-2">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full items-start gap-4">
            {filteredLists.map((list) => {
              // Mock WIP limit of 3 for demo
              const wipLimit = 3;
              const isOverWip = list.cards.length > wipLimit;

              return (
              <div key={list.id} className="flex-shrink-0 w-72 max-h-full flex flex-col rounded-xl bg-[#f4f5f7] shadow-sm">
                
                {/* List Header */}
                <div className="p-3 pl-4 flex items-center justify-between shrink-0">
                  <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                    {list.title}
                    {list.emoji && <span>{list.emoji}</span>}
                    {/* WIP Limit Display (Pro Feature) */}
                    <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded-full ml-1", isOverWip ? "bg-red-100 text-red-700" : "bg-slate-200 text-slate-500")}>
                      {list.cards.length} / {wipLimit}
                    </span>
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
            )})}

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
        )}

        {/* Table View Placeholder */}
        {activeView === "table" && (
          <div className="flex-1 bg-white m-6 mt-2 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center justify-center text-center p-8">
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3z"></path><path d="M3 9h18"></path><path d="M3 15h18"></path><path d="M9 3v18"></path><path d="M15 3v18"></path></svg>
             </div>
             <h2 className="text-2xl font-bold text-slate-900 mb-2">Table View (Pro)</h2>
             <p className="text-slate-500 max-w-md">See your work in a spreadsheet-like list. Sort, filter, and edit cards quickly across all lists.</p>
          </div>
        )}

        {/* Calendar View Placeholder */}
        {activeView === "calendar" && (
          <div className="flex-1 bg-white m-6 mt-2 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center justify-center text-center p-8">
             <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
             </div>
             <h2 className="text-2xl font-bold text-slate-900 mb-2">Calendar View (Pro)</h2>
             <p className="text-slate-500 max-w-md">Visualize your due dates. See when work is planned and organize cards across weeks and months.</p>
          </div>
        )}

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

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Keyboard Shortcuts</h2>
              <button className="text-slate-400 hover:text-slate-600 transition-colors" onClick={() => setShowShortcuts(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-700 font-medium">Open Shortcuts</span>
                <span className="bg-slate-100 text-slate-700 font-mono text-sm px-2 py-1 rounded font-bold shadow-sm">?</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-700 font-medium">Add Card</span>
                <span className="bg-slate-100 text-slate-700 font-mono text-sm px-2 py-1 rounded font-bold shadow-sm">c</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-700 font-medium">Search</span>
                <span className="bg-slate-100 text-slate-700 font-mono text-sm px-2 py-1 rounded font-bold shadow-sm">/</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-700 font-medium">Assign to me</span>
                <span className="bg-slate-100 text-slate-700 font-mono text-sm px-2 py-1 rounded font-bold shadow-sm">Space</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
