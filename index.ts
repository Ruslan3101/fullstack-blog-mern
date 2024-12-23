import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth";
import { validationResult } from "express-validator";
import UserModel from "./models/User";
import checkAuth from "./utils/CheckAuth";
import bcrypt from "bcrypt";
import * as UserController from "./controllers/UserController";
import { loginValidation } from "./validations/login";

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

app.post("/auth/login", loginValidation, UserController.login);
app.post("/auth/register", registerValidation, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

const server = app.listen(port, (): void => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// Handle server errors
server.on("error", (err: Error) => {
  console.error(`[server]: Server FAIL - ${err.message}`);
});
