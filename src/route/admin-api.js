import express from "express";
import { refreshController } from "../controller/refresh-controller.js";
import userController from "../controller/user-controller.js";
import { roleMiddleware } from "../middleware/role-middleware.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import skillController from "../controller/skill-controller.js";
import jobController from "../controller/job-controller.js";
import divisionController from "../controller/division-controller.js";
import positionController from "../controller/position-controller.js";

const adminRouter = new express.Router();
adminRouter.use(authMiddleware);
adminRouter.use(roleMiddleware);

//user api
adminRouter.get('/api/admin/current', userController.get);
adminRouter.get('/api/users/all', userController.getAll);
adminRouter.patch('/api/admin/update', userController.update);
adminRouter.delete('/api/admin/logout', userController.logout);

//skill api
adminRouter.get('/api/skill', skillController.get);
adminRouter.post('/api/skill', skillController.create);
adminRouter.delete('/api/skill/:id', skillController.remove);

//job api
adminRouter.get('/api/job/:id', jobController.get);
adminRouter.get('/api/job', jobController.getAll);
adminRouter.post('/api/job', jobController.create);
adminRouter.patch('/api/job/:id', jobController.update);
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

export {
    adminRouter
}