const tokenLimits = {
  daily: 1000,
  resetTime: 24 * 60 * 60 * 1000,
  warningThreshold: 100,
};

const tokenTracker = {
  dailyUsage: 0,
  lastReset: Date.now(),
};

function checkQuota(req, res, next) {
  const now = Date.now();
  const timeSinceReset = now - tokenTracker.lastReset;

  if (timeSinceReset >= tokenLimits.resetTime) {
    tokenTracker.dailyUsage = 0;
    tokenTracker.lastReset = now;
  }

  if (tokenTracker.dailyUsage >= tokenLimits.daily) {
    const timeToReset = tokenLimits.resetTime - timeSinceReset;
    return res.status(429).json({
      error: 'Daily token limit reached',
      resetIn: timeToReset,
      resetTime: new Date(now + timeToReset).toISOString(),
    });
  }

  return next();
}

module.exports = { tokenLimits, tokenTracker, checkQuota };


