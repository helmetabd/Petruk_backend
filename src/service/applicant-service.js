import { request } from "express";
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

    // try {
    //     await prismaClient.profile.findUnique({
    //         where: {
    //             id: user.profile.id
    //         }
    //     })
    // } catch (error) {
    //     throw new ResponseError(204, "Please fill your profile first!")
    // }
    const findProfile = await prismaClient.profile.findUnique({
        where: {
            id: user.profile.id
        }
    })

    if (!findProfile) {
        throw new ResponseError(204, "No content!");
    };

    const userApplicant = validate(createApplicantValidation, request.body);

    userApplicant.userId = user.id;

    // userApplicant.status = 'Submitted';

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

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
                    create: {
                        application_date: updated,
                        status: 'Submitted',
                        // description: userApplicant.description,
                        jobId: parseInt(request.params.id)
                    }
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
                    application_date: true,
                    status: true,
                }
            }
        }
    });
}

const getAll = async (username) => {
    const validateUser = validate(getApplicantValidation, username);

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

    if (user.role === 'USER') {
        const applicant = await prismaClient.applicant.findMany({
            where: {
                userId: user.id
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
    } else if (user.role === 'ADMIN') {
        const applicant = await prismaClient.applicant.findMany({
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

    if (user.role === 'USER') {
        const applicant = await prismaClient.applicant.findUnique({
            where: {
                id: parseInt(request.params.id),
                userId: user.id
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
    } else if (user.role === 'ADMIN') {
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

    if (user.role === 'ADMIN') {
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