import express from "express";

import {
  uploadResume,
  getResumesByJob,
  getResumeById,
  downloadResumePdf,
  upload, // multer instance from controller
} from "../controllers/resumeController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ------------------ PROTECT ALL ROUTES ------------------
// User must be logged in
router.use(protect);

// ------------------ RESUME ROUTES ------------------

// POST /api/resumes/upload
// HR/Admin can upload resume (PDF or manual text)
// Multer handles optional 'resumePdf' upload
router.post(
  "/upload",
  authorizeRoles("hr", "admin"),
  upload.single("resumePdf"), // key for uploaded PDF file
  uploadResume
);

// GET /api/resumes/job/:jobId
// Get all resumes for a specific job (sorted by ATS score)
// HR/Admin only
router.get(
  "/job/:jobId",
  authorizeRoles("hr", "admin"),
  getResumesByJob
);

// GET /api/resumes/:resumeId
// Get single resume by ID (full structured data)
// HR/Admin only
router.get(
  "/:resumeId",
  authorizeRoles("hr", "admin"),
  getResumeById
);

// GET /api/resumes/download/:resumeId
// Download PDF file of a resume (if uploaded)
// HR/Admin only
router.get(
  "/download/:resumeId",
  authorizeRoles("hr", "admin"),
  downloadResumePdf
);

export default router;
