const { GoogleGenerativeAI } = require('@google/generative-ai');
const { tokenTracker } = require('../middleware/tokenTracker');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

async function refineResume(userPrompt, currentResumeData) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
Current Resume Data: ${JSON.stringify(currentResumeData)}
User Request: ${userPrompt}

Please refine the resume based on the user's request. Return only the updated JSON with modified sections. Keep the same structure.
`;

  const result = await model.generateContent(prompt);
  tokenTracker.dailyUsage += 50; // estimate
  return result.response.text();
}

module.exports = { refineResume };


