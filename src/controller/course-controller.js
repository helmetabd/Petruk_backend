import courseService from "../service/course-service.js";

const create = async (req, res, next) => {
    try {
        const result = await courseService.create(req);
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
        const result = await courseService.get(username);
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
        const result = await courseService.update(req);
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
        await courseService.remove(req);
        res.status(200).json({
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
}

const removeJobSkill = async (req, res, next) => {
    try {
        // const skillId = req.params.id;
        await courseService.jobSkillRemove(req);
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
    update,
    remove,
    removeJobSkill
}