import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js"
import { familyValidation, getFamilyValidation, updateFamilyValidation } from "../validation/family-validation.js";

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
    const userFamily = validate(familyValidation, request.body);

    userFamily.userId = user.id;

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();


    // userFamily.users.updated_at = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            updated_at: updated,
            family: {
                connectOrCreate: userFamily.family.map((tag) => {
                    return {
                        where: {
                            userId_name_status: {
                                userId: userFamily.userId,
                                name: tag.name,
                                status: tag.status
                            }
                        },
                        create: {
                            name: tag.name,
                            status: tag.status,
                            address: tag.address,
                            phone: tag.phone,
                            work: tag.work
                        }
                    }
                })
            }
        },
        select: {
            name: true,
            nickname: true,
            family: {
                select: {
                    name: true,
                    status: true,
                    address: true,
                    phone: true,
                    work: true
                }
            }
        }
    });
}

const get = async (username) => {
    const validateUser = validate(getFamilyValidation, username);

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

    const family = await prismaClient.family.findMany({
        where: {
            userId: user.id
        },
        select: {
            id: true,
            name: true,
            status: true,
            address: true,
            phone: true,
            work: true,
            users: {
                select: {
                    name: true,
                    nickname: true,
                    email: true,
                }
            }
        }
    });

    if (!family) {
        throw new ResponseError(404, "family is not found");
    }

    return family;
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
    const updatefamily = validate(updateFamilyValidation, request.body);

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    await prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            updated_at: updated
        }
    })

    return prismaClient.family.update({
        where: {
            userId: user.id,
            id: parseInt(request.params.id)
        },
        data: updatefamily,
        select: {
            id: true,
            name: true,
            status: true,
            address: true,
            phone: true,
            work: true,
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
    return prismaClient.family.delete({
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