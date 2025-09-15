/**
 * Fallback job adapter that works without API key
 * Provides basic job analysis and resume adaptation
 */

function analyzeJobDescriptionFallback(jobDescription) {
  // Basic keyword extraction
  const skills = [];
  const responsibilities = [];
  const industry = 'general';
  
  // Extract common UI/UX skills
  const skillKeywords = [
    'figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'invision',
    'html', 'css', 'javascript', 'react', 'vue', 'angular',
    'user research', 'usability testing', 'wireframing', 'prototyping',
    'design systems', 'accessibility', 'wcag', 'responsive design',
    'agile', 'scrum', 'design thinking', 'user experience', 'ui design'
  ];
  
  const responsibilityKeywords = [
    'design', 'research', 'prototype', 'test', 'collaborate', 'lead',
    'manage', 'create', 'develop', 'implement', 'optimize', 'improve'
  ];
  
  const lowerJobDesc = jobDescription.toLowerCase();
  
  skillKeywords.forEach(skill => {
    if (lowerJobDesc.includes(skill)) {
      skills.push(skill);
    }
  });
  
  responsibilityKeywords.forEach(resp => {
    if (lowerJobDesc.includes(resp)) {
      responsibilities.push(resp);
    }
  });
  
  // Determine experience level
  let experienceLevel = 'mid';
  if (lowerJobDesc.includes('senior') || lowerJobDesc.includes('lead') || lowerJobDesc.includes('5+')) {
    experienceLevel = 'senior';
  } else if (lowerJobDesc.includes('junior') || lowerJobDesc.includes('entry') || lowerJobDesc.includes('0-2')) {
    experienceLevel = 'entry';
  }
  
  // Determine industry
  let industryType = 'general';
  if (lowerJobDesc.includes('fintech') || lowerJobDesc.includes('banking') || lowerJobDesc.includes('finance')) {
    industryType = 'fintech';
  } else if (lowerJobDesc.includes('healthcare') || lowerJobDesc.includes('medical')) {
    industryType = 'healthcare';
  } else if (lowerJobDesc.includes('ecommerce') || lowerJobDesc.includes('retail')) {
    industryType = 'ecommerce';
  }
  
  return {
    requiredSkills: skills,
    experienceLevel,
    yearsRequired: experienceLevel === 'senior' ? '5+ years' : experienceLevel === 'entry' ? '0-2 years' : '3-5 years',
    keyResponsibilities: responsibilities,
    industry: industryType,
    softSkills: ['collaboration', 'communication', 'problem-solving'],
    methodologies: ['Agile', 'Design Thinking', 'User-Centered Design'],
    education: 'Bachelor\'s degree preferred',
    achievements: ['user satisfaction', 'conversion optimization', 'design efficiency'],
    companyContext: 'general',
    atsKeywords: skills,
    tone: 'professional'
  };
}

function adaptResumeFallback(originalResume, jobRequirements) {
  // Create a modified version of the resume
  const modifiedResume = { ...originalResume };
  
  // Update summary to include job-relevant keywords
  if (jobRequirements.requiredSkills.length > 0) {
    const topSkills = jobRequirements.requiredSkills.slice(0, 3);
    modifiedResume.summary = `Creative and results-driven UI/UX Designer with expertise in ${topSkills.join(', ')}. ${originalResume.summary}`;
  }
  
  // Update skills to prioritize job-relevant ones
  if (jobRequirements.requiredSkills.length > 0) {
    const relevantSkills = jobRequirements.requiredSkills.filter(skill => 
      originalResume.skills.some(originalSkill => 
        originalSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
    modifiedResume.skills = [...relevantSkills, ...originalResume.skills.filter(skill => 
      !jobRequirements.requiredSkills.some(reqSkill => 
        skill.toLowerCase().includes(reqSkill.toLowerCase())
      )
    )];
  }
  
  // Add industry-specific language to experience
  if (jobRequirements.industry !== 'general') {
    modifiedResume.experience = modifiedResume.experience.map(exp => {
      if (jobRequirements.industry === 'fintech' && exp.toLowerCase().includes('banking')) {
        return exp + ' - Fintech experience';
      }
      return exp;
    });
  }
  
  return modifiedResume;
}

module.exports = {
  analyzeJobDescriptionFallback,
  adaptResumeFallback
};
