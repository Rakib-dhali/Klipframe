import { Router } from "express";
import { createThumbnail, deleteThumbnail } from "../controllers/thumbnail.controller.js";


const thumbnailRouter = Router();   

thumbnailRouter.post("/generate", createThumbnail);
thumbnailRouter.delete("/delete/:id", deleteThumbnail);

export default thumbnailRouter;