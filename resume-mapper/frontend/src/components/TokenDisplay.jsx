import { useEffect, useState } from 'react';
import { tokenManager } from '../services/tokenManager';

export default function TokenDisplay() {
  const [status, setStatus] = useState({ left: 1000, resetIn: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const s = await tokenManager.checkQuota();
        setStatus(s);
      } catch (_) {}
    };
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="token-status">
      <span>Tokens remaining: {status.left}/1000</span>
      {status.left === 0 && (
        <span className="reset-timer" style={{ marginLeft: 8 }}>
          Resets in: {tokenManager.formatResetTime(status.resetIn || 0)}
        </span>
      )}
    </div>
  );
}


