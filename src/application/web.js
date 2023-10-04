import express from "express";
import { publicRouter } from "../route/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { userRouter } from "../route/api.js";
import cookieParser from "cookie-parser";
import { refreshRouter } from "../route/refresh.js";
import multer from "multer";

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/webp') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

export const web = express();

web.use(express.json());

web.use(cookieParser());

web.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

web.use(publicRouter);

web.use(refreshRouter);

web.use(userRouter);

web.use(errorMiddleware);