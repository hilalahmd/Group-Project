
"use client";

import { useState } from "react";

type Board = {
  id: number;
  title: string;
  workspace: string;
  color: string;
  starred?: boolean;
};

const recentBoards: Board[] = [
  {
    id: 1,
    title: "Flowboard Development",
    workspace: "Flowboard Team",
    color: "bg-blue-600",
    starred: true,
  },
  {
    id: 2,
    title: "Website Development",
    workspace: "Development",
    color: "bg-purple-600",
  },
  {
    id: 3,
    title: "E-Commerce Project",
    workspace: "Flowboard Team",
    color: "bg-green-600",
  },
  {
    id: 4,
    title: "Marketing Planning",
    workspace: "Marketing",
    color: "bg-orange-500",
  },
];

const starredBoards = recentBoards.filter((board) => board.starred);

export default function HomePage() {
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [boardName, setBoardName] = useState("");

  const createBoard = () => {
    if (!boardName.trim()) return;

    console.log("Creating board:", boardName);

    setBoardName("");
    setShowCreateBoard(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* ================= NAVBAR ================= */}

      <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-white px-4 shadow-sm md:px-6">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
            F
          </div>

          <span className="text-xl font-bold">
            Flowboard
          </span>
        </div>

        {/* Navigation */}
        <nav className="ml-8 hidden items-center gap-6 md:flex">
          <a
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Workspaces
          </a>

          <a
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Recent
          </a>

          <a
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Starred
          </a>
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">

          {/* Search */}
          <div className="hidden lg:block">
            <input
              type="text"
              placeholder="Search boards..."
              className="w-56 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Notification */}
          <button
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Notifications"
          >
            🔔
          </button>

          {/* Avatar */}
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
            Y
          </button>
        </div>
      </header>

      {/* ================= PAGE ================= */}

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">

        {/* ================= WELCOME ================= */}

        <section className="mb-10">

          <h1 className="text-3xl font-bold">
            Welcome back, Yadu 👋
          </h1>

          <p className="mt-2 text-gray-500">
            Pick up where you left off.
          </p>

        </section>

        {/* ================= RECENT BOARDS ================= */}

        <section className="mb-12">

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold">
                Recently viewed
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Boards you've recently worked on
              </p>
            </div>

            <button
              onClick={() => setShowCreateBoard(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              + Create
            </button>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {recentBoards.map((board) => (

              <button
                key={board.id}
                className="group overflow-hidden rounded-xl border bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                {/* Board Cover */}
                <div
                  className={`h-24 ${board.color} p-4`}
                >
                  {board.starred && (
                    <span className="rounded bg-white/20 px-2 py-1 text-sm text-white">
                      ★
                    </span>
                  )}
                </div>

                {/* Board Information */}
                <div className="p-4">

                  <h3 className="font-semibold transition group-hover:text-blue-600">
                    {board.title}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {board.workspace}
                  </p>

                </div>

              </button>

            ))}

          </div>

        </section>

        {/* ================= STARRED ================= */}

        <section className="mb-12">

          <div className="mb-5">

            <h2 className="text-xl font-bold">
              Starred boards
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your favorite boards
            </p>

          </div>

          <div className="overflow-hidden rounded-xl border bg-white">

            {starredBoards.length > 0 ? (

              starredBoards.map((board) => (

                <button
                  key={board.id}
                  className="flex w-full items-center gap-4 border-b p-4 text-left last:border-b-0 hover:bg-gray-50"
                >

                  <div
                    className={`h-12 w-12 rounded-lg ${board.color}`}
                  />

                  <div className="flex-1">

                    <h3 className="font-medium">
                      {board.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {board.workspace}
                    </p>

                  </div>

                  <span className="text-xl text-yellow-500">
                    ★
                  </span>

                </button>

              ))

            ) : (

              <div className="p-8 text-center">

                <div className="mb-3 text-3xl">
                  ☆
                </div>

                <p className="font-medium">
                  No starred boards
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Star a board to find it quickly here.
                </p>

              </div>

            )}

          </div>

        </section>

        {/* ================= WORKSPACES ================= */}

        <section>

          <div className="mb-5">

            <h2 className="text-xl font-bold">
              Your workspaces
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Boards organized by workspace
            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Workspace 1 */}
            <div className="rounded-xl border bg-white p-5">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-600">
                  F
                </div>

                <div>

                  <h3 className="font-semibold">
                    Flowboard Team
                  </h3>

                  <p className="text-sm text-gray-500">
                    5 members · 3 boards
                  </p>

                </div>

              </div>

              <div className="space-y-2">

                <button className="flex w-full items-center justify-between rounded-lg p-3 text-left hover:bg-gray-50">

                  <span className="text-sm">
                    📋 Flowboard Development
                  </span>

                  <span className="text-gray-400">
                    →
                  </span>

                </button>

                <button className="flex w-full items-center justify-between rounded-lg p-3 text-left hover:bg-gray-50">

                  <span className="text-sm">
                    📋 E-Commerce Project
                  </span>

                  <span className="text-gray-400">
                    →
                  </span>

                </button>

              </div>

              <button className="mt-4 w-full rounded-lg border border-dashed px-4 py-2 text-sm font-medium text-gray-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600">
                + Create board
              </button>

            </div>

            {/* Workspace 2 */}
            <div className="rounded-xl border bg-white p-5">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-100 font-bold text-purple-600">
                  D
                </div>

                <div>

                  <h3 className="font-semibold">
                    Development
                  </h3>

                  <p className="text-sm text-gray-500">
                    3 members · 2 boards
                  </p>

                </div>

              </div>

              <div className="space-y-2">

                <button className="flex w-full items-center justify-between rounded-lg p-3 text-left hover:bg-gray-50">

                  <span className="text-sm">
                    📋 Website Development
                  </span>

                  <span className="text-gray-400">
                    →
                  </span>

                </button>

                <button className="flex w-full items-center justify-between rounded-lg p-3 text-left hover:bg-gray-50">

                  <span className="text-sm">
                    📋 Backend API
                  </span>

                  <span className="text-gray-400">
                    →
                  </span>

                </button>

              </div>

              <button className="mt-4 w-full rounded-lg border border-dashed px-4 py-2 text-sm font-medium text-gray-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600">
                + Create board
              </button>

            </div>

          </div>

        </section>

      </main>

      {/* ================= CREATE BOARD MODAL ================= */}

      {showCreateBoard && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Create board
              </h2>

              <button
                onClick={() => setShowCreateBoard(false)}
                className="text-xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>

            </div>

            <label className="mb-2 block text-sm font-medium">
              Board name
            </label>

            <input
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="e.g. Website Development"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => setShowCreateBoard(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={createBoard}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Create board
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

