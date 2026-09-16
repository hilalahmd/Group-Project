import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CardItem {
  id: string | number;
  listId: string | number;
  title: string;
  description?: string | null;
  position: number;
}

export interface ListItem {
  id: string | number;
  boardId: string | number;
  name: string;
  position: number;
  cards: CardItem[];
}

export interface BoardItem {
  id: string | number;
  name: string;
  slug: string;
  description?: string | null;
  visibility: string;
  isTemplate: boolean;
  category?: string | null;
  coverColor?: string | null;
  coverImage?: string | null;
  usedCount?: number;
  createdAt: string;
  lists?: ListItem[];
}

export const boardApi = {
  // Fetch available template boards
  getTemplates: async (params?: { category?: string; search?: string }): Promise<BoardItem[]> => {
    try {
      const res = await api.get('/api/templates', { params });
      return res.data.data || [];
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      return [];
    }
  },

  // Fetch active user boards
  getBoards: async (params?: { search?: string; sort?: string }): Promise<BoardItem[]> => {
    try {
      const res = await api.get('/api/boards', { params });
      return res.data.data || [];
    } catch (error) {
      console.error('Failed to fetch boards:', error);
      return [];
    }
  },

  // Fetch single board with full lists and cards
  getBoardById: async (id: string | number): Promise<BoardItem | null> => {
    try {
      const res = await api.get(`/api/boards/${id}`);
      return res.data.data || null;
    } catch (error) {
      console.error('Failed to fetch board details:', error);
      return null;
    }
  },

  // Apply template to create a new board pre-populated with cloned lists and cards
  applyTemplate: async (payload: { templateId: string | number; name: string; workspaceId?: string | number }): Promise<BoardItem | null> => {
    try {
      const res = await api.post('/api/boards/apply-template', payload);
      return res.data.data || null;
    } catch (error) {
      console.error('Failed to apply template:', error);
      throw error;
    }
  },

  // Create a blank board
  createBoard: async (payload: { name: string; description?: string; coverColor?: string; coverImage?: string }): Promise<BoardItem | null> => {
    try {
      const res = await api.post('/api/boards', payload);
      return res.data.data || null;
    } catch (error) {
      console.error('Failed to create board:', error);
      throw error;
    }
  },

  // Create a list in a board
  createList: async (boardId: string | number, name: string): Promise<ListItem | null> => {
    try {
      const res = await api.post(`/api/boards/${boardId}/lists`, { name });
      return res.data.data || null;
    } catch (error) {
      console.error('Failed to create list:', error);
      throw error;
    }
  },

  // Create a card in a list
  createCard: async (listId: string | number, title: string, description?: string): Promise<CardItem | null> => {
    try {
      const res = await api.post(`/api/lists/${listId}/cards`, { title, description });
      return res.data.data || null;
    } catch (error) {
      console.error('Failed to create card:', error);
      throw error;
    }
  }
};

export default api;
