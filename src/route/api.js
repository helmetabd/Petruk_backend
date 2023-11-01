import express from "express";
import userController from "../controller/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import educationController from "../controller/education-controller.js";
import experienceController from "../controller/experience-controller.js";
import skillController from "../controller/skill-controller.js";
import expectationController from "../controller/expectation-controller.js";
import familyController from "../controller/family-controller.js";
import profileController from "../controller/profile-controller.js";
import courseController from "../controller/course-controller.js";
import jobController from "../controller/job-controller.js";
import applicantController from "../controller/applicant-controller.js";
import answerController from "../controller/answer-controller.js";
import responseController from "../controller/response-controller.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

//user api
userRouter.get('/api/users/current', userController.get);
userRouter.patch('/api/users/update', userController.update);
userRouter.delete('/api/users/logout', userController.logout);

//education api
userRouter.get('/api/education', educationController.get);
userRouter.post('/api/education', educationController.create);
userRouter.patch('/api/education/:id', educationController.update);
userRouter.delete('/api/education/:id', educationController.remove);

//experience api
userRouter.get('/api/experience', experienceController.get);
userRouter.post('/api/experience', experienceController.create);
userRouter.patch('/api/experience/:id', experienceController.update);
userRouter.delete('/api/experience/:id', experienceController.remove);

//expectation api
userRouter.get('/api/expectation', expectationController.get);
userRouter.post('/api/expectation', expectationController.create);
userRouter.patch('/api/expectation', expectationController.update);

//family api
userRouter.get('/api/family', familyController.get);
userRouter.post('/api/family', familyController.create);
userRouter.patch('/api/family/:id', familyController.update);
userRouter.delete('/api/family/:id', familyController.remove);

//profile api
userRouter.get('/api/profile', profileController.get);
userRouter.post('/api/profile', profileController.create);
userRouter.patch('/api/profile', profileController.update);

//skill api
userRouter.get('/api/skill', skillController.get);
userRouter.post('/api/skill', skillController.create);
userRouter.patch('/api/skill', skillController.update);
userRouter.delete('/api/skill/:id', skillController.remove);

//course api
userRouter.get('/api/course', courseController.get);
userRouter.post('/api/course', courseController.create);
userRouter.patch('/api/course/:id', courseController.update);
userRouter.delete('/api/course/:id', courseController.remove);

//job api
userRouter.get('/api/job/:id', jobController.get);
userRouter.get('/api/job', jobController.getAll);

//applicant api
userRouter.post('/api/job/:id', applicantController.create);
userRouter.get('/api/applicant', applicantController.getAll);
userRouter.get('/api/applicant/:id', applicantController.get);

//answer api
userRouter.post('/api/answer/:id', answerController.create);

//response api
userRouter.post('/api/response/:id', responseController.create);

export {
    userRouter
}