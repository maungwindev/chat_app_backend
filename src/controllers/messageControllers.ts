import { Request,Response } from "express"
import { successResponse,errorResponse } from "../utils/response";
import pool from '../models/db';
export const fetchAllMessageByConversationId = async( req:Request,res:Response)=>{
    const {conversationId} = req.params;

    try{
        const result = await pool.query(
            `
                SELECT m.id,m.content,m.sender_id,m.conversation_id,m.created_at
                FROM messages m
                WHERE m.conversation_id = $1
                Order By m.created_at ASC;
            `,
            [conversationId]
        );

        successResponse(res,'Successful Fetch Message',200,result.rows);
        return;
    }catch(error){
        errorResponse(res,'Failed to fetch messages',500,error);
        return;
    }
}

export const saveMessage = async (conversationId:string, senderId:string , contents:string)=>{

    try{
        const result = await pool.query(
            `
                INSERT INTO messages (conversation_id,sender_id,content)
                Values ($1,$2,$3)
                Returning *;
            `,
            [conversationId,senderId,contents]
        );

        // successResponse(,'Successful Fetch Message',201,result.rows[0]);
        return result.rows[0];
    }catch(error){
        console.error('Error saving message: ', error);
        // errorResponse(res,'Failed to fetch messages',500,error);
        throw new Error('Failed to save message');
    }
}