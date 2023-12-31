import { prismaClient } from "../application/database.js";

export const superMiddleware = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
        res.sendStatus(401);
    };
    const refreshTkn = cookies.refreshToken;
    const user = await prismaClient.user.findFirst({
        where: {
            token: refreshTkn,
        },
        select: {
            role: true
        }
    });
    if (!user) {
        res.sendStatus(401);
    };
    console.log(user);
    if (user.role.name === 'SUPER') {
        next();
    } else {
        res.sendStatus(403);
    }

}