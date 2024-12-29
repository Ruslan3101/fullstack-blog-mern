import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/User";
import bcrypt from "bcrypt";
import handleValidationErrors from "../utils/handleValidationErrors";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const userObjectData = user.toObject(); // Convert to plain object
    const { passwordHash, ...userData } = userObjectData;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Not able to register",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user.passwordHash
    );

    if (!isValidPass) {
      res.status(400).json({
        message: "Invalid login or password",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const userObjectData = user.toObject(); // Convert to plain object
    const { passwordHash, ...userData } = userObjectData;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Not able to login",
    });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
    }
    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      res.status(404).json({
        message: " User not found",
      });
      return;
    }

    const userObjectData = user.toObject(); // Convert to plain object
    const { passwordHash, ...userData } = userObjectData;

    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: "An error occurred" });
  }
};
