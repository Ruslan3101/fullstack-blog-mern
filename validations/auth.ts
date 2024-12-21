import { body } from "express-validator";

export const registerValidation = [
  body("email", "Incorrect Email format").isEmail(),
  body("password", "Password must contain 5+ symbols").isLength({ min: 5 }),
  body("fullName", "Enter a proper name").isLength({ min: 3 }),
  body("avatarUrl", "Incorrect Url to avatar").optional().isURL(),
];
