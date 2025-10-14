import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const router = Router();

router.post("/register", ...AuthController.register);
router.post("/login", ...AuthController.login);
router.post("/verify", ...AuthController.verifyEmail);
router.post("/refresh", ...AuthController.refresh);
router.post("/logout", ...AuthController.logout);
router.post("/forgot-password", ...AuthController.forgotPassword);
router.post("/reset-password", ...AuthController.resetPassword);

// Google OAuth Routes
router.get("/google/url", ...AuthController.getGoogleAuthUrl);
router.post("/google", ...AuthController.googleLogin);
router.post("/google/disconnect", ...AuthController.disconnectGoogle);

export default router;