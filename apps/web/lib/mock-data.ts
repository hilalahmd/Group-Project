export type Label = {
  id: string;
  name: string;
  color: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  initials: string;
};

export type ChecklistItem = {
  id: string;
  title: string;
  isCompleted: boolean;
};

export type Checklist = {
  id: string;
  title: string;
  items: ChecklistItem[];
};

export type Attachment = {
  id: string;
  name: string;
  url: string;
  type: string;
  createdAt: string;
};

export type Comment = {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
};

export type Card = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  coverImageUrl?: string;
  labels: Label[];
  assignees: User[];
  checklists: Checklist[];
  comments: Comment[];
  attachments: Attachment[];
};

export type List = {
  id: string;
  title: string;
  emoji?: string;
  cards: Card[];
};

export type Board = {
  id: string;
  title: string;
  workspaceId: string;
  isFavorite: boolean;
  background?: { type: 'color' | 'image'; value: string };
  lists: List[];
  members: User[];
};

export type Workspace = {
  id: string;
  slug: string;
  name: string;
  members: User[];
};

export const MOCK_USERS: User[] = [
  { id: "u1", name: "Hilal Ahmed", email: "hilal@example.com", initials: "HA" },
  { id: "u2", name: "Yadhu Krishnan", email: "yadhu@example.com", initials: "YK" },
  { id: "u3", name: "Vyshnav P", email: "vyshnav@example.com", initials: "VP" },
  { id: "u4", name: "Afra", email: "afra@example.com", initials: "A" },
];

export const MOCK_LABELS: Label[] = [
  { id: "l1", name: "Bug", color: "bg-red-100 text-red-700" },
  { id: "l2", name: "Feature", color: "bg-sky-100 text-sky-700" },
  { id: "l3", name: "Design", color: "bg-fuchsia-100 text-fuchsia-700" },
  { id: "l4", name: "Urgent", color: "bg-amber-100 text-amber-700" },
];

export const MOCK_WORKSPACES: Workspace[] = [
  {
    id: "w1",
    slug: "acme-corp",
    name: "Acme Corp",
    members: MOCK_USERS,
  },
  {
    id: "w2",
    slug: "personal-projects",
    name: "Personal Projects",
    members: [MOCK_USERS[0]!],
  },
];

export const MOCK_BOARDS: Board[] = [
  {
    id: "b1",
    title: "Product Roadmap",
    workspaceId: "w1",
    isFavorite: true,
    background: { type: 'color', value: 'bg-indigo-500' },
    members: MOCK_USERS,
    lists: [
      {
        id: "list-1",
        title: "To Do",
        emoji: "📝",
        cards: [
          {
            id: "c1",
            title: "Design minimal landing page",
            description: "Update the landing page to match the new minimal aesthetic.",
            coverImageUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600&auto=format&fit=crop",
            dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // +3 days
            labels: [MOCK_LABELS[2]!, MOCK_LABELS[1]!],
            assignees: [MOCK_USERS[0]!, MOCK_USERS[3]!],
            checklists: [
              {
                id: "chk1",
                title: "Tasks",
                items: [
                  { id: "item1", title: "Create wireframes", isCompleted: true },
                  { id: "item2", title: "Review with team", isCompleted: false },
                ],
              },
            ],
            comments: [
              { id: "com1", userId: "u2", text: "Looks good to me!", createdAt: new Date().toISOString() },
            ],
            attachments: [],
          },
          {
            id: "c2",
            title: "Fix auth redirection loop",
            dueDate: new Date(Date.now() - 86400000 * 1).toISOString(), // -1 day (overdue)
            labels: [MOCK_LABELS[0]!, MOCK_LABELS[3]!],
            assignees: [MOCK_USERS[1]!],
            checklists: [],
            comments: [],
            attachments: [
              { id: "att1", name: "error-log.txt", url: "#", type: "text/plain", createdAt: new Date().toISOString() }
            ],
          },
        ],
      },
      {
        id: "list-2",
        title: "In Progress",
        emoji: "🔥",
        cards: [
          {
            id: "c3",
            title: "Implement drag and drop",
            labels: [MOCK_LABELS[1]!],
            assignees: [MOCK_USERS[0]!, MOCK_USERS[1]!, MOCK_USERS[2]!],
            checklists: [],
            comments: [],
            attachments: [],
          },
        ],
      },
      {
        id: "list-3",
        title: "Done",
        emoji: "✅",
        cards: [
          {
            id: "c4",
            title: "Setup Next.js project",
            labels: [],
            assignees: [MOCK_USERS[2]!],
            checklists: [],
            comments: [],
            attachments: [],
          },
        ],
      },
    ],
  },
  {
    id: "b2",
    title: "Marketing Campaign Q4",
    workspaceId: "w1",
    isFavorite: false,
    background: { type: 'image', value: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop' },
    members: [MOCK_USERS[0]!, MOCK_USERS[3]!],
    lists: [
      { id: "list-m1", title: "Ideas", cards: [] },
      { id: "list-m2", title: "Executing", cards: [] },
    ],
  },
];
