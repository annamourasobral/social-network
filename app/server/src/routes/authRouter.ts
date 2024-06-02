import express from "express";
import { authController } from "./authController";

const authRouter = express.Router();

authRouter.post("/signup", authController.signUp);

export default authRouter;
