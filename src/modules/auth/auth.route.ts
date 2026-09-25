import express from "express";
import { forgotPassword, googleCallback, login, logout, refreshAccessToken, register, resetPassword } from "../../modules/auth/auth.controller"
import { authMiddleware } from "../../middleware/auth";
import passport from "passport";


const router = express.Router();



router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.post("/forgot-password",forgotPassword)
router.post("/reset-password",resetPassword)


router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login",prompt: "select_account", session: false, }),
  googleCallback
);


export default router;