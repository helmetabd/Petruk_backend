import questionnaireService from "../service/questionnaire-service.js";

const create = async (req, res, next) => {
    try {
        const result = await questionnaireService.create(req);
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
        const result = await questionnaireService.get(req);
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
        await questionnaireService.remove(req);
        res.status(200).json({
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
}

const removeQuestionnaireOption = async (req, res, next) => {
    try {
        await questionnaireService.questionnaireOptionsRemove(req);
        res.status(200).json({
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
}

const updateQuestionnaireOption = async (req, res, next) => {
    try {
        await questionnaireService.questionnaireOptionsUpdate(req);
        res.status(200).json({
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
}

// const removeTemplateQuestion = async (req, res, next) => {
//     try {
//         await questionnaireService.templateQuestionRemove(req);
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
    remove,
    removeQuestionnaireOption,
    updateQuestionnaireOption
    // removeTemplateQuestion
}