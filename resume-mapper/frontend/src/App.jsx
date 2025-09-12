import { useState } from 'react'
import './App.css'
import FileUpload from './components/FileUpload'
import TemplatePreview from './components/TemplatePreview'
import ChatCustomizer from './components/ChatCustomizer'
import TokenDisplay from './components/TokenDisplay'
import DownloadButton from './components/DownloadButton'

function App() {
  const [data, setData] = useState(null)

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24, display: 'grid', gap: 16 }}>
      <h1 style={{ margin: 0 }}>Resume Template Mapper</h1>
      <TokenDisplay />
      <FileUpload onParsed={setData} />
      {data && (
        <>
          <TemplatePreview data={data} />
          <ChatCustomizer data={data} onUpdate={setData} />
          <DownloadButton data={data} />
        </>
      )}
    </div>
  )
}

export default App
