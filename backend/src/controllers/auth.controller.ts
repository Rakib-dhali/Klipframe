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

  } catch (error:any) {
    console.log(error);
    response.status(500).json({message: error.message});
  }
}
export async function loginUser(request: Request, response: Response) {
  try {
    const { email, password } = request.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return response.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response.status(400).json({ message: "Invalid credentials" });
    }

    request.session.isLoggedIn = true;
    request.session.userId = user._id.toString();

    return response.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error:any) {
    console.log(error);
    response.status(500).json({message: error.message});
  }
}
export async function logoutUser(request: Request, response: Response) {

  try {
    request.session.destroy((error) => {
      if (error) {
        console.log(error);
        response.status(500).json({ message: "Error occurred while logging out" });
      } else {
        response.json({ message: "Logged out successfully" });
      }
    });
  } catch (error:any) {
    console.log(error);
    response.status(500).json({ message: error.message });
  }
}

export async function getCurrentUser(request: Request, response: Response) {
  try {
    const { userId } = request.session;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return response.status(400).json({ message: "User not found" });
    }
    return response.json({ user });
    
  } catch (error:any) {
    console.log(error);
    response.status(500).json({ message: error.message });
  }
}