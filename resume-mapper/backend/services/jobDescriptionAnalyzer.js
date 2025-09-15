const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyzes job description and extracts key requirements
 */
async function analyzeJobDescription(jobDescription) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Analyze this job description and extract key requirements. Return a JSON object with these fields:
- requiredSkills: array of technical skills mentioned
- experienceLevel: seniority level (junior, mid, senior)
- yearsRequired: years of experience mentioned
- keyResponsibilities: main job duties
- industry: industry type
- softSkills: soft skills mentioned
- methodologies: methodologies mentioned
- education: education requirements
- achievements: types of achievements expected
- companyContext: company size/type
- atsKeywords: important keywords for ATS
- tone: professional tone

Job Description: ${jobDescription}

Return only valid JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (error) {
        console.log('JSON parsing error, using fallback...');
        return getFallbackJobRequirements(jobDescription);
      }
    }
    
    return getFallbackJobRequirements(jobDescription);
  } catch (error) {
    console.error('Error analyzing job description:', error);
    return getFallbackJobRequirements(jobDescription);
  }
}

/**
 * Generates resume modifications based on job requirements
 */
async function generateResumeModifications(originalResume, jobRequirements, jobDescription) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Modify this resume to match the job requirements. Keep the same JSON structure.

Original Resume:
${JSON.stringify(originalResume, null, 2)}

Job Requirements:
${JSON.stringify(jobRequirements, null, 2)}

Instructions:
1. Keep exact same JSON structure
2. Update summary to include job-relevant keywords
3. Prioritize skills that match job requirements
4. Keep all original contact info
5. Don't add new companies or experiences

Return only valid JSON with this structure:
{
  "contact": { "name": "...", "email": "...", "phone": "...", "address": "...", "linkedin": "...", "portfolio": "..." },
  "summary": "Updated summary...",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": ["job1", "job2", "job3"],
  "education": ["degree1", "degree2", "degree3"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('AI Response length:', text.length);
    console.log('First 200 chars:', text.substring(0, 200));
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const jsonText = jsonMatch[0];
        console.log('Extracted JSON length:', jsonText.length);
        console.log('First 200 chars of JSON:', jsonText.substring(0, 200));
        
        return JSON.parse(jsonText);
      } catch (error) {
        console.log('JSON parsing failed:', error.message);
        console.log('JSON text:', jsonMatch[0].substring(0, 500));
        return getFallbackResumeModifications(originalResume, jobRequirements);
      }
    }
    
    return getFallbackResumeModifications(originalResume, jobRequirements);
  } catch (error) {
    console.error('Error generating resume modifications:', error);
    return getFallbackResumeModifications(originalResume, jobRequirements);
  }
}

/**
 * Complete job description to resume adaptation
 */
async function adaptResumeToJob(originalResume, jobDescription) {
  try {
    console.log('🔍 Analyzing job description...');
    const jobRequirements = await analyzeJobDescription(jobDescription);
    console.log('✅ Job requirements extracted:', Object.keys(jobRequirements));
    
    console.log('🔄 Generating resume modifications...');
    const modifiedResume = await generateResumeModifications(originalResume, jobRequirements, jobDescription);
    console.log('✅ Resume modifications generated');
    
    return {
      jobRequirements,
      modifiedResume,
      originalResume
    };
  } catch (error) {
    console.error('Error adapting resume to job:', error);
    throw error;
  }
}

/**
 * Fallback job requirements when AI fails
 */
function getFallbackJobRequirements(jobDescription) {
  const text = jobDescription.toLowerCase();
  
  const skills = [];
  if (text.includes('figma')) skills.push('figma');
  if (text.includes('react')) skills.push('react');
  if (text.includes('user research')) skills.push('user research');
  if (text.includes('design systems')) skills.push('design systems');
  if (text.includes('accessibility')) skills.push('accessibility');
  if (text.includes('agile')) skills.push('agile');
  if (text.includes('ui/ux')) skills.push('ui/ux');
  if (text.includes('prototyping')) skills.push('prototyping');
  if (text.includes('wireframing')) skills.push('wireframing');
  
  return {
    requiredSkills: skills,
    experienceLevel: text.includes('senior') ? 'senior' : 'mid',
    yearsRequired: text.includes('5+') ? '5+ years' : '3+ years',
    keyResponsibilities: ['design', 'research', 'collaboration'],
    industry: 'general',
    softSkills: ['collaboration', 'communication', 'problem-solving'],
    methodologies: ['Agile', 'Design Thinking', 'User-Centered Design'],
    education: "Bachelor's degree preferred",
    achievements: ['user satisfaction', 'conversion optimization', 'design efficiency'],
    companyContext: 'general',
    atsKeywords: skills,
    tone: 'professional'
  };
}

/**
 * Fallback resume modifications when AI fails
 */
function getFallbackResumeModifications(originalResume, jobRequirements) {
  const modifiedSkills = [...(originalResume.skills || [])];
  const jobSkills = jobRequirements.requiredSkills || [];
  
  // Add job-specific skills if not already present
  jobSkills.forEach(skill => {
    if (!modifiedSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
      modifiedSkills.push(skill);
    }
  });
  
  // Update summary with job-relevant keywords
  let updatedSummary = originalResume.summary || '';
  if (jobSkills.length > 0) {
    const topSkills = jobSkills.slice(0, 3).join(', ');
    updatedSummary = `Creative and results-driven UI/UX Designer with expertise in ${topSkills}. ${updatedSummary}`;
  }
  
  return {
    contact: originalResume.contact || {},
    summary: updatedSummary,
    skills: modifiedSkills,
    experience: originalResume.experience || [],
    education: originalResume.education || []
  };
}

module.exports = {
  analyzeJobDescription,
  generateResumeModifications,
  adaptResumeToJob
};