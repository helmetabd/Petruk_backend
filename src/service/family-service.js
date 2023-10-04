import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { familyValidation, getFamilyValidation } from "../validation/family-validation.js";

const create = async (request) => {
    const cookies = request.cookies;
    if (!cookies?.refreshToken) {
        throw new ResponseError(204, "No content!");
    };
    const refreshTkn = cookies.refreshToken;
    // console.log(refreshTkn);
    const user = await prismaClient.user.findFirst({
        where: {
            token: refreshTkn,
        },
    });
    // console.log(user);
    if (!user) {
        throw new ResponseError(204, "No content!");
    };
    const userFamily = validate(familyValidation, request.body);

    userFamily.userId = user.id;

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();


    // userFamily.users.updated_at = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    await prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            updated_at: updated
        }
    });

    return prismaClient.family.create({
        data: userFamily,
        select: {
            name: true,
            status: true,
            address: true,
            phone: true,
            users: {
                select: {
                    name: true,
                    email: true,
                }
            }
        }
    })
}

const get = async (username) => {
    const validateUser = validate(getFamilyValidation, username);

    const user = await prismaClient.user.findFirst({
        where: {
            username: validateUser
        },
        select: {
            id: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    const family = await prismaClient.family.findUnique({
        where: {
            userId: user.id
        },
        select: {
            id: true,
            name: true,
            status: true,
            address: true,
            phone: true,
            users: {
                select: {
                    name: true,
                    email: true,
                }
            }
        }
    });

    if (!family) {
        throw new ResponseError(404, "user is not found");
    }

    return family;
}

const update = async (request) => {
    const cookies = request.cookies;
    if (!cookies?.refreshToken) {
        throw new ResponseError(204, "No content!");
    };
    const refreshTkn = cookies.refreshToken;
    // console.log(refreshTkn);
    const user = await prismaClient.user.findFirst({
        where: {
            token: refreshTkn,
        },
    });
    // console.log(user);
    if (!user) {
        throw new ResponseError(204, "No content!");
    };
    const updatefamily = validate(familyValidation, request.body);

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    await prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            updated_at: updated
        }
    })

    return prismaClient.family.update({
        where: {
            userId: user.id
        },
        data: updatefamily,
        select: {
            id: true,
            name: true,
            status: true,
            address: true,
            phone: true,
            users: {
                select: {
                    name: true,
                    email: true,
                }
            }
        }
    })
}

export default {
    create,
    get,
    update,
}