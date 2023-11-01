import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createApplicantValidation, getApplicantValidation, updateApplicantValidation } from "../validation/applicant-validation.js";
import { validate } from "../validation/validation.js"

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
        include: {
            profile: true,
            education: true
        }
    });
    // console.log(user);
    if (!user) {
        throw new ResponseError(204, "No content!");
    };

    const findEducation = await prismaClient.education.findMany({
        where: {
            userId: user.id
        }
    })

    if (!findEducation) {
        throw new ResponseError(204, "No content!");
    };
    const findProfile = await prismaClient.profile.findUnique({
        where: {
            id: user.profile.id
        }
    })

    if (!findProfile) {
        throw new ResponseError(204, "No content!");
    };

    const userApplicant = validate(createApplicantValidation, request.body);
    // const userApplicant = request.body;

    // console.log(userApplicant)

    userApplicant.userId = user.id;

    // userApplicant.status = 'Submitted';
    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    let option = {
        application_date: updated,
        status: 'Submitted',
        // description: userApplicant.description,
        jobId: parseInt(request.params.id)
    }

    if (userApplicant.recomendation) {
        option = {
            ...option,
            recomendations: {
                create: userApplicant.recomendation.map((tag) => {
                    return {
                        name: tag.name,
                        phone: tag.phone,
                        job: tag.job,
                        status: tag.status
                    }
                })
            }
        }
    }


    // userApplicant.users.updated_at = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            updated_at: updated,
            applicant: {
                connectOrCreate: {
                    where: {
                        jobId_userId: {
                            jobId: parseInt(request.params.id),
                            userId: userApplicant.userId
                        }
                    },
                    create: option
                }
            },
        },
        select: {
            name: true,
            nickname: true,
            applicant: {
                select: {
                    job: {
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
                            }
                        }
                    },
                    recomendations: true,
                    application_date: true,
                    status: true,
                }
            }
        }
    });
}

// const getByJob = async (request) => {
//     const validateUser = validate(getApplicantValidation, request.user);

//     const user = await prismaClient.user.findFirst({
//         where: {
//             username: validateUser
//         },
//         select: {
//             id: true,
//             role: true
//         }
//     });

//     if (!user) {
//         throw new ResponseError(404, "user is not found");
//     }

//     let { page = 1, limit = 10, search_query, direction = 'asc', orderFrom } = request.query //menghasilkan string
//     let skip = (page - 1) * limit
//     const countOptionts = {}
//     const options = {
//         take: parseInt(limit),
//         skip: skip,
//         orderBy: {
//             application_date: 'desc'
//         },
//         select: {
//             id: true,
//             job: {
//                 select: {
//                     id: true,
//                     division: {
//                         select: {
//                             name: true
//                         }
//                     },
//                     position: {
//                         select: {
//                             name: true
//                         }
//                     }
//                 }
//             },
//             application_date: true,
//             interview_date: true,
//             placed_date: true,
//             status: true,
//             description: true,
//             user: {
//                 select: {
//                     name: true,
//                     nickname: true
//                 }
//             }
//         }
//     }

//     if (search_query) {
//         options.where = {
//             OR: [
//                 {
//                     job: {
//                         position: {
//                             name: {
//                                 contains: search_query
//                             }
//                         }
//                     }
//                 },
//                 {
//                     job: {
//                         division: {
//                             name: {
//                                 contains: search_query
//                             }
//                         }
//                     }
//                 },
//                 {
//                     user: {
//                         name: {
//                             contains: search_query
//                         }
//                     }
//                 },
//             ]
//         }
//         countOptionts.where = options.where
//     }
//     if (orderFrom) {
//         const order = orderFrom
//         options.orderBy = {
//             [order]: direction || 'asc'
//         }
//     }

//     if (user.role.name === 'USER') {
//         options.where = {
//             ...options.where,
//             userId: user.id
//         }
//         countOptionts.where = options.where
//     }

//     // else if (user.role.name === 'ADMIN' || user.role.name === 'SUPER') {
//     //     options.where = null
//     // }
//     const applicant = await prismaClient.applicant.findMany(options);

//     //informasi total data keseluruhan 
//     const resultCount = await prismaClient.applicant.count(countOptionts)//integer jumlah total data user

//     //generated total page
//     const totalPage = Math.ceil(resultCount / limit)

//     if (!applicant) {
//         throw new ResponseError(404, "applicant is not found");
//     }

//     return {
//         applicant,
//         currentPage: page - 0,
//         totalPage,
//         resultCount
//     };
// }

