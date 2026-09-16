import { Router } from 'express';
import {
  getTemplates,
  getBoards,
  getBoardById,
  applyTemplate,
  createBoard,
  createList,
  createCard
} from './board.controller.js';

const router = Router();

// Templates endpoints
router.get('/templates', getTemplates);

// Boards endpoints
router.get('/boards', getBoards);
router.get('/boards/:id', getBoardById);
router.post('/boards', createBoard);
router.post('/boards/apply-template', applyTemplate);

// Lists & Cards endpoints
router.post('/boards/:boardId/lists', createList);
router.post('/lists/:listId/cards', createCard);

export default router;
