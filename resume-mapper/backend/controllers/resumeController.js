const { extractTextFromPdf } = require('../services/pdfParser');
const { mapContentToStructure } = require('../services/contentMapper');

async function uploadAndParse(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const text = await extractTextFromPdf(req.file.buffer);
    const structured = mapContentToStructure(text);
    return res.json({ structured });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to parse PDF', details: err.message });
  }
}

module.exports = { uploadAndParse };


