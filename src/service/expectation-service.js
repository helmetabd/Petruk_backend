import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { expectationValidation, getExpectationValidation } from "../validation/expectation-validation.js";

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
    const userExpectation = validate(expectationValidation, request.body);

    // userExpectation.userId = user.id;

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    // userExpectation.users.updated_at = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    // await prismaClient.user.update({
    //     where: {
    //         username: user.username
    //     },
    //     data: {
    //         updated_at: updated
    //     }
    // });

    // if (isNaN(parseFloat(userExpectation.salary_expectation))) {
    //     null
    // } else {
    //     userExpectation.salary_expectation = parseFloat(userExpectation.salary_expectation)
    // }

    return prismaClient.expectation.create({
        data: userExpectation,
        select: {
            salary_expectation: true,
            // users: {
            //     select: {
            //         name: true,
            //         email: true,
            //     }
            // }
        }
    })
}

const get = async (username) => {
    const validateUser = validate(getExpectationValidation, username);

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

    const expectation = await prismaClient.expectation.findUnique({
        where: {
            userId: user.id
        },
        select: {
            id: true,
            salary_expectation: true,
            users: {
                select: {
                    name: true,
                    email: true,
                }
            }
        }
    });

    if (!expectation) {
        throw new ResponseError(404, "user is not found");
    }

    return expectation;
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
    const updateExpectation = validate(expectationValidation, request.body);

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    await prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            updated_at: updated
        }
    })

    return prismaClient.expectation.update({
        where: {
            userId: user.id
        },
        data: updateExpectation,
        select: {
            id: true,
            salary_expectation: true,
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