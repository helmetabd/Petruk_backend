import divisionNPositionNTemplateService from "../service/divisionNPositionNTemplate-service.js";
import questionnaireService from "../service/questionnaire-service.js";

const create = async (req, res, next) => {
    try {
        const template = "template"
        const result = await divisionNPositionNTemplateService.create(req, template);
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
        const template = "template"
        const result = await divisionNPositionNTemplateService.get(username, template);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const result = await questionnaireService.update(req);
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
        const template = "template"
        await divisionNPositionNTemplateService.remove(req, template);
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