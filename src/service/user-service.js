import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { getUserValidation, loginUserValidation, registerUserValidation, updateUserValidation } from "../validation/user-validation.js";
import { validate } from "../validation/validation.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const isUserExist = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (isUserExist === 1) {
        throw new ResponseError(400, "Username is already Exist");
    }

    user.password = await bcrypt.hash(user.password, 10);

    user.created_at = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();
    user.updated_at = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    return prismaClient.user.create({
        data: user,
        select: {
            id: true,
            username: true,
            name: true,
            nickname: true,
            email: true,
            role: true,
            phone: true,
            created_at: true,
            updated_at: true
        }
    })

}

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            username: true,
            password: true
        }
    });

    if (!user) {
        throw new ResponseError(401, "Username or password wrong!");
    }

    const isPasswordVallid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordVallid) {
        throw new ResponseError(401, "Username or password wrong!");
    }

    dotenv.config();
    const accessToken = jwt.sign(
        { "username": user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '900s' }
    );

    const refreshToken = jwt.sign(
        { "username": user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    );

    const currentUser = await prismaClient.user.update({
        data: {
            token: refreshToken
        },
        where: {
            username: user.username
        },
        select: {
            token: true
        }
    });

    return { accessToken, currentUser };
}

const get = async (request) => {
    const username = validate(getUserValidation, request.user);

    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        },
        select: {
            username: true,
            name: true,
            nickname: true,
            email: true,
            phone: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    return user;
}

const getAll = async () => {
    // username = validate(getUserValidation, username);

    const user = await prismaClient.user.findMany({
        // where: {
        //     username: username
        // },
        select: {
            username: true,
            name: true,
            nickname: true,
            email: true,
            phone: true,
            role: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "users is not found");
    }

    return user;
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
    const updateUser = validate(updateUserValidation, request.body);

    updateUser.updated_at = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: updateUser,
        select: {
            username: true,
            name: true,
            nickname: true,
            email: true,
            phone: true,
            updated_at: true
        }
    })
}

const logout = async (request) => {
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

    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            token: null
        },
        select: {
            username: true
        }
    });
}

export default {
    register,
    login,
    get,
    getAll,
    update,
    logout
}