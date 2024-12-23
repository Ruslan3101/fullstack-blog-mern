import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
}
export default (req: Request, res: Response, next: NextFunction) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (!token) {
    res.status(403).json({
      message: "Authorization header is missing",
    });
    return;
  } else {
    try {
      const decoded = jwt.verify(token, "secret123") as JwtPayload;
      
      res.locals.userId = decoded.id;
      next();
    } catch (err) {
      res.status(403).json({
        message: "Access denied",
      });
    }
  }
};
