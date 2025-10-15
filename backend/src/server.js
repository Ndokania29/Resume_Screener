import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


// Test route
app.get("/", (req, res) => res.send("Smart Resume Screener Backend running "));

// Auth routes
app.use("/api/auth", authRoutes);

// ... middlewares
app.use("/api/jobs", jobRoutes);


app.use("/api/resumes", resumeRoutes);  // Resume upload + fetch


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
