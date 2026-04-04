import { Router } from "express";
import { login } from "../controllers/user/login.js";
import { signup } from "../controllers/user/signup.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;
