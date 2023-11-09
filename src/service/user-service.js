import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createAdminValidation, createSuperValidation, getUserValidation, loginUserValidation, registerUserValidation, requestPasswordValidation, resetPasswordValidation, updateUserValidation, verifyAccountValidation } from "../validation/user-validation.js";
import { validate } from "../validation/validation.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import { sendEmail } from "./sendEmail.js";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const isUserExist = await prismaClient.user.count({
        where: {
            username: user.username,
            email: user.email
        }
    });

    if (isUserExist === 1) {
        throw new ResponseError(400, "Username is already Exist");
    }

    user.password = await bcrypt.hash(user.password, 10);

    const date = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    user.created_at = date
    user.updated_at = date

    // user.email_verified_at = date

    const registerUser = await prismaClient.user.create({
        data: {
            role: {
                connect: {
                    name: 'USER'
                }
            },
            ...user,
        },
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

    dotenv.config();

    const clientURL = process.env.CLIENT_URL;

    const hash = await bcrypt.hash(registerUser.email, 10);

    const link = `${clientURL}/verifiy?email=${hash}&id=${registerUser.id}`;

    sendEmail(
        registerUser.email,
        "Verify Email",
        {
            name: registerUser.name,
            link: link,
        },
        "VERIFY"
    );
    return { registerUser, link };
}

const verifyAccount = async (request) => {
    const verifyAccount = validate(verifyAccountValidation, request.body)

    const user = await prismaClient.user.findUnique({
        where: {
            id: verifyAccount.userId
        }
    });

    if (!user) {
        throw new ResponseError(400, "User not found!");
    }

    if (user.email_verified_at) {
        throw new ResponseError(409, "Email already verified!");
    }

    // console.log(verifyAccount.token, user.reset_token);

    // const isValid = await bcrypt.compare(verifyAccount.token, user.reset_token);
    const isValid = await bcrypt.compare(user.email, verifyAccount.email);
    // const isValid = user.reset_token === verifyAccount.token

    if (!isValid) {
        throw new Error("Invalid");
    }

    const date = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    await prismaClient.user.update({
        where: {
            id: user.id
        },
        data: {
            email_verified_at: date
        }
    })

    // const user = await User.findById({ _id: userId });

    sendEmail(
        user.email,
        "Verify Email Success",
        {
            name: user.name,
        },
        "VERIFIED"
    );

    return { message: "Email verify was successful" };
};

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    // console.log(loginRequest)

    const user = await prismaClient.user.findFirst({
        where: {
            OR: [
                { username: loginRequest.username },
                { email: loginRequest.username }
            ]
        },
        select: {
            username: true,
            password: true,
            email_verified_at: true
        }
    });

    if (!user) {
        throw new ResponseError(401, "Username or password wrong!");
    }

    if (!user.email_verified_at) {
        throw new ResponseError(403, "Email not verified, please verify your email first!");
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
            username: true,
            name: true,
            nickname: true,
            token: true,
            email: true,
            roleId: true,
            role: {
                select: {
                    name: true,
                    display_name: true
                }
            },
            phone: true,
            created_at: true,
            updated_at: true
        }
    });

    return { accessToken, currentUser };
}

const requestPasswordReset = async (request) => {
    const requestPassword = validate(requestPasswordValidation, request.body)
    const user = await prismaClient.user.findUnique({
        where: {
            email: requestPassword.email
        }
    });

    if (!user) {
        throw new ResponseError(400, "User not found!");
    }

    let resetToken = crypto.randomBytes(32).toString("hex");
    // const hash = await bcrypt.hash(resetToken, 10);

    // console.log(resetToken)
    // if (user.reset_token) {
    const update = await prismaClient.user.update({
        where: {
            id: user.id
        },
        data: {
            reset_token: resetToken
        }
    })
    // } else {
    //     await prismaClient.user.update({
    //         where: {
    //             id: user.id
    //         },
    //         data: {
    //             reset_token: hash
    //         }
    //     })
    // }

    dotenv.config();
    const clientURL = process.env.CLIENT_URL;

    // let token = await Token.findOne({ userId: user._id });
    // if (token) await token.deleteOne();


    // await new Token({
    //     userId: user._id,
    //     token: hash,
    //     createdAt: Date.now(),
    // }).save();

    const link = `${clientURL}/passwordReset?token=${update.reset_token}&id=${update.id}`;

    sendEmail(
        update.email,
        "Password Reset Request",
        {
            name: update.name,
            link: link,
        },
        "REQUEST"
    );
    return { link };
};

