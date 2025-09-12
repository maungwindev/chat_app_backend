import { Request,Response } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import pool from "../models/db";
import { successResponse, errorResponse } from "../utils/response";

export const fetchAllConversationByUserId = async(req:Request,res:Response)=>{

    let userId = null;
    if(req.user){
        userId = req.user.id;
    }
     console.log("has userId",userId);
    try{
        const result = await pool.query(
            `SELECT c.id AS conversation_id,u.username AS participant_name, m.content AS last_message,m.created_at AS last_message_time FROM conversations c
             JOIN users u ON (u.id = c.participant_two AND u.id != $1)
             LEFT JOIN LATERAL (
                SELECT content, created_at
                FROM messages
                WHERE conversation_id = c.id
                ORDER BY created_at DESC
                LIMIT 1
             ) m ON true
              WHERE c.participant_one = $1 OR c.participant_two = $1
              ORDER BY m.created_at DESC
            `,
            [userId]
        );

        console.log("user id ::",result.rows);
        res.json(result.rows);

    }catch(error){
        return errorResponse(res,"Failed to Fetch Conversation",500,error);
    }
};
