import userService from "../service/user-service.js";

const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);
        res.cookie('refreshToken', result.currentUser.token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        res.status(200).json({
            accessToken: result.accessToken,
            data: result.currentUser
        });
    } catch (e) {
        next(e);
    }
}

const create = async (req, res, next) => {
    try {
        const result = await userService.create(req);
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        // const username = req.user;
        const result = await userService.get(req);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getAll = async (req, res, next) => {
    try {
        // const username = req.user;
        const result = await userService.getAll(req);
        res.status(200).json({
            data: result,
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const result = await userService.update(req);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const updateAdmin = async (req, res, next) => {
    try {
        const result = await userService.update(req);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const remove = async (req, res, next) => {
    try {
        await userService.remove(req);
        res.status(200).json({
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
}

const logout = async (req, res, next) => {
    try {
        await userService.logout(req);
        res.clearCookie('refreshToken');
        res.status(200).json({
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
}

export default {
    register,
    login,
    create,
    get,
    getAll,
    update,
    updateAdmin,
    remove,
    logout
}