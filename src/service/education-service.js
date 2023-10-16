import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js"
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

    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            updated_at: updated,
            education: {
                connectOrCreate: userEducation.education.map((tag) => {
                    return {
                        where: {
                            userId: userEducation.userId,
                            instance_name: tag.instance_name,
                            education_level: tag.education_level,
                        },
                        create: {
                            instance_name: tag.instance_name,
                            education_level: tag.education_level,
                            major: tag.major,
                            gpa: tag.gpa,
                            enrollment_year: tag.enrollment_year,
                            graduation_year: tag.graduation_year,
                        }
                    }
                })
            }
        },
        select: {
            name: true,
            nickname: true,
            education: {
                select: {
                    instance_name: true,
                    education_level: true,
                    major: true,
                    gpa: true,
                    enrollment_year: true,
                    graduation_year: true,
                }
            }
        }
    });
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

    const education = await prismaClient.education.findMany({
        where: {
            userId: user.id
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
                    nickname: true
                }
            }
        }
    });

    if (!education) {
        throw new ResponseError(404, "education is not found");
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
            id: parseInt(request.params.id),
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
    return prismaClient.education.delete({
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