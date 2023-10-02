import experienceService from "../service/experience-service.js";

const create = async (req, res, next) => {
    try {
        const result = await experienceService.create(req);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    // console.log("zzzz")
    // console.log(req.user);
    try {
        const username = req.user;
        const result = await experienceService.get(username);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        // const username = req.user.username;
        // const request = req.body;
        // request.username = username;
        const result = await experienceService.update(req);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

// const logout = async (req, res, next) => {
//     try {
//         await userService.logout(req);
//         res.clearCookie('refreshToken');
//         res.status(200).json({
//             data: "OK"
//         });
//     } catch (e) {
//         next(e);
//     }
// }

export default {
    create,
    get,
    update,
}