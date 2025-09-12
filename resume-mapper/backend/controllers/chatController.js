const { refineResume } = require('../services/geminiChat');
const { tokenLimits, tokenTracker } = require('../middleware/tokenTracker');

async function chatRefine(req, res) {
  try {
    const { prompt, currentResume } = req.body || {};
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    const responseText = await refineResume(prompt, currentResume || {});

    // Try to parse updated JSON; if parsing fails, return raw text
    let updated = null;
    try {
      updated = JSON.parse(responseText);
    } catch (_) {
      // keep updated null
    }

    const now = Date.now();
    const timeSinceReset = now - tokenTracker.lastReset;
    const left = Math.max(tokenLimits.daily - tokenTracker.dailyUsage, 0);
    const resetIn = Math.max(tokenLimits.resetTime - timeSinceReset, 0);

    return res.json({
      updated,
      raw: responseText,
      tokens: { used: tokenTracker.dailyUsage, left, resetIn },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Chat refinement failed', details: err.message });
  }
}

module.exports = { chatRefine };


