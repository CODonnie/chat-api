import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/allModels";
import logger from "../utils/logger";

//@desc - Sign up users
//@route - POST/api/auth/register
export const Signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      process.env.NODE_ENV === "test"
        ? null
        : logger.warn(`user ${user.id} already exist`);
      res.status(401).json({ message: "user already exist" });
      return;
    }

    user = new User({ name, email, password, role });
    await user.save();

    process.env.NODE_ENV === "test"
      ? null
      : logger.info(`user ${user.id} created successfully`);
    res.status(201).json({ message: "user created" });
  } catch (error) {
    process.env.NODE_ENV === "test"
      ? null
      : logger.error(`Signup error - ${error}`);
    res.status(500).json({ message: "an error occured" });
  }
};

//@desc - Login users
//@route - POST/api/auth/Login
export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      process.env.NODE_ENV === "test"
        ? null
        : logger.warn(`User doesn't exists`);
      res.status(401).json({ message: "user doesn't exist" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      process.env.NODE_ENV === "test"
        ? null
        : logger.warn(`user entered incorrect password`);
      res.status(403).json({ message: "invalid/missing credentials" });
      return;
    }

    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign({ id: user._id, role: user.role }, secret, {
      expiresIn: "1h",
    });
    res.cookie("chatApiToken", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1 * 24 * 1200 * 1000,
    });

    process.env.NODE_ENV === "test"
      ? null
      : logger.info(`user ${user.id} login successfully`);
    res.status(200).json({ message: "login successful", data: user });
  } catch (error) {
    process.env.NODE_ENV === "test"
      ? null
      : logger.warn(`login error - ${error}`);
    res.status(500).json({ message: "an error occured" });
  }
};

//@desc - Logout users
//@route - GET/api/auth/Logout
export const Logout = (req: Request, res: Response) => {
  try {
    res.clearCookie("chatApiToken");
    process.env.NODE_ENV === "test" ? null : logger.info("user logged out");
    res.status(200).json({ messafe: "user logged out" });
  } catch (error) {
    process.env.NODE_ENV === "test"
      ? null
      : logger.error(`error logging user our - ${error}`);
    res.status(500).json({ message: "an error occured" });
  }
};

//@desc - protectee route for Auth testing
//@route - GET/api/auth/profile
export const UserProfile = async (req: Request, res: Response) => {
  try {
    let user = await User.find({});
    if (!user) {
      process.env.NODE_ENV === "test"
        ? null
        : logger.warn(`User doesn't exists`);
      res.status(401).json({ message: "user doesn't exist" });
      return;
    }

    res.status(200).json({ Users: user });
  } catch (error) {
    process.env.NODE_ENV === "test"
      ? null
      : logger.error(`error logging user our - ${error}`);
    res.status(500).json({ message: "an error occured" });
  }
};
