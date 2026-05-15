import Router from "express";
import {
  getThumbnailById,
  getUsersThumbnails,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/thumbnails", authMiddleware, getUsersThumbnails);
userRouter.get("/thumbnails/:id", authMiddleware, getThumbnailById);

export default userRouter;
