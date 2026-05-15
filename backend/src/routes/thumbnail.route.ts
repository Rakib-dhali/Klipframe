import { Router } from "express";
import { createThumbnail, deleteThumbnail } from "../controllers/thumbnail.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const thumbnailRouter = Router();   

thumbnailRouter.post("/generate",authMiddleware, createThumbnail);
thumbnailRouter.delete("/delete/:id", authMiddleware, deleteThumbnail);

export default thumbnailRouter;