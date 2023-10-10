import jobService from "../service/job-service.js";

const create = async (req, res, next) => {
    try {
        const result = await jobService.create(req);
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
        // const username = req.user;
        const result = await jobService.get(req);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getAll = async (req, res, next) => {
    // console.log("zzzz")
    // console.log(req.user);
    try {
        // const username = req.user;
        const result = await jobService.getAll();
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
        const result = await jobService.update(req);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const remove = async (req, res, next) => {
    try {
        // const skillId = req.params.id;
        await jobService.remove(req);
        res.status(200).json({
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
}

export default {
    create,
    get,
    getAll,
    update,
    remove
}