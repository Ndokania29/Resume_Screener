// backend/utils/llmScorer.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Compute resume match score using Gemini AI (Deep ATS analysis)
 * @param {string} resumeText - Extracted resume text
 * @param {string} jobDescription - Job description text
 * @returns {object} - ATS and match analysis
 */
export async function computeLLMScore(resumeText, jobDescription) {
  try {
    const prompt = `
You are a professional AI-driven ATS evaluator used by top companies to screen resumes.

TASK: Analyze the following resume text against the provided job description.
Return ONLY valid JSON (no explanations or markdown). The JSON should follow this schema:

{
  "ats_score": number (0-100),
  "skills_match_percent": number (0-100),
  "matched_skills": [ "skill1", "skill2", ... ],
  "missing_skills": [ "skill1", "skill2", ... ],
  "overall_fit_summary": "A short paragraph summarizing candidate fit.",
  "detailed_feedback": {
    "technical_fit": "Evaluate technical skill alignment in depth.",
    "experience_fit": "Evaluate project and work experience match.",
    "education_fit": "Comment on education relevance.",
    "soft_skills_fit": "Comment on leadership, teamwork, communication etc.",
    "improvement_suggestions": [
      "Add specific measurable achievements.",
      "Include cloud or deployment experience.",
      "Highlight key skills from JD more explicitly."
    ]
  },
  "final_recommendation": "Hire / Consider / Reject"
}

Guidelines:
- Be objective like a real ATS + Recruiter.
- Give realistic numeric scores (0–100).
- Assess both hard skills and soft skills.
- Analyze career progression, project impact, and education relevance.
- The final_recommendation must align logically with scores.

### JOB DESCRIPTION:
${jobDescription}

### RESUME TEXT:
${resumeText}
`;

    // Generate AI response
    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();

    // Extract JSON cleanly
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in model output");

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;
  } catch (error) {
    console.error(" Error in computeLLMScore:", error);
    return {
      error: "LLM scoring failed. Try again or verify Gemini API key.",
    };
  }
}

