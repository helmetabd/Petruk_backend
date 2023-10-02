import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createEducationValidation, getEducationValidation, updateEducationValidation } from "../validation/education-validation.js";

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
    const userEducation = validate(createEducationValidation, request.body);

    userEducation.userId = user.id;

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();


    // userEducation.users.updated_at = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    const created = await prismaClient.education.create({
        data: userEducation,
        select: {
            instance_name: true,
            education_level: true,
            major: true,
            gpa: true,
            enrollment_year: true,
            graduation_year: true,
            users: {
                select: {
                    name: true,
                    email: true,
                }
            }
        }
    })
    await prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            updated_at: updated
        }
    })

    return { created }
}

const get = async (username) => {
    const validateUser = validate(getEducationValidation, username);

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

    const education = await prismaClient.education.findUnique({
        where: {
            userId: getUser.id
        },
        select: {
            id: true,
            instance_name: true,
            education_level: true,
            major: true,
            gpa: true,
            enrollment_year: true,
            graduation_year: true,
            users: {
                select: {
                    name: true,
                    email: true,
                }
            }
        }
    });

    if (!education) {
        throw new ResponseError(404, "user is not found");
    }

    return education;
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
    const updateEducation = validate(updateEducationValidation, request.body);

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    await prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            updated_at: updated
        }
    })

    return prismaClient.education.update({
        where: {
            userId: user.id
        },
        data: updateEducation,
        select: {
            id: true,
            instance_name: true,
            education_level: true,
            major: true,
            gpa: true,
            enrollment_year: true,
            graduation_year: true,
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