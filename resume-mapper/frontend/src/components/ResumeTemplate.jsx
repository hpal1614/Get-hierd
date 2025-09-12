export default function ResumeTemplate({ data }) {
  const d = data || {};
  return (
    <div style={{ fontFamily: 'Inter, system-ui, Arial', lineHeight: 1.4 }}>
      <header style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 8, marginBottom: 12 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>{d.contact?.name || 'Your Name'}</h1>
        <div style={{ color: '#374151' }}>
          {d.contact?.email} {d.contact?.phone ? ' | ' + d.contact?.phone : ''}
        </div>
      </header>

      {d.summary && (
        <section style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, letterSpacing: 0.3, marginBottom: 6 }}>SUMMARY</h3>
          <p style={{ margin: 0 }}>{d.summary}</p>
        </section>
      )}

      {!!(d.experience || []).length && (
        <section style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, letterSpacing: 0.3, marginBottom: 6 }}>EXPERIENCE</h3>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {(d.experience || []).map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        </section>
      )}

      {!!(d.education || []).length && (
        <section style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, letterSpacing: 0.3, marginBottom: 6 }}>EDUCATION</h3>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {(d.education || []).map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        </section>
      )}

      {!!(d.skills || []).length && (
        <section style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, letterSpacing: 0.3, marginBottom: 6 }}>SKILLS</h3>
          <div>{(d.skills || []).join(', ')}</div>
        </section>
      )}

      {!!(d.projects || []).length && (
        <section style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, letterSpacing: 0.3, marginBottom: 6 }}>PROJECTS</h3>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {(d.projects || []).map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        </section>
      )}

      {!!(d.certifications || []).length && (
        <section style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, letterSpacing: 0.3, marginBottom: 6 }}>CERTIFICATIONS</h3>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {(d.certifications || []).map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}


