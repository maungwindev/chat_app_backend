import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../models/db';
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../utils/response";
const SALT_ROUNDS = 10; // or load from env
const JWT_SECRET = process.env.JWT_SECRET || 'chatsecretkey';

export const register = async (req: Request, res: Response) => {
    //1. get username , email , password 
    //2. Insert those data into our db
    //  3. return message , user

    const { username, email, password } = req.body;

    try {
        // 1️⃣ Check if email already exists
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return errorResponse(res, "Email is already registered", 400);
        }

        const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const result = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, hashPassword]
        );
        const user = result.rows[0];
        return successResponse(res, "User registered successfully", user, 201);
    } catch (error) {
        return errorResponse(res, "Failed to register user", 500, error);
    }

}

export const login = async (req: Request, res: Response): Promise<any> => {
    //1. get  email , password 
    //2. Verify if email exist
    //  3. Compare psw --> 'Invalid credentials'
    // 4. return token

    const { email, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        const user = result.rows[0];
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '10h' });

        return successResponse(res, "Logged in successfully", { token },200);

    } catch (error) {
        return errorResponse(res, "Failed to log in", 500, error);
    }

}