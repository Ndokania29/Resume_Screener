import Job from "../models/Job.js";

// Create Job
export const createJob = async (req, res) => {
  try {
    const { title, description, skills, jdPdfUrl } = req.body; // jdPdfUrl optional

    const job = await Job.create({
      title,
      description,
      skills,
      jdPdfUrl: jdPdfUrl || "",       // future PDF file URL
      companyId: req.user.companyId,  // multi-tenant
      createdBy: req.user.id,         // HR/Admin who created
    });

    res.status(201).json({ message: "Job created", job });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all Jobs for this company
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ companyId: req.user.companyId });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Job by ID (for this company only)
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    });
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.status(200).json(job);
  } catch (error) {
    console.error("Get job by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Job (for this company only)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user.companyId,
    });
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.status(200).json({ message: "Job deleted" });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
