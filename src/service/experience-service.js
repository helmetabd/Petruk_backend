import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createExperienceValidation, getExperienceValidation, updateExperienceValidation } from "../validation/experience-validation.js";

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
    const userExperience = validate(createExperienceValidation, request.body);

    userExperience.userId = user.id;

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();


    // userExperience.users.updated_at = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    await prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            updated_at: updated
        }
    })

    return prismaClient.experience.create({
        data: userExperience,
        select: {
            instance_name: true,
            position: true,
            start_work: true,
            end_work: true,
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
    const validateUser = validate(getExperienceValidation, username);

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

    const experience = await prismaClient.experience.findUnique({
        where: {
            userId: user.id
        },
        select: {
            id: true,
            instance_name: true,
            position: true,
            start_work: true,
            end_work: true,
            users: {
                select: {
                    name: true,
                    email: true,
                }
            }
        }
    });

    if (!experience) {
        throw new ResponseError(404, "experience is not found");
    }

    return experience;
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
    const updateExperience = validate(updateExperienceValidation, request.body);

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    await prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            updated_at: updated
        }
    })

    return prismaClient.experience.update({
        where: {
            userId: user.id
        },
        data: updateExperience,
        select: {
            id: true,
            instance_name: true,
            position: true,
            start_work: true,
            end_work: true,
            users: {
                select: {
                    name: true,
                    email: true,
                }
            }
        }
    })
}

const logout = async (request) => {
    const cookies = request.cookies;
    if (!cookies?.refreshToken) {
        throw new ResponseError(204, "No content!");
    };
    const refreshTkn = cookies.refreshToken;
    const user = await prismaClient.user.findFirst({
        where: {
            token: refreshTkn,
        },
    });
    if (!user) {
        throw new ResponseError(204, "No content!");
    };

    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            token: null
        },
        select: {
            username: true
        }
    });
}

export default {
    create,
    get,
    update,
    logout
}