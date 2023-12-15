import express from "express";
import { refreshController } from "../controller/refresh-controller.js";

const refreshRouter = new express.Router();

refreshRouter.get('/api/auth/refresh', refreshController);

export {
    refreshRouter
}