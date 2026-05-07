import Router from "express";
import { getThumbnailById, getUsersThumbnails } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/thumbnails", getUsersThumbnails);
userRouter.get("/thumbnails/:id", getThumbnailById);

export default userRouter;