import { Router } from "express";
import { signup,signin } from "../controller/auth.contoller.js";
const authRouter  = Router();

authRouter.post('/signup',signup);
authRouter.post('/signin',signin);

export default authRouter; 