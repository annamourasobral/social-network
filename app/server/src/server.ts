import express, { Express } from "express";
import authRouter from "./routes/authRouter";
import usersRouter from "./routes/usersRouter";

const app: Express = express();

const port = 8080;

app.use(express.json());

app.use("/", authRouter);
app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
