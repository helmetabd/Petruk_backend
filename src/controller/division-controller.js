import divisionNPositionNTemplateService from "../service/divisionNPositionNTemplate-service.js";

const create = async (req, res, next) => {
    try {
        const division = "division"
        const result = await divisionNPositionNTemplateService.create(req, division);
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
        const division = "division"
        const result = await divisionNPositionNTemplateService.get(username, division);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const division = "division"
        const result = await divisionNPositionNTemplateService.update(req, division);
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
        const division = "division"
        await divisionNPositionNTemplateService.remove(req, division);
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