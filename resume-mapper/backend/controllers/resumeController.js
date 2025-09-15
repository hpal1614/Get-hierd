const { extractTextFromPdf, extractStructuredFromPdf } = require('../services/pdfParser');
const { mapContentToStructure } = require('../services/contentMapper');
const { applyEditsToPdf } = require('../services/pdfEditor');
const { generateUpdatedResume } = require('../services/himanshuResumeTemplate');

async function uploadAndParse(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const [text, structuredPdf] = await Promise.all([
      extractTextFromPdf(req.file.buffer),
      extractStructuredFromPdf(req.file.buffer).catch(() => null),
    ]);
    const structured = mapContentToStructure(text);
    return res.json({ structured, structuredPdf });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to parse PDF', details: err.message });
  }
}

async function overlayUpdate(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { updatedJson } = req.body;
    if (!updatedJson) {
      return res.status(400).json({ error: 'Updated JSON data is required' });
    }
    
    let parsedJson;
    try {
      parsedJson = typeof updatedJson === 'string' ? JSON.parse(updatedJson) : updatedJson;
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON format' });
    }
    
    // Apply edits to the original PDF
    const modifiedPdfBuffer = await applyEditsToPdf(req.file.buffer, parsedJson);
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="updated-resume.pdf"');
    res.setHeader('Content-Length', modifiedPdfBuffer.length);
    
    // Send the modified PDF
    res.send(modifiedPdfBuffer);
  } catch (error) {
    console.error('Error in overlayUpdate:', error);
    return res.status(500).json({ 
      error: 'Failed to update PDF', 
      details: error.message 
    });
  }
}

async function generateResume(req, res) {
  try {
    const { updatedJson } = req.body;
    
    // Use default resume data if none provided
    let parsedJson = updatedJson;
    if (!parsedJson) {
      parsedJson = {
        contact: {
          name: "HIMANSHU PAL",
          email: "h.pal1614@gmail.com",
          phone: "0422161361",
          address: "89 Watkin Street, Newtown, Sydney",
          linkedin: "https://www.linkedin.com/in/himanshu1614/",
          portfolio: "https://portfolio-himanshu.webflow.io/"
        },
        summary: "Creative and results-driven UI/UX Designer based in Sydney with extensive experience designing, building, and optimising digital products across industries through human-centered design methodology.",
        skills: ["Figma", "Adobe XD", "Sketch", "HTML", "CSS", "JavaScript", "WordPress", "WebFlow", "User Research", "Wireframing", "Prototyping", "Design Systems", "Agile/Scrum"],
        experience: [
          "DISRUPT EXPERIENCE - Designer (09.2023-Present)",
          "SYNTION - Multimedia Designer (05.2025-Present)", 
          "NIMBUS STUDIOS - Designer | Founder (01.2025-Present)",
          "INFOSYS LIMITED - UI/UX Designer (12.2020-12.2021)"
        ],
        education: [
          "Google UX Design Professional (2024)",
          "University of Technology Sydney - Masters of IT (2022-2024)",
          "Arena Animation - Advanced Diploma (2018-2020)",
          "Bharati Vidyapeeth - Bachelor of Technology (2015-2019)"
        ]
      };
    } else {
      try {
        parsedJson = typeof updatedJson === 'string' ? JSON.parse(updatedJson) : updatedJson;
      } catch (error) {
        return res.status(400).json({ error: 'Invalid JSON format' });
      }
    }
    
    // Generate updated resume using Himanshu's template
    const modifiedPdfBuffer = await generateUpdatedResume(parsedJson);
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="himanshu-updated-resume.pdf"');
    res.setHeader('Content-Length', modifiedPdfBuffer.length);
    
    // Send the modified PDF
    res.send(modifiedPdfBuffer);
  } catch (error) {
    console.error('Error in generateResume:', error);
    return res.status(500).json({ 
      error: 'Failed to generate resume', 
      details: error.message 
    });
  }
}

module.exports = { uploadAndParse, overlayUpdate, generateResume };


