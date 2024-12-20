import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/auth/login", (req: Request, res: Response) => {
  console.log(req.body);

  const token = jwt.sign(
    {
      email: req.body.email,
      fullName: "John Johns",
    },
    "secret123"
  );
  res.json({
    success: true,
    token,
  });
});
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