const resetPassword = async (request) => {
    const resetPassword = validate(resetPasswordValidation, request.body)

    const user = await prismaClient.user.findUnique({
        where: {
            id: resetPassword.userId
        }
    });

    // let passwordResetToken = await Token.findOne({ userId });

    if (!user.reset_token) {
        throw new Error("Invalid or expired password reset token");
    }

    // console.log(resetPassword.token, user.reset_token);

    // $2b$10$dS7nFs7 / JdFUW5yjM4odIeFXuJdTKdQKDIKniuSIezoYW6UMnTn2q
    // $2b$10$dS7nFs7 / JdFUW5yjM4odIeFXuJdTKdQKDIKniuSIezoYW6UMnTn2q

    // const isValid = await bcrypt.compare(resetPassword.token, user.reset_token);
    // const isValid = await bcrypt.compare(user.reset_token, resetPassword.token);
    const isValid = user.reset_token === resetPassword.token

    // const isDuplicate = await bcrypt.compare(resetPassword.password, user.password);

    // console.log(isDuplicate)

    // console.log(isValid);

    // if (!isDuplicate) {
    //     throw new Error("");
    // }

    if (!isValid) {
        throw new Error("Invalid or expired password reset token");
    }

    const hash = await bcrypt.hash(resetPassword.password, 10);

    await prismaClient.user.update({
        where: {
            id: user.id
        },
        data: {
            password: hash
        }
    })

    // const user = await User.findById({ _id: userId });

    sendEmail(
        user.email,
        "Password Reset Successfully",
        {
            name: user.name,
        },
        "RESET"
    );

    return { message: "Password reset was successful" };
};

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
            role: true
        }
    });
    // console.log(user);
    if (!user) {
        throw new ResponseError(204, "No content!");
    };

    if (user.role.name === 'ADMIN') {
        const createUser = validate(createAdminValidation, request.body);

        const isUserExist = await prismaClient.user.count({
            where: {
                username: createUser.username
            }
        });

        if (isUserExist === 1) {
            throw new ResponseError(400, "Username is already Exist");
        }

        // console.log(createUser);

        createUser.password = await bcrypt.hash(createUser.password, 10);

        createUser.created_at = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();
        createUser.updated_at = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

        const registerUser = await prismaClient.user.create({
            data: {
                role: {
                    connect: {
                        name: createUser.role
                    }
                },
                username: createUser.username,
                password: createUser.password,
                name: createUser.name,
                nickname: createUser.nickname,
                email: createUser.email,
                phone: createUser.phone,
                created_at: createUser.created_at,
                updated_at: createUser.updated_at
            },
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

        dotenv.config();

        const clientURL = process.env.CLIENT_URL;

        const hash = await bcrypt.hash(registerUser.email, 10);

        const link = `${clientURL}/verifiy?email=${hash}&id=${registerUser.id}`;

        sendEmail(
            registerUser.email,
            "Verify Email",
            {
                name: registerUser.name,
                link: link,
            },
            "VERIFY"
        );
        return { registerUser, link };

    } else if (user.role.name === 'SUPER') {
        const createUser = validate(createSuperValidation, request.body);

        const isUserExist = await prismaClient.user.count({
            where: {
                username: createUser.username
            }
        });

        if (isUserExist === 1) {
            throw new ResponseError(400, "Username is already Exist");
        }

        createUser.password = await bcrypt.hash(createUser.password, 10);

        const date = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

        createUser.created_at = date;
        createUser.updated_at = date;

        const newUser = {
            role: {
                connect: {
                    name: createUser.role
                }
            },
            username: createUser.username,
            password: createUser.password,
            name: createUser.name,
            nickname: createUser.nickname,
            email: createUser.email,
            phone: createUser.phone,
            created_at: createUser.created_at,
            updated_at: createUser.updated_at
        }

        if (createUser.role === 'SUPER') {
            newUser = {
                ...newUser,
                email_verified_at: date
            }
        }

        const registerUser = await prismaClient.user.create({
            data: newUser,
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

        if (registerUser.role.name !== 'SUPER') {
            dotenv.config();

            const clientURL = process.env.CLIENT_URL;

            const hash = await bcrypt.hash(registerUser.email, 10);

            const link = `${clientURL}/verifiy?email=${hash}&id=${registerUser.id}`;

            sendEmail(
                registerUser.email,
                "Verify Email",
                {
                    name: registerUser.name,
                    link: link,
                },
                "VERIFY"
            );
            return { registerUser, link };
        } else {
            return registerUser
        }
    } else if (user.role.name === 'USER') {
        throw new ResponseError(403, "Forbidden!")
    } else {
        throw new ResponseError(403, "Forbidden!")
    }


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

const getAll = async (request) => {
    let { page = 1, limit = 10, search_query, direction = 'asc', orderFrom } = request.query //menghasilkan string
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
            username: true,
            name: true,
            nickname: true,
            email: true,
            phone: true,
            role: true
        }
    }

    if (search_query) {
        options.where = {
            OR: [
                {
                    name: {
                        contains: search_query
                    }
                },
                {
                    email: {
                        contains: search_query
                    }
                },
                {
                    nickname: {
                        contains: search_query
                    }
                },
                {
                    role: {
                        display_name: {
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
    const user = await prismaClient.user.findMany(options);
    // const user = await prismaClient.user.findMany({
    //     take: parseInt(limit),
    //     skip: skip,
    //     orderBy: {
    //         updated_at: "desc"
    //     },
    //     select: {
    //         id: true,
    //         username: true,
    //         name: true,
    //         nickname: true,
    //         email: true,
    //         phone: true,
    //         role: true
    //     }
    // });

    if (!user) {
        throw new ResponseError(404, "users is not found");
    }

    //informasi total data keseluruhan 
    const resultCount = await prismaClient.user.count(countOptionts)//integer jumlah total data user

    //generated total page
    const totalPage = Math.ceil(resultCount / limit)

    return {
        user,
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
    const updateUser = validate(updateUserValidation, request.body);

    updateUser.updated_at = new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString();

    if (request.params.id) {
        const updatedUser = await prismaClient.user.findUnique({
            where: {
                id: parseInt(request.params.id)
            },
        })
        if (user.role.name === 'SUPER' && request.params.id) {
            return prismaClient.user.update({
                where: {
                    id: parseInt(request.params.id)
                },
                data: updateUser,
                select: {
                    username: true,
                    name: true,
                    nickname: true,
                    role: true,
                    email: true,
                    phone: true,
                    updated_at: true
                }
            })
        } else if (user.role.name === 'ADMIN' && request.params.id && updatedUser.role.name !== 'SUPER') {
            return prismaClient.user.update({
                where: {
                    id: parseInt(request.params.id)
                },
                data: updateUser,
                select: {
                    username: true,
                    name: true,
                    nickname: true,
                    role: true,
                    email: true,
                    phone: true,
                    updated_at: true
                }
            })
        } else {
            throw new ResponseError(403, "Forbidden!")
        }
    } else if (!request.params.id) {
        return prismaClient.user.update({
            where: {
                username: user.username
            },
            data: updateUser,
            select: {
                username: true,
                name: true,
                nickname: true,
                role: true,
                email: true,
                phone: true,
                updated_at: true
            }
        })
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

    const deletedUser = await prismaClient.user.findUnique({
        where: {
            id: parseInt(request.params.id)
        },
    })

    // console.log(request.params.id);

    if (user.role.name === 'SUPER') {
        return prismaClient.user.delete({
            where: {
                id: parseInt(request.params.id),
            }
        })
    } else if (user.role.name === 'ADMIN' && deletedUser.role.name !== 'SUPER') {
        return prismaClient.user.delete({
            where: {
                id: parseInt(request.params.id),
                // role: 'ADMIN' || 'USER'
            }
        })
    } else if (user.role.name === "USER") {
        throw new ResponseError(403, "Forbidden!")
    } else {
        throw new ResponseError(403, "Forbidden!")
    }
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
    create,
    get,
    getAll,
    remove,
    update,
    logout,
    resetPassword,
    requestPasswordReset,
    verifyAccount
}