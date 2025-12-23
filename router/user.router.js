import { Router } from "express";
import { getUserContent } from "../controller/user.controller.js";
const userRouter = Router();

// Get all contents of a user
userRouter.get("/:userId/contents", getUserContent);

export default userRouter;
