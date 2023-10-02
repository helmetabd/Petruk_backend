import express from "express";
import userController from "../controller/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import educationController from "../controller/education-controller.js";
import experienceController from "../controller/experience-controller.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

//user api
userRouter.get('/api/users/current', userController.get);
userRouter.patch('/api/users/update', userController.update);
userRouter.delete('/api/users/logout', userController.logout);

//education api
userRouter.get('/api/education', educationController.get);
userRouter.post('/api/education', educationController.create);
userRouter.patch('/api/education', educationController.update);

//experience api
userRouter.get('/api/experience', experienceController.get);
userRouter.post('/api/experience', experienceController.create);
userRouter.patch('/api/experience', experienceController.update);

export {
    userRouter
}