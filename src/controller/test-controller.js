import divisionNPositionNTemplateService from "../service/divisionNPositionNTemplate-service.js";
import questionService from "../service/question-service.js";

const create = async (req, res, next) => {
    try {
        const test = "test"
        const result = await divisionNPositionNTemplateService.create(req, test);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    // console.log(req.user);
    try {
        const username = req.user;
        const test = "test"
        const result = await divisionNPositionNTemplateService.get(username, test);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const result = await questionService.update(req);
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
        const test = "test"
        await divisionNPositionNTemplateService.remove(req, test);
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
}