"use client"
import React, { useState } from 'react';

// Define TypeScript interfaces for the Kanban board data
interface Task {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  dueDate: string;
  assignee: string;
  assigneeBg: string;
  completed?: boolean;
}

interface Column {
  id: string;
  title: string;
  dotColor: string;
  tasks: Task[];
}

export default function Page() {
  // Initial board state using TypeScript types
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: 'To Do',
      dotColor: 'bg-amber-500',
      tasks: [
        {
          id: 't1',
          tag: 'High Priority',
          tagColor: 'bg-red-100 text-red-700',
          title: 'Redesign landing page hero section',
          dueDate: 'Due Tomorrow',
          assignee: 'AS',
          assigneeBg: 'bg-blue-100 text-blue-700',
        },
        {
          id: 't2',
          tag: 'Feature',
          tagColor: 'bg-blue-100 text-blue-700',
          title: 'Implement user authentication flow',
          dueDate: 'Due Oct 12',
          assignee: 'JD',
          assigneeBg: 'bg-gray-200 text-gray-700',
        },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      dotColor: 'bg-blue-500',
      tasks: [
        {
          id: 't3',
          tag: 'Development',
          tagColor: 'bg-emerald-100 text-emerald-700',
          title: 'Tailwind CSS layout restructuring',
          dueDate: 'Today',
          assignee: 'MK',
          assigneeBg: 'bg-purple-100 text-purple-700',
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      dotColor: 'bg-emerald-500',
      tasks: [
        {
          id: 't4',
          tag: 'Setup',
          tagColor: 'bg-gray-100 text-gray-600',
          title: 'Initialize project repository',
          dueDate: 'Completed',
          assignee: 'JD',
          assigneeBg: 'bg-gray-200 text-gray-700',
          completed: true,
        },
      ],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      
      {/* 1. Top Navigation Bar */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">
            Taskio <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md font-normal">Board</span>
          </h1>
          <span className="text-gray-300">|</span>
          <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition">
            Workspace
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Search cards..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <div className="w-8 h-8 bg-gray-700 text-white font-semibold rounded-full flex items-center justify-center text-sm">
            JD
          </div>
        </div>
      </header>

      {/* 2. Main Kanban Board Container */}
      <main className="flex-1 overflow-x-auto p-6">
        <div className="flex items-start gap-6 h-full min-w-max">
          
          {columns.map((column) => (
            <div 
              key={column.id} 
              className="w-80 bg-gray-200/60 rounded-xl p-4 flex flex-col max-h-full border border-gray-300/60"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`}></span>
                  {column.title} 
                  <span className="text-gray-400 text-xs font-normal">{column.tasks.length}</span>
                </h2>
                <button className="text-gray-500 hover:text-gray-800 font-bold text-lg cursor-pointer">
                  +
                </button>
              </div>

              {/* Cards List */}
              <div className="flex flex-col gap-3 overflow-y-auto pr-1">
                {column.tasks.map((task) => (
                  <div 
                    key={task.id}
                    className={`bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer ${
                      task.completed ? 'opacity-75' : ''
                    }`}
                  >
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${task.tagColor}`}>
                      {task.tag}
                    </span>
                    <p className={`text-sm font-medium text-gray-800 mt-2 ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 text-xs text-gray-500">
                      <span>{task.dueDate}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${task.assigneeBg}`}>
                        {task.assignee}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add a card footer button */}
              <button className="mt-3 w-full py-2 text-sm text-gray-600 hover:bg-gray-300/50 rounded-lg text-left px-2 transition font-medium">
                + Add a card
              </button>
            </div>
          ))}

          {/* Add Another List Column Button */}
          <div className="w-80 bg-gray-200/30 hover:bg-gray-200/50 border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center cursor-pointer transition h-20 text-gray-600 font-medium text-sm">
            + Add another list
          </div>

        </div>
      </main>
    </div>
  );
}