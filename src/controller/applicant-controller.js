import { request } from "express";
import applicantService from "../service/applicant-service.js";

const create = async (req, res, next) => {
    try {
        const result = await applicantService.create(req);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getAll = async (req, res, next) => {
    try {
        const result = await applicantService.getAll(req);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getByJob = async (req, res, next) => {
    try {
        const result = await applicantService.getAll(req);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const result = await applicantService.get(req);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const result = await applicantService.update(req);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const remove = async (req, res, next) => {
    try {
        await applicantService.remove(req);
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
    getByJob,
    update,
    remove
}