import express from "express";
import { googleCallback, login, logout, refreshAccessToken, register } from "../../modules/auth/auth.controller"
import { authMiddleware, isAdmin } from "../../middleware/auth";
import passport from "passport";


const router = express.Router();



router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login", session: false }),
  googleCallback
);


export default router;