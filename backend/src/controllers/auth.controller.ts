import { Request, Response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export async function registerUser(request: Request, response: Response) {
  try {
    const { name, email, password } = request.body;

    const ExistUser = await User.findOne({ email });
    if (ExistUser) {
      return response.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    request.session.isLoggedIn = true;
    request.session.userId = user._id.toString();

    return response.json({
        message: "account created successfully",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
        },
    })

  } catch (error) {}
}
