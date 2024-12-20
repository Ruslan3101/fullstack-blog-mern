import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

dotenv.config();
mongoose
  .connect(
    "mongodb+srv://ruslanlutfullin95:FDqGNynigfMQpmT4@cluster0.ycph1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("DB ok");
  })
  .catch((err) => {
    console.log(`$err} error to connect`, err.message);
  });
const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json());


app.post("/auth/register", (req: Request, res: Response) => {
    
});
//Another example of initializing token
// const payload = {
//     userId: 1,
//     username: 'user',
//     role: 'admin'
//   };

//   const secretKey = 'your-secret-key';

//   const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

// ruslanlutfullin95
//FDqGNynigfMQpmT4
const server = app.listen(port, (): void => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// Handle server errors
server.on("error", (err: Error) => {
  console.error(`[server]: Server FAIL - ${err.message}`);
});
