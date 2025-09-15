import React from 'react';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { api } from '../services/api';

export default function DownloadButton({ data, originalFile }) {
  const [isOverlayLoading, setIsOverlayLoading] = React.useState(false);
  const [isGenerateLoading, setIsGenerateLoading] = React.useState(false);

  const handleOverlayDownload = async () => {
    if (!originalFile || !data) return;
    
    setIsOverlayLoading(true);
    try {
      const blob = await api.overlayUpdate(originalFile, data);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'updated-resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading overlay PDF:', error);
      alert('Failed to download updated PDF. Please try again.');
    } finally {
      setIsOverlayLoading(false);
    }
  };

  const handleGenerateResume = async () => {
    if (!data) return;
    
    setIsGenerateLoading(true);
    try {
      const blob = await api.generateResume(data);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'himanshu-updated-resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating resume:', error);
      alert('Failed to generate resume. Please try again.');
    } finally {
      setIsGenerateLoading(false);
    }
  };
  const styles = StyleSheet.create({
    page: { padding: 24, fontSize: 12 },
    h1: { fontSize: 18, marginBottom: 6 },
    section: { marginBottom: 8 },
  });

  const Doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.h1}>{data?.contact?.name || 'Your Name'}</Text>
          <Text>{[data?.contact?.email, data?.contact?.phone].filter(Boolean).join(' | ')}</Text>
        </View>
        {data?.summary ? (
          <View style={styles.section}>
            <Text>SUMMARY</Text>
            <Text>{data.summary}</Text>
          </View>
        ) : null}
        {Array.isArray(data?.experience) && data.experience.length ? (
          <View style={styles.section}>
            <Text>EXPERIENCE</Text>
            {data.experience.map((l, i) => (
              <Text key={i}>• {l}</Text>
            ))}
          </View>
        ) : null}
        {Array.isArray(data?.education) && data.education.length ? (
          <View style={styles.section}>
            <Text>EDUCATION</Text>
            {data.education.map((l, i) => (
              <Text key={i}>• {l}</Text>
            ))}
          </View>
        ) : null}
        {Array.isArray(data?.skills) && data.skills.length ? (
          <View style={styles.section}>
            <Text>SKILLS</Text>
            <Text>{data.skills.join(', ')}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <PDFDownloadLink document={Doc} fileName="mapped-resume.pdf">
        {({ loading }) => (loading ? 'Preparing document…' : 'Download Mapped PDF')}
      </PDFDownloadLink>
      
      {data && (
        <button
          onClick={handleGenerateResume}
          disabled={isGenerateLoading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isGenerateLoading ? 'not-allowed' : 'pointer',
            opacity: isGenerateLoading ? 0.6 : 1,
          }}
        >
          {isGenerateLoading ? 'Generating...' : 'Generate Resume (No Upload Needed)'}
        </button>
      )}
      
      {originalFile && data && (
        <button
          onClick={handleOverlayDownload}
          disabled={isOverlayLoading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isOverlayLoading ? 'not-allowed' : 'pointer',
            opacity: isOverlayLoading ? 0.6 : 1,
          }}
        >
          {isOverlayLoading ? 'Processing...' : 'Download Updated PDF'}
        </button>
      )}
      
      {originalFile && (
        <a
          href={URL.createObjectURL(originalFile)}
          download={originalFile.name || 'original.pdf'}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            display: 'inline-block',
          }}
        >
          Download Original PDF
        </a>
      )}
    </div>
  );
}


