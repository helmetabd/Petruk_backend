import express from "express"
import userController from "../controller/user-controller.js";
import jobController from "../controller/job-controller.js";

const publicRouter = new express.Router();
publicRouter.post('/api/users', userController.register);
publicRouter.post('/api/users/login', userController.login);
publicRouter.get('/api/job/:id', jobController.get);
publicRouter.get('/api/job', jobController.getAll);
publicRouter.post('/api/request', userController.requestResetPassword);
publicRouter.post('/api/reset-password', userController.resetPassword);
publicRouter.post('/api/verify', userController.verifyEmail);

export {
    publicRouter
}