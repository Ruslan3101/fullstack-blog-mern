import express, { Express } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth";
import { PostController, UserController } from "./controllers/index";
import { loginValidation } from "./validations/login";
import { postCreateValidation } from "./validations/post";
import { handleValidationErrors, checkAuth } from "./utils/index";

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

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);
app.delete("/posts/:id", checkAuth, PostController.remove);

const server = app.listen(port, (): void => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// Handle server errors
server.on("error", (err: Error) => {
  console.error(`[server]: Server FAIL - ${err.message}`);
});
