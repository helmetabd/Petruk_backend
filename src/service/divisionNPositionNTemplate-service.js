import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { getDivPosTempTestValidation, positionDivisionTemplateTestValidation } from "../validation/positionNDivisionNTemplate-validation.js";
import { validate } from "../validation/validation.js"

const create = async (request, divpos) => {
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
    const newDivPosTemTes = validate(positionDivisionTemplateTestValidation, request.body);

    // position.userId = user.id;

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    // console.log(divpos);

    if (divpos === "division") {
        return prismaClient.division.create({
            data: newDivPosTemTes,
            select: {
                name: true,
            }
        });
    } else if (divpos === "position") {
        return prismaClient.position.create({
            data: newDivPosTemTes,
            select: {
                name: true,
            }
        });
    } else if (divpos === "template") {
        return prismaClient.template.create({
            data: newDivPosTemTes,
            select: {
                name: true,
            }
        });
    } else if (divpos === "test") {
        return prismaClient.test.create({
            data: newDivPosTemTes,
            select: {
                name: true,
            }
        });
    }
}

const get = async (username, divpos) => {
    const validateUser = validate(getDivPosTempTestValidation, username);

    const user = await prismaClient.user.findFirst({
        where: {
            username: validateUser
        },
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    // console.log(divpos);

    if (divpos === "division") {
        const division = await prismaClient.division.findMany({
            select: {
                id: true,
                name: true,
            }
        });

        if (!division) {
            throw new ResponseError(404, "division is not found");
        }

        return division;
    } else if (divpos === "position") {
        const position = await prismaClient.position.findMany({
            select: {
                id: true,
                name: true,
            }
        });

        if (!position) {
            throw new ResponseError(404, "position is not found");
        }

        return position;
    } else if (divpos === "template") {
        const template = await prismaClient.template.findMany({
            select: {
                id: true,
                name: true,
                questionnaire: true
            }
        });

        if (!template) {
            throw new ResponseError(404, "template is not found");
        }

        return template;
    } else if (divpos === "test") {
        const test = await prismaClient.test.findMany({
            select: {
                id: true,
                name: true,
                questionTest: {
                    include: {
                        options: true
                    }
                }
            }
        });

        if (!test) {
            throw new ResponseError(404, "test is not found");
        }

        return test;
    }
}

const update = async (request, divpos) => {
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
    const updatedivpostemp = validate(positionDivisionTemplateTestValidation, request.body);

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    if (divpos === "division") {
        return prismaClient.division.update({
            where: {
                id: parseInt(request.params.id)
            },
            data: updatedivpostemp,
            select: {
                id: true,
                name: true
            }
        });
    } else if (divpos === "position") {
        return prismaClient.position.update({
            where: {
                id: parseInt(request.params.id)
            },
            data: updatedivpostemp,
            select: {
                id: true,
                name: true
            }
        })
    }
    // else if (divpos === "template") {
    //     return prismaClient.template.update({
    //         where: {
    //             id: parseInt(request.params.id)
    //         },
    //         data: updatedivpostemp,
    //         select: {
    //             id: true,
    //             name: true,
    //             questionnaire: true
    //         }
    //     })
    // }
}

const remove = async (request, divpos) => {
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

    if (divpos === "division") {
        return prismaClient.division.delete({
            where: {
                id: parseInt(request.params.id)
            }
        })
    } else if (divpos === "position") {
        return prismaClient.position.delete({
            where: {
                id: parseInt(request.params.id)
            },
        });
    } else if (divpos === "template") {
        return prismaClient.template.delete({
            where: {
                id: parseInt(request.params.id)
            },
        });
    } else if (divpos === "test") {
        return prismaClient.test.delete({
            where: {
                id: parseInt(request.params.id)
            },
        });
    }
}

export default {
    create,
    get,
    update,
    remove
}