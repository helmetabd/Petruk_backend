import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getSkillValidation, skillValidation } from "../validation/skill-validation.js";

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
    const userSkill = validate(skillValidation, request.body);

    userSkill.userId = user.id;

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    // userSkill.users.updated_at = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    // console.log(userSkill);
    if (user.role === "ADMIN" || user.role === 'SUPER') {
        return prismaClient.skill.createMany({
            data: userSkill.skill,
        })
    } else if (user.role === "USER") {
        return prismaClient.user.update({
            where: {
                username: user.username
            },
            data: {
                updated_at: updated,
                skills: {
                    connectOrCreate: userSkill.skill.map((tag) => {
                        return {
                            where: { name: tag.name },
                            create: { name: tag.name }
                        };
                    })
                }
            },
            select: {
                name: true,
                username: true,
                email: true,
                skills: true
            }
        });
    }
}

const get = async (username) => {
    const validateUser = validate(getSkillValidation, username);

    const user = await prismaClient.user.findFirst({
        where: {
            username: validateUser
        },
        select: {
            id: true,
            role: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    if (user.role === "USER") {
        const skill = await prismaClient.skill.findMany({
            where: {
                users: {
                    some: {
                        id: user.id
                    }
                }
            },
            select: {
                id: true,
                name: true,
            }
        });

        if (!skill) {
            throw new ResponseError(404, "user is not found");
        }

        return skill;

    } else if (user.role === "ADMIN" || user.role === 'SUPER') {
        const skill = await prismaClient.skill.findMany({
            select: {
                id: true,
                name: true,
            }
        });

        if (!skill) {
            throw new ResponseError(404, "user is not found");
        }

        return skill;
    }
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
    const updateSkill = validate(skillValidation, request.body);

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            updated_at: updated,
            skills: {
                connectOrCreate: updateSkill.skill.map((tag) => {
                    return {
                        where: { name: tag.name },
                        create: { name: tag.name }
                    };
                })
            }
        },
        select: {
            name: true,
            username: true,
            email: true,
            skills: true
        }
    });
}

const remove = async (request) => {
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

    // console.log(request.params.id);

    if (user.role === "ADMIN" || user.role === 'SUPER') {
        return prismaClient.skill.delete({
            where: {
                id: parseInt(request.params.id)
            }
        })
    } else if (user.role === "USER") {
        return prismaClient.user.update({
            where: {
                username: user.username
            },
            data: {
                skills: {
                    // set
                    disconnect: {
                        id: parseInt(request.params.id)
                    },
                    // delete: {
                    //     id: parseInt(request.params.id)
                    // }
                }
            },
            select: {
                username: true
            }
        });
    }
}

const jobSkillRemove = async (request) => {
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

    // console.log(request.params.id);

    return prismaClient.job.update({
        where: {
            id: parseInt(request.params.id),
            authorId: user.id
        },
        data: {
            skill: {
                // set
                disconnect: {
                    id: parseInt(request.params.skill)
                },
                // delete: {
                //     id: parseInt(request.params.id)
                // }
            }
        }
    });
}

export default {
    create,
    get,
    update,
    remove,
    jobSkillRemove
}