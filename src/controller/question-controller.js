import { request } from "express";
import questionService from "../service/question-service.js";

const create = async (req, res, next) => {
    try {
        const result = await questionService.create(req);
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
        const result = await questionService.get(req);
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
        await questionService.remove(req);
        res.status(200).json({
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
}

const removeQuestionOption = async (req, res, next) => {
    try {
        await questionService.questionOptionsRemove(req);
        res.status(200).json({
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
}

const updateQuestionOption = async (req, res, next) => {
    try {
        await questionService.questionOptionsUpdate(req);
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
    removeQuestionOption,
    updateQuestionOption
}