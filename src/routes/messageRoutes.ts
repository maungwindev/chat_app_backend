import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { fetchAllConversationByUserId } from "../controllers/conversationController";

const messageRouter = Router();

messageRouter.get('/:conversationId',authMiddleware,fetchAllConversationByUserId);

export default messageRouter;