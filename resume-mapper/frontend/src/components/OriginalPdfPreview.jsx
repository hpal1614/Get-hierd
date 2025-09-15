import { useState } from 'react'

export default function OriginalPdfPreview({ file }) {
  const [error, setError] = useState('')

  if (!file) return null

  const handleDownload = () => {
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = file.name || 'original.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
      <h4 style={{ marginTop: 0 }}>Original PDF Preview</h4>
      {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}
      <div style={{ 
        border: '2px dashed #d1d5db', 
        borderRadius: 8, 
        padding: 24, 
        textAlign: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ marginBottom: 16 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto', color: '#6b7280' }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        </div>
        <p style={{ margin: '0 0 16px 0', color: '#6b7280' }}>
          PDF Preview: {file.name || 'original.pdf'}
        </p>
        <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#9ca3af' }}>
          File size: {(file.size / 1024).toFixed(1)} KB
        </p>
        <button
          onClick={handleDownload}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Download Original PDF
        </button>
      </div>
    </div>
  )
}
