const sectionPatterns = {
  contact: /([A-Za-z\s]+)\s*[|\-]\s*([^|\-]+@[^|\-]+)\s*[|\-]\s*(\+?[\d\s\-()]+)/,
  experience: /(?:EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT HISTORY)[\s\S]*?(?=EDUCATION|SKILLS|PROJECTS|$)/i,
  education: /(?:EDUCATION|ACADEMIC BACKGROUND)[\s\S]*?(?=EXPERIENCE|SKILLS|PROJECTS|$)/i,
  skills: /(?:SKILLS|TECHNICAL SKILLS|COMPETENCIES)[\s\S]*?(?=EDUCATION|EXPERIENCE|PROJECTS|$)/i,
  summary: /(?:SUMMARY|OBJECTIVE|PROFILE)[\s\S]*?(?=EXPERIENCE|EDUCATION|SKILLS|$)/i,
  projects: /(?:PROJECTS|PERSONAL PROJECTS)[\s\S]*?(?=EDUCATION|EXPERIENCE|SKILLS|CERTIFICATIONS|$)/i,
  certifications: /(?:CERTIFICATIONS|CERTIFICATES)[\s\S]*?(?=EDUCATION|EXPERIENCE|SKILLS|PROJECTS|$)/i,
};

function mapContentToStructure(text) {
  const result = {
    contact: {},
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    raw: text,
  };

  // Contact
  const contactMatch = text.match(sectionPatterns.contact);
  if (contactMatch) {
    result.contact = {
      name: (contactMatch[1] || '').trim(),
      email: (contactMatch[2] || '').trim(),
      phone: (contactMatch[3] || '').trim(),
    };
  }

  // Summary
  const summary = text.match(sectionPatterns.summary);
  if (summary) {
    result.summary = summary[0].replace(/^(SUMMARY|OBJECTIVE|PROFILE)/i, '').trim();
  }

  // Experience section extraction (basic splitting by lines and bullets)
  const experience = text.match(sectionPatterns.experience);
  if (experience) {
    const lines = experience[0]
      .replace(/^(EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT HISTORY)/i, '')
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);
    result.experience = lines;
  }

  const education = text.match(sectionPatterns.education);
  if (education) {
    const lines = education[0]
      .replace(/^(EDUCATION|ACADEMIC BACKGROUND)/i, '')
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);
    result.education = lines;
  }

  const skills = text.match(sectionPatterns.skills);
  if (skills) {
    const content = skills[0].replace(/^(SKILLS|TECHNICAL SKILLS|COMPETENCIES)/i, '');
    result.skills = content
      .split(/[,\n•\-]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const projects = text.match(sectionPatterns.projects);
  if (projects) {
    result.projects = projects[0]
      .replace(/^(PROJECTS|PERSONAL PROJECTS)/i, '')
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);
  }

  const certifications = text.match(sectionPatterns.certifications);
  if (certifications) {
    result.certifications = certifications[0]
      .replace(/^(CERTIFICATIONS|CERTIFICATES)/i, '')
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);
  }

  return result;
}

module.exports = { mapContentToStructure };


