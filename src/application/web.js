import express from "express";
import { publicRouter } from "../route/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { userRouter } from "../route/api.js";
import cookieParser from "cookie-parser";
import { refreshRouter } from "../route/refresh.js";

export const web = express();
web.use(express.json());

web.use(cookieParser());

web.use(publicRouter);

web.use(refreshRouter);

web.use(userRouter);

web.use(errorMiddleware);