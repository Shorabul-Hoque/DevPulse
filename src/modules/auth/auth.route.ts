import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

// POST /api/auth/signup
router.post("/signup", authController.signup);

export const authRoute = router;