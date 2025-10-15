import fs from "fs";
import * as pdf from "pdf-parse";



export async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}


export const parseResumeText = (resumeText) => {
  const lines = resumeText
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  const resumeData = {
    candidateName: "",
    email: "",
    phone: "",
    location: "",
    education: [],
    skills: [],
    experience: [],
    projects: [],
    certifications: [],
    extracurriculars: [],
    portfolioLinks: [],
    github: "",
    linkedin: "",
  };

  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const phoneRegex = /(\+?\d{1,3}[\s-]?)?\d{10}/;

  lines.forEach(line => {
    // Candidate info
    if (!resumeData.email && emailRegex.test(line))
      resumeData.email = line.match(emailRegex)[0];

    if (!resumeData.phone && phoneRegex.test(line))
      resumeData.phone = line.match(phoneRegex)[0];

    if (!resumeData.candidateName && /^[A-Z][a-z]+\s[A-Z][a-z]+/.test(line)) {
      resumeData.candidateName = line.match(/^[A-Z][a-z]+\s[A-Z][a-z]+/)[0];
    }

    // Education section
    if (/education/i.test(line)) resumeData.education.push(line);

    // Skills section
    if (/skills?/i.test(line)) {
      const skillLine = line.split(":")[1] || "";
      resumeData.skills = skillLine
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
    }

    // Projects
    if (/project/i.test(line)) resumeData.projects.push(line);

    // Certifications
    if (/certificat/i.test(line)) resumeData.certifications.push(line);

    // Extracurriculars
    if (/extracurricular/i.test(line)) resumeData.extracurriculars.push(line);

    // Portfolio / GitHub / LinkedIn
    if (/github\.com/i.test(line)) resumeData.github = line;
    if (/linkedin\.com/i.test(line)) resumeData.linkedin = line;
    if (/portfolio/i.test(line)) resumeData.portfolioLinks.push(line);
  });

  return resumeData;
};
