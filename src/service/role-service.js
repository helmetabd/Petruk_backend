import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createRole, getRole, updateRole } from "../validation/role-validation.js";
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
    const newRole = validate(createRole, request.body);

    // position.userId = user.id;

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    return prismaClient.role.create({
        data: newRole,
        select: {
            id: true,
            name: true,
            display_name: true
        }
    });
}

const get = async (username) => {
    const validateUser = validate(getRole, username);

    const user = await prismaClient.user.findFirst({
        where: {
            username: validateUser
        },
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    const role = await prismaClient.role.findMany({
        select: {
            id: true,
            name: true,
            display_name: true
        }
    });

    if (!role) {
        throw new ResponseError(404, "role is not found");
    }

    return role;
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
    const updateRole = validate(updateRole, request.body);

    const updated = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    return prismaClient.role.update({
        where: {
            id: parseInt(request.params.id)
        },
        data: updateRole,
        select: {
            id: true,
            name: true,
            display_name: true
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

    return prismaClient.role.delete({
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