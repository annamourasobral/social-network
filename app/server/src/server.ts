import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express, { Express } from "express";
import { connectDB } from "./database";
import authRouter from "./routes/auth/router";
import usersRouter from "./routes/users/router";

export const app: Express = express();

const port = process.env.SERVER_PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB();

app.use("/", authRouter);
app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
