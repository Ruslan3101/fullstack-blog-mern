import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth";
import { validationResult } from "express-validator";
import userModel from "./models/User";
import bcrypt from "bcrypt";

dotenv.config();
mongoose
  .connect(
    "mongodb+srv://ruslanlutfullin95:FDqGNynigfMQpmT4@cluster0.ycph1.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("DB ok");
  })
  .catch((err) => {
    console.log(`${err} error to connect`, err.message);
  });
const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.post("/auth/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

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

    const userData = user.toObject(); // Convert to plain object
    const { passwordHash, ...rest } = userData;

    res.json({
      ...rest,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Not able to login",
    });
  }
});
app.post(
  "/auth/register",
  registerValidation,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const doc = new userModel({
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

      const userData = user.toObject(); // Convert to plain object
      const { passwordHash, ...rest } = userData;

      res.json({
        ...rest,
        token,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Not able to register",
      });
    }
  }
);
//Another example of initializing token
// const payload = {
//     userId: 1,
//     username: 'user',
//     role: 'admin'
//   };

//   const secretKey = 'your-secret-key';

//   const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

const server = app.listen(port, (): void => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// Handle server errors
server.on("error", (err: Error) => {
  console.error(`[server]: Server FAIL - ${err.message}`);
});
