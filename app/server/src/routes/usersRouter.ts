import express from "express";
import { usersController } from "./usersController";

const usersRouter = express.Router();

usersRouter.get("/", usersController.getUsers);
usersRouter.get("/:id", usersController.getUser);
usersRouter.post("/:id/timeline", usersController.userPost);

export default usersRouter;
