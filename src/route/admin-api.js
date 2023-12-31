import express from "express";
import userController from "../controller/user-controller.js";
import { roleMiddleware } from "../middleware/role-middleware.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import skillController from "../controller/skill-controller.js";
import jobController from "../controller/job-controller.js";
import divisionController from "../controller/division-controller.js";
import positionController from "../controller/position-controller.js";
import templateController from "../controller/template-controller.js";
import questionnaireController from "../controller/questionnaire-controller.js";
import testController from "../controller/test-controller.js";
import questionController from "../controller/question-controller.js";
import applicantController from "../controller/applicant-controller.js";
import roleController from "../controller/role-controller.js";
import { superMiddleware } from "../middleware/super-middleware.js";

const adminRouter = new express.Router();
adminRouter.use(authMiddleware);
adminRouter.use(roleMiddleware);

//user api
adminRouter.post('/api/user/create', userController.create);
adminRouter.get('/api/user', userController.get);
adminRouter.get('/api/user/all', userController.getAll);
adminRouter.patch('/api/user', userController.updateAdmin);
adminRouter.patch('/api/user/update/:id', userController.update);
adminRouter.delete('/api/auth/logout', userController.logout);
adminRouter.delete('/api/user/remove/:id', userController.remove);

//skill api
adminRouter.get('/api/skill', skillController.get);
adminRouter.post('/api/skill', skillController.create);
adminRouter.delete('/api/skill/:id', skillController.remove);

//job api
adminRouter.get('/api/job/:id', jobController.get);
adminRouter.get('/api/job', jobController.getAll);
adminRouter.get('/api/job-archived', jobController.getAll);
adminRouter.post('/api/job', jobController.create);
adminRouter.patch('/api/job/:id', jobController.update);
adminRouter.patch('/api/job/completed/:id', jobController.completed);
adminRouter.delete('/api/job/:id', jobController.remove);
adminRouter.delete('/api/job/:id/skill/:skill', skillController.removeJobSkill);
// adminRouter.delete('/api/job/:id', jobController.remove);

//division api
adminRouter.get('/api/division', divisionController.get);
adminRouter.post('/api/division', divisionController.create);
adminRouter.patch('/api/division/:id', divisionController.update);
adminRouter.delete('/api/division/:id', divisionController.remove);

//position api
adminRouter.get('/api/position', positionController.get);
adminRouter.post('/api/position', positionController.create);
adminRouter.patch('/api/position/:id', positionController.update);
adminRouter.delete('/api/position/:id', positionController.remove);

//template api
adminRouter.get('/api/template', templateController.get);
adminRouter.post('/api/template', templateController.create);
adminRouter.get('/api/template/:id', questionnaireController.get);
adminRouter.patch('/api/template/:id', templateController.update);
adminRouter.delete('/api/template/:id', templateController.remove);

//questionnaire api
adminRouter.post('/api/questionnaire/:id', questionnaireController.create);
adminRouter.patch('/api/questionnaire/:template', questionnaireController.updateQuestionnaireOption);
adminRouter.delete('/api/questionnaire/:id/template/:template', questionnaireController.remove);
adminRouter.delete('/api/questionnaire/:id/option/:option', questionnaireController.removeQuestionnaireOption);

//test api
adminRouter.get('/api/test', testController.get);
adminRouter.post('/api/test', testController.create);
adminRouter.get('/api/test/:id', questionController.get);
adminRouter.patch('/api/test/:id', testController.update);
adminRouter.delete('/api/test/:id', testController.remove);

//question api
adminRouter.post('/api/question/:id', questionController.create);
adminRouter.patch('/api/question/:id', questionController.updateQuestionOption);
adminRouter.delete('/api/question/:id/test/:test', questionController.remove);
adminRouter.delete('/api/question/:id/option/:option', questionController.removeQuestionOption);

//applicant api
adminRouter.get('/api/applicant/:id', applicantController.get);
adminRouter.get('/api/applicant-archived', applicantController.getAll);
adminRouter.get('/api/applicant', applicantController.getAll);
adminRouter.get('/api/applicant/job/:job', applicantController.getAll);
adminRouter.patch('/api/applicant/:id', applicantController.update);

//role api
adminRouter.get('/api/role', roleController.get);
adminRouter.post('/api/role', roleController.create, superMiddleware);
adminRouter.patch('/api/role/:id', roleController.update, superMiddleware);
adminRouter.delete('/api/role/:id', roleController.remove, superMiddleware);

export {
    adminRouter
}