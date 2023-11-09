import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js"
import { createJobValidation, getJobValidation, setCompletedValidation, updateJobValidation } from "../validation/job-validation.js";

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
            },
            template: {
                connectOrCreate: {
                    where: {
                        name: job.template
                    },
                    create: {
                        name: job.template
                    }
                }
            },
            test: {
                connectOrCreate: {
                    where: {
                        name: job.test
                    },
                    create: {
                        name: job.test
                    }
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
            needs: true,
            skill: {
                select: {
                    name: true
                }
            },
            template: {
                select: {
                    name: true,
                    questionnaire: {
                        select: {
                            question: true,
                            type: true
                        }
                    }
                }
            },
            test: {
                select: {
                    name: true,
                    questionTest: {
                        select: {
                            question: true,
                            type: true
                        }
                    }
                }
            },
            author: {
                select: {
                    name: true,
                    email: true,
                }
            },
            created_at: true,
            updated_at: true
        }
    })
}

const get = async (request) => {
    // const validateUser = validate(getJobValidation, request.user);

    // // console.log(request.user);
    // const user = await prismaClient.user.findFirst({
    //     where: {
    //         username: validateUser
    //     },
    // });

    // // console.log(user);

    // if (!user) {
    //     throw new ResponseError(404, "user is not found");
    // }

    const job = await prismaClient.job.findUnique({
        where: {
            id: parseInt(request.params.id),
            // authorId: user.id
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
            needs: true,
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
            },
            template: {
                select: {
                    questionnaire: {
                        select: {
                            id: true,
                            question: true,
                            type: true,
                            options: true
                        }
                    }
                }
            },
            test: {
                select: {
                    questionTest: {
                        select: {
                            id: true,
                            question: true,
                            type: true,
                            options: true
                        }
                    }
                }
            },
            created_at: true,
            updated_at: true
        }
    });

    if (!job) {
        throw new ResponseError(404, "job is not found");
    }

    return job;
}

const getAll = async (request) => {
    let { page = 1, limit = 10, search_query, direction = 'asc', orderFrom, start, end } = request.query //menghasilkan string
    let skip = (page - 1) * limit
    const countOptionts = {}
    const options = {
        take: parseInt(limit),
        skip: skip,
        orderBy: {
            updated_at: 'desc'
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
            needs: true,
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
            },
            template: {
                select: {
                    id: true,
                    questionnaire: {
                        select: {
                            id: true,
                            question: true,
                            type: true
                        }
                    }
                }
            },
            test: {
                select: {
                    id: true,
                    questionTest: {
                        select: {
                            id: true,
                            question: true,
                            type: true,
                        }
                    }
                }
            },
            created_at: true,
            updated_at: true
        }
    }

    if (start && end) {
        options.where = {
            updated_at: {
                lte: new Date(end).toISOString(), // "2022-01-30T00:00:00.000Z"
                gte: new Date(start).toISOString(), // "2022-01-15T00:00:00.000Z"
            }
        }
        countOptionts.where = options.where
    }

    if (search_query) {
        options.where = {
            OR: [
                {
                    position: {
                        name: {
                            contains: search_query
                        }
                    }
                },
                {
                    division: {
                        name: {
                            contains: search_query
                        }
                    }
                },
                {
                    skill: {
                        some: {
                            name: {
                                contains: search_query
                            }
                        }
                    }
                },
            ]
        }
        countOptionts.where = options.where
    }
    if (orderFrom) {
        const order = orderFrom
        options.orderBy = {
            [order]: direction || 'asc'
        }
    }

    if (request.url === '/api/job-archived') {
        options.where = {
            ...options.where,
            completed: true
        }
        countOptionts.where = options.where
    } else {
        options.where = {
            ...options.where,
            completed: false
        }
        countOptionts.where = options.where
    }

    const job = await prismaClient.job.findMany(options)

    if (!job) {
        throw new ResponseError(404, "jobs is not found");
    }

    //informasi total data keseluruhan 
    const resultCount = await prismaClient.job.count(countOptionts)//integer jumlah total data user

    //generated total page
    const totalPage = Math.ceil(resultCount / limit)

    return {
        job,
        currentPage: page - 0,
        totalPage,
        resultCount
    };
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
        include: {
            role: true
        }
    });
    // console.log(user);
    if (!user) {
        throw new ResponseError(204, "No content!");
    };
    const updateJob = validate(updateJobValidation, request.body);

    updateJob.updated_at = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    const job = await prismaClient.job.findUnique({
        where: {
            id: parseInt(request.params.id)
        }
    })

    if (job.authorId === user.id || user.role.name === 'SUPER') {

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
                template: {
                    connectOrCreate: {
                        where: {
                            name: updateJob.template
                        },
                        create: {
                            name: updateJob.template
                        }
                    }
                },
                test: {
                    connectOrCreate: {
                        where: {
                            name: updateJob.test
                        },
                        create: {
                            name: updateJob.test
                        }
                    }
                }
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
                needs: true,
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
                },
                template: {
                    select: {
                        questionnaire: {
                            select: {
                                question: true,
                                type: true
                            }
                        }
                    }
                },
                test: {
                    select: {
                        questionTest: {
                            select: {
                                question: true,
                                type: true
                            }
                        }
                    }
                },
                created_at: true,
                updated_at: true
            }
        })
    } else {
        throw new ResponseError(403, "You dont have access to update this job!");
    }
}

const completed = async (request) => {
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
        include: {
            role: true
        }
    });
    // console.log(user);
    if (!user) {
        throw new ResponseError(204, "No content!");
    };
    const updateJobStatus = validate(setCompletedValidation, request.body);

    const update = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    const job = await prismaClient.job.findUnique({
        where: {
            id: parseInt(request.params.id)
        }
    })

    if (job.authorId === user.id || user.role.name === 'SUPER') {

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
                updated_at: update,
                completed: updateJobStatus.completed
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
                needs: true,
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
                },
                template: {
                    select: {
                        questionnaire: {
                            select: {
                                question: true,
                                type: true
                            }
                        }
                    }
                },
                test: {
                    select: {
                        questionTest: {
                            select: {
                                question: true,
                                type: true
                            }
                        }
                    }
                },
                created_at: true,
                updated_at: true
            }
        })
    } else {
        throw new ResponseError(403, "You dont have access to update this job!");
    }
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
        include: {
            role: true
        }
    });
    if (!user) {
        throw new ResponseError(204, "No content!");
    };

    const job = await prismaClient.job.findUnique({
        where: {
            id: parseInt(request.params.id)
        }
    })

    if (job.authorId === user.id || user.role.name === 'SUPER') {
        return prismaClient.job.delete({
            where: {
                id: parseInt(request.params.id)
            }
        })
    } else {
        throw new ResponseError(403, "You dont have access to delete this job!");
    }

}

export default {
    create,
    get,
    getAll,
    update,
    completed,
    remove
}