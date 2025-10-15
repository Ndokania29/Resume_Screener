import pdf from "pdf-parse";

/**
 * Extracts text from a PDF buffer
 * @param {Buffer} pdfBuffer - uploaded PDF file buffer
 * @returns {Promise<string>} extracted text
 */
export const extractTextFromPDF = async (pdfBuffer) => {
  try {
    const data = await pdf(pdfBuffer);
    // data.text contains the extracted text
    return data.text.trim();
  } catch (error) {
    console.error("PDF parsing error:", error);
    return "";
  }
};
