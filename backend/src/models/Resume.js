import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    candidateName: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    resumeText: { type: String },          // extracted text
    skills: { type: [String], default: [] },
    experience: { type: Number },          // in years
    education: { type: [String], default: [] },
    projects: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    extracurriculars: { type: [String], default: [] },
    portfolioLinks: { type: [String], default: [] },
    github: { type: String },
    linkedin: { type: String },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    companyId: { type: String, required: true },  // multi-tenant
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    atsScore: { type: Number },             // LLM computed score
    justification: { type: String },       // LLM explanation

    // store PDF directly in Mongo
    resumePdf: {
      data: Buffer,
      contentType: String, // "application/pdf"
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
