import { body } from "express-validator";
export const postCreateValidation = [
  body("title", "Enter the title").isLength({ min: 3 }).isString(),
  body("text", "Type a some text").isLength({ min: 10 }).isString(),
  body("tag", "The format is wrong (write as an array)").optional().isArray(),
  body("imageUrl", "Incorrect url for the image").optional().isString(),
];