const getAll = async (request) => {
    const validateUser = validate(getApplicantValidation, request.user);

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

    let { page = 1, limit = 10, search_query, direction = 'asc', orderFrom } = request.query //menghasilkan string
    let skip = (page - 1) * limit
    const countOptionts = {}
    const options = {
        take: parseInt(limit),
        skip: skip,
        orderBy: {
            application_date: 'desc'
        },
        select: {
            id: true,
            job: {
                select: {
                    id: true,
                    division: {
                        select: {
                            name: true
                        }
                    },
                    position: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            application_date: true,
            interview_date: true,
            placed_date: true,
            status: true,
            description: true,
            user: {
                select: {
                    name: true,
                    nickname: true
                }
            }
        }
    }

    if (search_query) {
        options.where = {
            OR: [
                {
                    job: {
                        position: {
                            name: {
                                contains: search_query
                            }
                        }
                    }
                },
                {
                    job: {
                        division: {
                            name: {
                                contains: search_query
                            }
                        }
                    }
                },
                {
                    user: {
                        name: {
                            contains: search_query
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

    if (user.role.name === 'USER') {
        options.where = {
            ...options.where,
            userId: user.id
        }
        countOptionts.where = options.where
    }

    if (request.params.job && user.role.name === 'ADMIN' || user.role.name === 'SUPER') {
        options.where = {
            ...options.where,
            jobId: parseInt(request.params.job)
        }
        countOptionts.where = options.where
    }
    // else if (user.role.name === 'ADMIN' || user.role.name === 'SUPER') {
    //     options.where = null
    // }
    const applicant = await prismaClient.applicant.findMany(options);

    //informasi total data keseluruhan 
    const resultCount = await prismaClient.applicant.count(countOptionts)//integer jumlah total data user

    //generated total page
    const totalPage = Math.ceil(resultCount / limit)

    if (!applicant) {
        throw new ResponseError(404, "applicant is not found");
    }

    return {
        applicant,
        currentPage: page - 0,
        totalPage,
        resultCount
    };
}

const get = async (request) => {
    const validateUser = validate(getApplicantValidation, request.user);

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

    if (user.role.name === 'USER') {
        const applicant = await prismaClient.applicant.findUnique({
            where: {
                id: parseInt(request.params.id),
                userId: user.id
            },
            select: {
                id: true,
                job: {
                    select: {
                        id: true,
                        division: {
                            select: {
                                name: true
                            }
                        },
                        position: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                recomendations: true,
                response: true,
                answer: true,
                application_date: true,
                interview_date: true,
                placed_date: true,
                status: true,
                description: true,
                user: {
                    select: {
                        name: true,
                        nickname: true
                    }
                }
            }
        });

        if (!applicant) {
            throw new ResponseError(404, "applicant is not found");
        }

        return applicant;
    } else if (user.role.name === 'ADMIN' || user.role.name === 'SUPER') {
        const applicant = await prismaClient.applicant.findUnique({
            where: {
                id: parseInt(request.params.id)
            },
            select: {
                id: true,
                job: {
                    select: {
                        division: {
                            select: {
                                name: true
                            }
                        },
                        position: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                application_date: true,
                interview_date: true,
                placed_date: true,
                status: true,
                description: true,
                user: {
                    select: {
                        name: true,
                        nickname: true
                    }
                }
            }
        });

        if (!applicant) {
            throw new ResponseError(404, "applicant is not found");
        }

        return applicant;
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
        include: {
            role: true
        }
    });
    // console.log(user);
    if (!user) {
        throw new ResponseError(204, "No content!");
    };
    const updateApplicant = validate(updateApplicantValidation, request.body);

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    if (updateApplicant.status === 'Interview') {
        const date = updateApplicant.interview_date
        const updated_interview = new Date((date.setHours(date.getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();
        updateApplicant.interview_date = updated_interview
    }

    // if (updateApplicant.status === 'Placed') {
    //     const date = updateApplicant.placed_date
    //     const updated_placed = new Date((date.setHours(date.getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();
    //     updateApplicant.placed_date = updated_placed
    // }
    // await prismaClient.user.update({
    //     where: {
    //         username: user.username
    //     },
    //     data: {
    //         updated_at: updated
    //     }
    // })

    if (user.role.name === 'ADMIN' || user.role.name === 'SUPER') {
        return prismaClient.applicant.update({
            where: {
                id: parseInt(request.params.id),
            },
            data: updateApplicant,
            select: {
                id: true,
                job: {
                    select: {
                        division: {
                            select: {
                                name: true
                            }
                        },
                        position: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                application_date: true,
                interview_date: true,
                placed_date: true,
                status: true,
                description: true,
                user: {
                    select: {
                        name: true,
                        nickname: true
                    }
                }
            }
        })
    } else {
        throw new ResponseError(403, "Forbidden!");
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
    });
    if (!user) {
        throw new ResponseError(204, "No content!");
    };

    // console.log(request.params.id);
    return prismaClient.applicant.delete({
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