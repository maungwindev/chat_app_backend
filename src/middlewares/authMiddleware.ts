import { Request,Response,NextFunction } from "express"
import { successResponse, errorResponse } from "../utils/response";
import jwt from 'jsonwebtoken';
import { error } from "console";
export const authMiddleware = (req:Request,res:Response, next:NextFunction):void=>{
    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
         errorResponse(res,'No Token Provided',403,false);
         return;
    }
   
    try{
        const decoded = jwt.verify(token, process.env.JWT_TOKEN || 'chatsecretkey');
        req.user = decoded as {id:string};
        next();
    }catch(error){
        errorResponse(res,'Invalid Token',401,false);
        return;
    }
}