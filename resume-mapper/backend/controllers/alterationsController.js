const { extractTextFromPdf } = require('../services/pdfParser');
const { refineResume } = require('../services/geminiChat');

async function uploadAlterations(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const currentResumeRaw = req.body?.currentResume;
    const currentResume = currentResumeRaw ? JSON.parse(currentResumeRaw) : {};

    const text = await extractTextFromPdf(req.file.buffer);

    const prompt = `Apply the following alterations to the current resume JSON. Keep the exact structure and only modify relevant fields. Alterations Document (free text):\n\n${text}\n\nReturn only JSON.`;

    const responseText = await refineResume(prompt, currentResume);
    let updated = null;
    try {
      updated = JSON.parse(responseText);
    } catch (_) {}

    return res.json({ updated, raw: responseText });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to apply alterations', details: err.message });
  }
}

module.exports = { uploadAlterations };


