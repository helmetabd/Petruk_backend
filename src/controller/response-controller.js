import answerService from "../service/answer-service.js";

const create = async (req, res, next) => {
    try {
        const option = "response"
        const result = await answerService.create(req, option);
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
        const result = await answerService.get(username);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

export default {
    create,
    get,
}