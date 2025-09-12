import {Router, Request, Response} from 'express';
import pool from '../models/db';
import { successResponse,errorResponse } from '../utils/response';
import { authMiddleware } from '../middlewares/authMiddleware';
import { fetchAllConversationByUserId } from '../controllers/conversationController';
const conversationRouter = Router();

conversationRouter.get('/',authMiddleware,fetchAllConversationByUserId);
export default conversationRouter;