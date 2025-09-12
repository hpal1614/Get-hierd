import ResumeTemplate from './ResumeTemplate';

export default function TemplatePreview({ data }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 8 }}>
        <h4 style={{ marginTop: 0 }}>Mapped Template</h4>
        <ResumeTemplate data={data} />
      </div>
      <div style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 8 }}>
        <h4 style={{ marginTop: 0 }}>Raw JSON</h4>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}


