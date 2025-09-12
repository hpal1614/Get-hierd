import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

export default function DownloadButton({ data }) {
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
    <PDFDownloadLink document={Doc} fileName="resume.pdf">
      {({ loading }) => (loading ? 'Preparing document…' : 'Download PDF')}
    </PDFDownloadLink>
  );
}


