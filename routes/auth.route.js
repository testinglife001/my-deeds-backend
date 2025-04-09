import express from "express";
import { admin_login, checkAuth, createUser, forgotPassword, resetPassword, signin, signout, signup, verifyEmail } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { cloudinaryFileUploader } from "../middleware/FileUploader.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

// router.post("/signup", signup );
 router.post("/signup", cloudinaryFileUploader.single('image'), signup);
 router.post("/create-user", cloudinaryFileUploader.single('image'), createUser );

router.post("/signin", signin);

router.post("/signout", signout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post('/admin-login', admin_login);

export default router;
