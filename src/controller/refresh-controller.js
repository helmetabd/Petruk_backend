import { prismaClient } from "../application/database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// const jwt = require('jsonwebtoken');

export const refreshController = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
        res.sendStatus(401);
    };
    // console.log(cookies.refreshToken);
    const refreshTkn = cookies.refreshToken;
    // console.log(refreshTkn);
    const user = await prismaClient.user.findFirst({
        where: {
            token: refreshTkn,
        },
        select: {
            token: true,
            username: true
        }
    });
    // console.log(user);
    if (!user) {
        res.sendStatus(403);
    };
    dotenv.config();
    jwt.verify(
        refreshTkn,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            // console.log(decoded);
            if (err || user.username !== decoded.username) {
                res.sendStatus(403);
            };
            const accessToken = jwt.sign(
                { "username": decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '900s' }
            );
            // console.log(accessToken);
            res.json({ accessToken });
        }
    )
}