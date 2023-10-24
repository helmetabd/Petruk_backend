import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { courseValidation, getCourseValidation, updateCourseValidation } from "../validation/course-validation.js";
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
    });
    // console.log(user);
    if (!user) {
        throw new ResponseError(204, "No content!");
    };
    const userCourse = validate(courseValidation, request.body);

    userCourse.userId = user.id;

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    // userCourse.users.updated_at = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    // console.log(userCourse);
    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            updated_at: updated,
            course: {
                connectOrCreate: userCourse.course.map((tag) => {
                    return {
                        where: {
                            userId_instance_name_type: {
                                userId: userCourse.userId,
                                instance_name: tag.instance_name,
                                type: tag.type,
                            }
                        },
                        create: {
                            instance_name: tag.instance_name,
                            type: tag.type,
                            qualification: tag.qualification,
                            start_course: tag.start_course,
                            end_course: tag.end_course
                        }
                    };
                })
            }
        },
        select: {
            name: true,
            username: true,
            nickname: true,
            email: true,
            course: true
        }
    });
}

const get = async (username) => {
    const validateUser = validate(getCourseValidation, username);

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
        const course = await prismaClient.course.findMany({
            where: {
                users: {
                    id: user.id
                }
            },
            select: {
                id: true,
                instance_name: true,
                type: true,
                qualification: true,
                start_course: true,
                end_course: true
            }
        });

        if (!course) {
            throw new ResponseError(404, "course is not found");
        }

        return course;

    } else if (user.role === "ADMIN") {
        const course = await prismaClient.course.findMany({
            select: {
                id: true,
                instance_name: true,
                type: true,
                qualification: true,
                start_course: true,
                end_course: true
            }
        });

        if (!course) {
            throw new ResponseError(404, "course is not found");
        }

        return course;
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
    const updateCourse = validate(updateCourseValidation, request.body);

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            updated_at: updated,
            course: {
                update: {
                    where: {
                        userId: user.id,
                        id: parseInt(request.params.id)
                    },
                    data: updateCourse
                }
            }
        },
        select: {
            name: true,
            username: true,
            email: true,
            course: true
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

    if (user.role === "ADMIN") {
        return prismaClient.course.delete({
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
                course: {
                    // set
                    // disconnect: {
                    //     id: parseInt(request.params.id)
                    // },
                    delete: {
                        id: parseInt(request.params.id)
                    }
                }
            },
            select: {
                username: true
            }
        });
    }
}

const jobcourseRemove = async (request) => {
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
            course: {
                // set
                disconnect: {
                    id: parseInt(request.params.course)
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
    jobcourseRemove
}