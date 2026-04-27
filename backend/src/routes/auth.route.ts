import { Router } from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", authMiddleware, logoutUser);
authRouter.get("/verify", authMiddleware, getCurrentUser);

export default authRouter;