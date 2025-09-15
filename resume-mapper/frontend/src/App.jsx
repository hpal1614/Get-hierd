import { useState } from 'react'
import './App.css'
import FileUpload from './components/FileUpload'
import ChatCustomizer from './components/ChatCustomizer'
import TokenDisplay from './components/TokenDisplay'
import DownloadButton from './components/DownloadButton'
import OriginalPdfPreview from './components/OriginalPdfPreview'
import JobDescriptionAdapter from './components/JobDescriptionAdapter'

function App() {
  const [data, setData] = useState(null)
  const [originalFile, setOriginalFile] = useState(null)

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24, display: 'grid', gap: 16 }}>
      <h1 style={{ margin: 0 }}>Resume Template Mapper</h1>
      <TokenDisplay />
      
      {/* Job Description Adapter */}
      <JobDescriptionAdapter onResumeGenerated={setData} />
      
      <FileUpload onParsed={setData} onAltered={(u) => setData(u)} onOriginalFile={setOriginalFile} currentResume={data} />
      {originalFile && <OriginalPdfPreview file={originalFile} />}
      {data && (
        <>
          <ChatCustomizer data={data} onUpdate={setData} />
          <DownloadButton data={data} originalFile={originalFile} />
        </>
      )}
    </div>
  )
}

export default App
