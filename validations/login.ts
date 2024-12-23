import { body } from "express-validator";

export const loginValidation = [
  body("email", "Incorrect Email format").isEmail(),
  body("password", "Password must contain 5+ symbols").isLength({ min: 5 }),
];
