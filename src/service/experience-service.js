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

    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            updated_at: updated,
            experience: {
                connectOrCreate: userExperience.experience.map((tag) => {
                    return {
                        where: {
                            userId: userExperience.userId,
                            instance_name: tag.instance_name,
                            position: tag.position
                        },
                        create: {
                            instance_name: tag.instance_name,
                            position: tag.position,
                            salary: tag.salary,
                            reason: tag.reason,
                            start_work: tag.start_work,
                            end_work: tag.end_work
                        }
                    }
                })
            }
        },
        select: {
            name: true,
            nickname: true,
            experience: {
                select: {
                    instance_name: true,
                    position: true,
                    salary: true,
                    reason: true,
                    start_work: true,
                    end_work: true,
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

    const experience = await prismaClient.experience.findMany({
        where: {
            userId: user.id
        },
        select: {
            id: true,
            instance_name: true,
            position: true,
            salary: true,
            reason: true,
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
            userId: user.id,
            id: parseInt(request.params.id)
        },
        data: updateExperience,
        select: {
            id: true,
            instance_name: true,
            position: true,
            salary: true,
            reason: true,
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

const remove = async (request) => {
    const cookies = request.cookies;
    if (!cookies?.refreshToken) {
        throw new ResponseError(204, "No Content!");
    };
    const refreshTkn = cookies.refreshToken;

    const user = await prismaClient.user.findFirst({
        where: {
            token: refreshTkn,
        },
    });
    // console.log(user);
    if (!user) {
        throw new ResponseError(204, "No content!");
    };
    return prismaClient.experience.delete({
        where: {
            id: parseInt(request.params.id)
        }
    })
}

export default {
    create,
    get,
    update,
    remove
}