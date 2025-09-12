import { useRef, useState } from 'react';
import { api } from '../services/api';

export default function FileUpload({ onParsed }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = async (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await upload(file);
  };

  const upload = async (file) => {
    try {
      setLoading(true);
      setError('');
      const data = await api.uploadResume(file);
      onParsed?.(data.structured);
    } catch (err) {
      setError('Failed to parse PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: '2px dashed #999',
          padding: 20,
          borderRadius: 8,
          textAlign: 'center',
          background: dragging ? '#f8fafc' : 'transparent',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Processing PDF…' : 'Drag & drop resume PDF here, or click to upload'}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
        }}
      />
      {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}
    </div>
  );
}


