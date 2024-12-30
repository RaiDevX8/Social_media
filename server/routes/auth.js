import express from "express";
import { login } from "../controllers/auth.js";
import { sendResetPassword, resetPassword } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/send-resetOTP", sendResetPassword);
router.post("/reset-password", resetPassword);

export default router;
