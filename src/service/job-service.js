import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js"
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

    // const template = await prismaClient.template.upsert({
    //     create: {
    //         name: job.template,
    //         questionnaire: {
    //             connectOrCreate: job.questionnaire.map((tag) => {
    //                 return {
    //                     where: {
    //                         question: tag.question,
    //                     },
    //                     create: {
    //                         question: tag.question,
    //                     }
    //                 }
    //             })
    //         }
    //     },
    //     update: {
    //         name: job.template,
    //         questionnaire: {
    //             connectOrCreate: job.questionnaire.map((tag) => {
    //                 return {
    //                     where: {
    //                         question: tag.question,
    //                     },
    //                     create: {
    //                         question: tag.question,
    //                     }
    //                 }
    //             })
    //         }
    //     },
    //     where: {
    //         name: job.template
    //     },
    //     include: {
    //         questionnaire: true
    //     }
    // });

    // console.log(template.questionnaire);

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
    const validateUser = validate(getJobValidation, request.user);


    const user = await prismaClient.user.findFirst({
        where: {
            username: validateUser
        },
    });

    // console.log(user);

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

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

const getAll = async () => {
    // username = validate(getUserValidation, username);

    const job = await prismaClient.job.findMany({
        // where: {
        //     jobname: jobname
        // },
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
            template: {
                connectOrCreate: {
                    connectOrCreate: {
                        where: {
                            name: updateJob.template
                        },
                        create: {
                            name: updateJob.template
                        }
                    }
                }
            },
            test: {
                connectOrCreate: {
                    connectOrCreate: {
                        where: {
                            name: updateJob.test
                        },
                        create: {
                            name: updateJob.test
                        }
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