import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

// Signup new user (HR/Admin)
router.post("/signup", signup);

// Login existing user
router.post("/login", login);

export default router;
