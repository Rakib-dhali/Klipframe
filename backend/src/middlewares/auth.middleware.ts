import { Request, Response, NextFunction } from "express";

export const authMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { isLoggedIn, userId } = request.session;
  if (!isLoggedIn || !userId) {
    return response.status(401).json({ message: "Unauthorized" });
  }
  next();
};