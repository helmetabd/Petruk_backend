import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createJobValidation, getJobValidation, updateJobValidation } from "../validation/job-validation.js";

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


    const job = validate(createJobValidation, request.body);

    // console.log(user);

    // job.authorId = user.id;
    // job.user = user;

    job.created_at = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();
    job.updated_at = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    // console.log(job);

    return prismaClient.job.create({
        data: {
            author: {
                connect: {
                    username: user.username
                }
            },
            ...job,
            skill: {
                connectOrCreate: job.skill.map((tag) => {
                    return {
                        where: { name: tag.name },
                        create: { name: tag.name }
                    };
                })
            },
            position: {
                connectOrCreate: {
                    where: {
                        name: job.position,
                    },
                    create: {
                        name: job.position,
                    },
                }
            },
            division: {
                connectOrCreate: {
                    where: {
                        name: job.division,
                    },
                    create: {
                        name: job.division,
                    },
                }
            }
        },
        select: {
            position: {
                select: {
                    name: true
                }
            },
            division: {
                select: {
                    name: true
                }
            },
            details: true,
            salary: true,
            skill: {
                select: {
                    name: true
                }
            },
            author: {
                select: {
                    name: true,
                    email: true,
                }
            }
        }
    })
}

const get = async (request) => {
    const validateUser = validate(getJobValidation, request.user);


    const user = await prismaClient.user.findFirst({
        where: {
            username: validateUser
        },
        select: {
            id: true
        }
    });

    // console.log(user);

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    const job = await prismaClient.job.findUnique({
        where: {
            id: parseInt(request.params.id),
            authorId: user.id
        },
        select: {
            position: {
                select: {
                    name: true
                }
            },
            division: {
                select: {
                    name: true
                }
            },
            details: true,
            salary: true,
            skill: {
                select: {
                    name: true
                }
            },
            author: {
                select: {
                    name: true,
                    email: true,
                }
            }
        }
    });

    if (!job) {
        throw new ResponseError(404, "job is not found");
    }

    return job;
}

const getAll = async () => {
    // username = validate(getUserValidation, username);

    const job = await prismaClient.job.findMany({
        // where: {
        //     jobname: jobname
        // },
        select: {
            position: {
                select: {
                    name: true
                }
            },
            division: {
                select: {
                    name: true
                }
            },
            details: true,
            salary: true,
            skill: {
                select: {
                    name: true
                }
            },
            author: {
                select: {
                    name: true,
                    email: true,
                }
            }
        }
    });

    if (!job) {
        throw new ResponseError(404, "jobs is not found");
    }

    return job;
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
    const updateJob = validate(updateJobValidation, request.body);

    updateJob.updated_at = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    return prismaClient.job.update({
        where: {
            id: parseInt(request.params.id),
            authorId: user.id
        },
        data: {
            author: {
                connect: {
                    id: user.id
                }
            },
            ...updateJob,
            skill: {
                connectOrCreate: updateJob.skill.map((tag) => {
                    return {
                        where: { name: tag.name },
                        create: { name: tag.name }
                    };
                })
            },
        },
        select: {
            id: true,
            position: {
                select: {
                    name: true
                }
            },
            division: {
                select: {
                    name: true
                }
            },
            details: true,
            salary: true,
            skill: {
                select: {
                    name: true
                }
            },
            author: {
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

    return prismaClient.job.delete({
        where: {
            id: parseInt(request.params.id)
        }
    })
}

export default {
    create,
    get,
    getAll,
    update,
    remove
}