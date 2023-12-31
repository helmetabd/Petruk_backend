import divisionNPositionNTemplateService from "../service/divisionNPositionNTemplate-service.js";

const create = async (req, res, next) => {
    try {
        const position = "position"
        const result = await divisionNPositionNTemplateService.create(req, position);
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
        const position = "position"
        const result = await divisionNPositionNTemplateService.get(username, position);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const position = "position"
        const result = await divisionNPositionNTemplateService.update(req, position);
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
        const position = "position"
        await divisionNPositionNTemplateService.remove(req, position);
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