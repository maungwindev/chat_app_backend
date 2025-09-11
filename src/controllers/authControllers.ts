import {Request , Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../models/db';
import jwt from "jsonwebtoken";
const SALT_ROUNDS = 10; // or load from env
const JWT_SECRET = process.env.JWT_SECRET || 'chatsecretkey';

export const register = async (req:Request,res:Response)=>{
    //1. get username , email , password 
    //2. Insert those data into our db
    //  3. return message , user

    const { username , email, password } = req.body;

    try{
        const hashPassword = await bcrypt.hash(password,SALT_ROUNDS);
         const result = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, hashPassword]
        );
        const user  = result.rows[0];
        res.status(201).json({message:'User registered successfully',user});
    }catch(error){
        res.status(500).json({error:'Failed to register user'});
    }

}

export const login = async (req:Request,res:Response): Promise<any> => {
    //1. get  email , password 
    //2. Verify if email exist
    //  3. Compare psw --> 'Invalid credentials'
    // 4. return token

    const { email, password } = req.body;
    try{
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        const user = result.rows[0];
        if(!user) return res.status(404).json({error:'User not found'});

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({error: 'Invalid credentials'});

        const token = jwt.sign({id:user.id},JWT_SECRET,{expiresIn:'10h'});

        res.status(200).json({message: "Logged in successfully",token});

    }catch(error){
        res.status(500).json({error:'Failed to log in'});
    }
    
}