import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  deleteJob,
} from "../controllers/jobController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();


router.use(protect);


// POST /api/jobs  → only HR/Admin can create
router.post("/", authorizeRoles("hr", "admin"), createJob);

// GET /api/jobs → HR/Admin can view jobs of their company
router.get("/", getJobs);

// GET /api/jobs/:id → view single job (company restricted)
router.get("/:id", getJobById);

// DELETE /api/jobs/:id → only HR/Admin can delete
router.delete("/:id", authorizeRoles("hr", "admin"), deleteJob);

export default router;
