const { adaptResumeToJob } = require('../services/jobDescriptionAnalyzer');
const { analyzeJobDescriptionFallback, adaptResumeFallback } = require('../services/fallbackJobAdapter');
const { applyEditsToPdf } = require('../services/pdfEditor');
const { generateUpdatedResume } = require('../services/himanshuResumeTemplate');

/**
 * Adapts resume based on job description
 */
async function adaptResumeToJobDescription(req, res) {
  try {
    const { jobDescription, useTemplate = true } = req.body;
    
    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    console.log('📝 Processing job description adaptation...');
    
    // Get the original resume data (you can modify this to get from your existing data)
    const originalResume = {
      contact: {
        name: "HIMANSHU PAL",
        email: "h.pal1614@gmail.com",
        phone: "0422161361",
        address: "89 Watkin Street, Newtown, Sydney",
        linkedin: "https://www.linkedin.com/in/himanshupal1614/",
        portfolio: "https://portfolio-himanshu.webflow.io/"
      },
      summary: "Creative and results-driven UI/UX Designer based in Sydney with extensive experience designing, building, and optimising digital products across industries through human-centered design methodology.",
      skills: [
        "Figma", "Adobe XD", "Sketch", "HTML", "CSS", "JavaScript", 
        "WordPress", "WebFlow", "User Research", "Wireframing", 
        "Prototyping", "Design Systems", "Agile/Scrum"
      ],
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

    // Adapt the resume to the job description
    let adaptationResult;
    try {
      adaptationResult = await adaptResumeToJob(originalResume, jobDescription);
    } catch (error) {
      console.log('⚠️ API key not available, using fallback adapter...');
      const jobRequirements = analyzeJobDescriptionFallback(jobDescription);
      const modifiedResume = adaptResumeFallback(originalResume, jobRequirements);
      adaptationResult = {
        jobRequirements,
        modifiedResume,
        originalResume
      };
    }
    
    res.json({
      success: true,
      jobRequirements: adaptationResult.jobRequirements,
      modifiedResume: adaptationResult.modifiedResume,
      originalResume: adaptationResult.originalResume,
      message: 'Resume successfully adapted to job description'
    });

  } catch (error) {
    console.error('Error in adaptResumeToJobDescription:', error);
    return res.status(500).json({
      error: 'Failed to adapt resume to job description',
      details: error.message
    });
  }
}

/**
 * Generates PDF with job-adapted resume
 */
async function generateJobAdaptedResume(req, res) {
  try {
    const { jobDescription, useTemplate = true } = req.body;
    
    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    console.log('📝 Generating job-adapted resume PDF...');
    
    // Get the original resume data
    const originalResume = {
      contact: {
        name: "HIMANSHU PAL",
        email: "h.pal1614@gmail.com",
        phone: "0422161361",
        address: "89 Watkin Street, Newtown, Sydney",
        linkedin: "https://www.linkedin.com/in/himanshupal1614/",
        portfolio: "https://portfolio-himanshu.webflow.io/"
      },
      summary: "Creative and results-driven UI/UX Designer based in Sydney with extensive experience designing, building, and optimising digital products across industries through human-centered design methodology.",
      skills: [
        "Figma", "Adobe XD", "Sketch", "HTML", "CSS", "JavaScript", 
        "WordPress", "WebFlow", "User Research", "Wireframing", 
        "Prototyping", "Design Systems", "Agile/Scrum"
      ],
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

    // Adapt the resume to the job description
    let adaptationResult;
    try {
      adaptationResult = await adaptResumeToJob(originalResume, jobDescription);
    } catch (error) {
      console.log('⚠️ API key not available, using fallback adapter...');
      const jobRequirements = analyzeJobDescriptionFallback(jobDescription);
      const modifiedResume = adaptResumeFallback(originalResume, jobRequirements);
      adaptationResult = {
        jobRequirements,
        modifiedResume,
        originalResume
      };
    }
    
    // Generate the PDF
    let pdfBuffer;
    if (useTemplate) {
      pdfBuffer = await generateUpdatedResume(adaptationResult.modifiedResume);
    } else {
      // If you want to use uploaded PDF instead of template
      pdfBuffer = await applyEditsToPdf(req.file.buffer, adaptationResult.modifiedResume);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="job-adapted-resume.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error in generateJobAdaptedResume:', error);
    return res.status(500).json({
      error: 'Failed to generate job-adapted resume',
      details: error.message
    });
  }
}

module.exports = {
  adaptResumeToJobDescription,
  generateJobAdaptedResume
};
