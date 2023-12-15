import express from "express"
import userController from "../controller/user-controller.js";
import jobController from "../controller/job-controller.js";

const publicRouter = new express.Router();
publicRouter.post('/api/auth/register', userController.register);
publicRouter.post('/api/auth/login', userController.login);
publicRouter.get('/api/job/:id', jobController.get);
publicRouter.get('/api/job', jobController.getAll);
publicRouter.post('/api/auth/request', userController.requestResetPassword);
publicRouter.post('/api/auth/reset-password', userController.resetPassword);
publicRouter.post('/api/auth/verify', userController.verifyEmail);

export {
    publicRouter
}