import { prismaClient } from "../application/database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// const jwt = require('jsonwebtoken');

export const authMiddleware = async (req, res, next) => {
    // const token = req.get('Authorization');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // console.log(token);
    // console.log(req);
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
        res.status(401).json({
            errors: "Unauthorized"
        }).end();
    };
    if (!token) {
        res.status(401).json({
            errors: "Unauthorized"
        }).end();
    } else {
        // console.log(req.username);
        dotenv.config();
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                // console.log(decoded);
                if (err) {
                    res.status(403).json({
                        errors: "invalid token"
                    }).end();
                };
                req.user = decoded.username;
                next();
            }
        )
    }
}