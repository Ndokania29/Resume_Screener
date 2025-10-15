import Resume from "../models/Resume.js";
import Job from "../models/Job.js";
import { extractTextFromPDF } from "../utils/resumeParser.js";
import { parseResumeText } from "../utils/resumeParser.js";
import { computeLLMScore } from "../utils/llmScorer.js";
import multer from "multer";

// ---------------- Multer setup ----------------
// Store PDF in memory (later can switch to cloud like S3)
const upload = multer({ storage: multer.memoryStorage() });

// ---------------- Upload Resume ----------------
export const uploadResume = async (req, res) => {
  try {
    const {
      candidateName,
      email,
      phone,
      location,
      jobId: jobIdFromBody,
      skills: manualSkills,
      experience: manualExp,
      education: manualEducation,
      projects: manualProjects,
      certifications: manualCertifications,
      extracurriculars: manualExtras,
      portfolioLinks: manualPortfolio,
      github,
      linkedin,
      resumeText: manualText, // optional manual text
    } = req.body;

    // Accept jobId from body, query, or params for flexibility
    const jobId = jobIdFromBody || req.query.jobId || req.params.jobId;

    // Verify job belongs to the logged-in company
    if (!jobId) {
      return res.status(400).json({ message: "jobId is required" });
    }
    const job = await Job.findOne({ _id: jobId, companyId: req.user.companyId });
    if (!job) return res.status(404).json({ message: "Job not found for this company" });

    // ---------------- PDF Processing ----------------
    let resumeText = manualText || "";
    let resumePdf = null;
    if (req.file) {
      resumePdf = { data: req.file.buffer, contentType: req.file.mimetype };
      const extractedText = await extractTextFromPDF(req.file.buffer);
      resumeText = resumeText ? resumeText + "\n" + extractedText : extractedText;
    }

    // ---------------- Structured Parsing ----------------
    const parsedData = parseResumeText(resumeText || "");

    // Merge parser results with manual inputs (manual inputs override parser)
    // Ensure proper data types for MongoDB schema
    const resumeData = {
      skills: Array.isArray(manualSkills) ? manualSkills : (parsedData.skills || []),
      experience: typeof manualExp === 'number' ? manualExp : (parsedData.experience || 0),
      education: Array.isArray(manualEducation) ? manualEducation : (parsedData.education || []),
      projects: Array.isArray(manualProjects) ? manualProjects : (parsedData.projects || []),
      certifications: Array.isArray(manualCertifications) ? manualCertifications : (parsedData.certifications || []),
      extracurriculars: Array.isArray(manualExtras) ? manualExtras : (parsedData.extracurriculars || []),
      portfolioLinks: Array.isArray(manualPortfolio) ? manualPortfolio : (parsedData.portfolioLinks || []),
      github: github || parsedData.github || "",
      linkedin: linkedin || parsedData.linkedin || "",
    };

    // ---------------- LLM/ATS Scoring ----------------
   let atsScore = null;
let justification = null;

if (resumeText && job.description) {
  const llmResult = await computeLLMScore(resumeText, job.description);

  atsScore = llmResult?.ats_score || 0; // safe optional chaining
  justification = llmResult?.overall_fit_summary || "No summary generated";
}


    // ---------------- Save Resume ----------------
    // Derive candidateName if not provided
    const derivedName = candidateName || parsedData.candidateName || (email ? email.split("@")[0] : "");
    if (!derivedName) {
      return res.status(400).json({ message: "candidateName could not be determined" });
    }

    const resume = await Resume.create({
      candidateName: derivedName,
      email,
      phone,
      location,
      resumeText,
      ...resumeData,
      jobId,
      companyId: req.user.companyId,
      uploadedBy: req.user.id,
      atsScore,
      justification,
      resumePdf,
    });

    res.status(201).json({ message: "Resume uploaded successfully", resume });
  } catch (err) {
    console.error("Resume upload error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Get resumes by job ----------------
export const getResumesByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findOne({ _id: jobId, companyId: req.user.companyId });
    if (!job) return res.status(404).json({ message: "Job not found" });

    const resumes = await Resume.find({ jobId, companyId: req.user.companyId })
      .sort({ atsScore: -1 }); // highest score first

    res.status(200).json(resumes);
  } catch (err) {
    console.error("Get resumes by job error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Get single resume ----------------
export const getResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ _id: resumeId, companyId: req.user.companyId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    res.status(200).json(resume);
  } catch (err) {
    console.error("Get resume by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Download PDF ----------------
export const downloadResumePdf = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ _id: resumeId, companyId: req.user.companyId });

    if (!resume || !resume.resumePdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    res.set("Content-Type", resume.resumePdf.contentType);
    res.send(resume.resumePdf.data);
  } catch (err) {
    console.error("Download resume PDF error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Export multer ----------------
export { upload };