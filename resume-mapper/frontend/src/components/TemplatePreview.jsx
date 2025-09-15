import ResumeTemplate from './ResumeTemplate';

export default function TemplatePreview({ data }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 8 }}>
      <h4 style={{ marginTop: 0 }}>Mapped Template</h4>
      <ResumeTemplate data={data} />
    </div>
  );
}


