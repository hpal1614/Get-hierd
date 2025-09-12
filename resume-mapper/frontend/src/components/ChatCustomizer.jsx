import { useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import { tokenManager } from '../services/tokenManager';

export default function ChatCustomizer({ data, onUpdate }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenStatus, setTokenStatus] = useState({ left: 1000, used: 0, resetIn: 0 });
  const endRef = useRef(null);

  useEffect(() => {
    tokenManager.checkQuota().then(setTokenStatus).catch(() => {});
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quick = [
    'Make my summary more impactful',
    'Add more technical skills',
    'Rewrite experience for a senior UX role',
  ];

  const send = async (text) => {
    if (!text?.trim()) return;
    setLoading(true);
    setMessages((m) => [...m, { role: 'user', content: text }]);
    try {
      const res = await api.refine(text, data || {});
      if (res.updated) onUpdate?.(res.updated);
      setMessages((m) => [...m, { role: 'assistant', content: res.raw || 'Updated.' }]);
      setTokenStatus((s) => ({ ...s, left: res.tokens?.left ?? s.left, used: res.tokens?.used ?? s.used, resetIn: res.tokens?.resetIn ?? s.resetIn }));
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Error processing request.' }]);
    } finally {
      setLoading(false);
    }
  };

  const tokensLeft = tokenStatus.left ?? 0;
  const warning = tokenManager.showQuotaWarning(tokensLeft);

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, display: 'grid', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>Tokens remaining: {tokensLeft}/1000</div>
        {tokensLeft === 0 && <div>Resets in: {tokenManager.formatResetTime(tokenStatus.resetIn || 0)}</div>}
      </div>
      {warning && <div style={{ color: '#b45309' }}>{warning}</div>}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {quick.map((q) => (
          <button key={q} onClick={() => send(q)} disabled={loading || tokensLeft === 0}>
            {q}
          </button>
        ))}
      </div>
      <div style={{ height: 200, overflowY: 'auto', border: '1px solid #e5e7eb', padding: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <strong>{m.role === 'user' ? 'You' : 'Assistant'}:</strong> {m.content}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
          setInput('');
        }}
        style={{ display: 'flex', gap: 8 }}
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type refinement request…" style={{ flex: 1 }} />
        <button type="submit" disabled={loading || tokensLeft === 0}>Send</button>
      </form>
    </div>
  );
}


