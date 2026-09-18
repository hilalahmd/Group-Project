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
  labels: Label[];
  assignees: User[];
  checklists: Checklist[];
  comments: Comment[];
  attachments: Attachment[];
};

export type List = {
  id: string;
  title: string;
  cards: Card[];
};

export type Board = {
  id: string;
  title: string;
  workspaceId: string;
  isFavorite: boolean;
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
  { id: "l1", name: "Bug", color: "bg-red-500 text-white" },
  { id: "l2", name: "Feature", color: "bg-blue-500 text-white" },
  { id: "l3", name: "Design", color: "bg-purple-500 text-white" },
  { id: "l4", name: "Urgent", color: "bg-orange-500 text-white" },
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
    members: [MOCK_USERS[0]],
  },
];

export const MOCK_BOARDS: Board[] = [
  {
    id: "b1",
    title: "Product Roadmap",
    workspaceId: "w1",
    isFavorite: true,
    members: MOCK_USERS,
    lists: [
      {
        id: "list-1",
        title: "To Do",
        cards: [
          {
            id: "c1",
            title: "Design minimal landing page",
            description: "Update the landing page to match the new minimal aesthetic.",
            dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // +3 days
            labels: [MOCK_LABELS[2], MOCK_LABELS[1]],
            assignees: [MOCK_USERS[0], MOCK_USERS[3]],
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
            labels: [MOCK_LABELS[0], MOCK_LABELS[3]],
            assignees: [MOCK_USERS[1]],
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
        cards: [
          {
            id: "c3",
            title: "Implement drag and drop",
            labels: [MOCK_LABELS[1]],
            assignees: [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[2]],
            checklists: [],
            comments: [],
            attachments: [],
          },
        ],
      },
      {
        id: "list-3",
        title: "Done",
        cards: [
          {
            id: "c4",
            title: "Setup Next.js project",
            labels: [],
            assignees: [MOCK_USERS[2]],
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
    members: [MOCK_USERS[0], MOCK_USERS[3]],
    lists: [
      { id: "list-m1", title: "Ideas", cards: [] },
      { id: "list-m2", title: "Executing", cards: [] },
    ],
  },
];
