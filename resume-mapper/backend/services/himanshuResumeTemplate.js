const fs = require('fs');
const path = require('path');
const { applyEditsToPdf } = require('./pdfEditor');

// Load Himanshu's resume template once
let resumeTemplateBuffer = null;

function loadResumeTemplate() {
  if (!resumeTemplateBuffer) {
    try {
      const templatePath = path.join(__dirname, '../../../HIMANSHU PAL-CV.pdf');
      resumeTemplateBuffer = fs.readFileSync(templatePath);
      console.log('✅ Loaded Himanshu\'s resume template');
    } catch (error) {
      console.error('❌ Could not load resume template:', error.message);
      throw new Error('Resume template not found');
    }
  }
  return resumeTemplateBuffer;
}

/**
 * Generate updated resume using Himanshu's template
 * @param {Object} updatedJson - The updated resume data structure
 * @returns {Promise<Buffer>} - The modified PDF buffer
 */
async function generateUpdatedResume(updatedJson) {
  try {
    const templateBuffer = loadResumeTemplate();
    return await applyEditsToPdf(templateBuffer, updatedJson);
  } catch (error) {
    console.error('Error generating updated resume:', error);
    throw new Error(`Failed to generate updated resume: ${error.message}`);
  }
}

module.exports = { generateUpdatedResume, loadResumeTemplate };
