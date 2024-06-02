import express from "express";
import { usersController } from "./usersController";

const usersRouter = express.Router();

usersRouter.get("/", usersController.getUsers);
usersRouter.get("/:id", usersController.getUser);

export default usersRouter;
