export const tokenManager = {
  checkQuota: async () => {
    const res = await fetch('/api/tokens/status');
    return res.json();
  },
  formatResetTime: (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  },
  showQuotaWarning: (tokensLeft) => {
    if (tokensLeft <= 100) return `⚠️ Only ${tokensLeft} tokens remaining today`;
    return null;
  },
};


