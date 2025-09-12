const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const resumeRoutes = require('./routes/resume');
const chatRoutes = require('./routes/chat');
const { tokenTracker, tokenLimits } = require('./middleware/tokenTracker');
const cron = require('node-cron');

dotenv.config({ path: path.resolve(process.cwd(), '..', '.env') });

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Token status endpoint
app.get('/api/tokens/status', (_req, res) => {
  const now = Date.now();
  const timeSinceReset = now - tokenTracker.lastReset;
  const tokensLeft = Math.max(tokenLimits.daily - tokenTracker.dailyUsage, 0);
  const resetIn = Math.max(tokenLimits.resetTime - timeSinceReset, 0);
  res.json({
    dailyLimit: tokenLimits.daily,
    used: tokenTracker.dailyUsage,
    left: tokensLeft,
    resetIn,
    resetTime: new Date(now + resetIn).toISOString(),
  });
});

// Routes
app.use('/api/resume', resumeRoutes);
app.use('/api/chat', chatRoutes);

// Daily reset at midnight (server local time)
cron.schedule('0 0 * * *', () => {
  tokenTracker.dailyUsage = 0;
  tokenTracker.lastReset = Date.now();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on port ${PORT}`);
});


