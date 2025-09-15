# PDF Overlay Update Feature

This document describes the new PDF overlay update functionality that preserves the original PDF formatting while updating the content.

## Overview

The PDF overlay update feature allows users to:
- Upload a resume PDF
- Make alterations using the existing chat/refinement system
- Download an updated PDF that maintains the original visual formatting, fonts, and layout
- Only the text content is updated, preserving the professional appearance

## Architecture

### Backend Components

#### 1. `services/pdfEditor.js`
- **Main function**: `applyEditsToPdf(originalBuffer, updatedJson)`
- Uses `pdf-lib` to load and modify PDFs
- Uses `pdf2json` for text positioning analysis
- Implements fallback strategy with white rectangles for text replacement

#### 2. `controllers/resumeController.js`
- **New endpoint**: `overlayUpdate(req, res)`
- Handles file upload and JSON data
- Returns modified PDF as binary response

#### 3. `routes/resume.js`
- **New route**: `POST /api/resume/overlay-update`
- Accepts multipart form data with file and updatedJson

### Frontend Components

#### 1. `services/api.js`
- **New method**: `overlayUpdate(file, updatedJson)`
- Handles binary response for PDF download

#### 2. `components/DownloadButton.jsx`
- **New button**: "Download Updated PDF"
- Integrates with existing download options
- Shows loading state during processing

## How It Works

### 1. Text Analysis
- Uses `pdf2json` to extract text elements with positions
- Groups text elements by resume sections (contact, experience, etc.)
- Calculates bounding boxes for each section

### 2. Content Replacement
- Draws white rectangles over existing text regions
- Overlays new content using `pdf-lib` text rendering
- Maintains approximate positioning and font sizes

### 3. Section Processing
- **Contact**: Name, email, phone with appropriate formatting
- **Summary**: Multi-line text with word wrapping
- **Experience/Education/Projects**: Bullet-pointed lists
- **Skills**: Comma-separated values with wrapping

## API Usage

### Endpoint: `POST /api/resume/overlay-update`

**Request:**
- `Content-Type: multipart/form-data`
- `file`: Original PDF file
- `updatedJson`: JSON string of updated resume data

**Response:**
- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="updated-resume.pdf"`
- Binary PDF data

**Example Request:**
```javascript
const formData = new FormData();
formData.append('file', pdfFile);
formData.append('updatedJson', JSON.stringify({
  contact: { name: 'John Doe', email: 'john@example.com' },
  summary: 'Updated summary text...',
  experience: ['Updated experience 1', 'Updated experience 2']
}));

const response = await fetch('/api/resume/overlay-update', {
  method: 'POST',
  body: formData
});
```

## Frontend Integration

### Download Button Usage
```jsx
<DownloadButton 
  data={updatedResumeData} 
  originalFile={originalPdfFile} 
/>
```

The component now provides three download options:
1. **Download Mapped PDF**: Original @react-pdf/renderer generated PDF
2. **Download Updated PDF**: New overlay-updated PDF (preserves original formatting)
3. **Download Original PDF**: The original uploaded PDF

## Technical Details

### Dependencies Added
- `pdf-lib`: For PDF manipulation and text overlay
- Existing `pdf2json`: For text position analysis

### Error Handling
- Graceful fallback if text positioning fails
- White rectangle overlay strategy for clean text replacement
- Comprehensive error logging and user feedback

### Performance Considerations
- Processes PDFs in memory for efficiency
- Maintains original PDF structure and metadata
- Optimized text rendering with appropriate font sizes

## Limitations

1. **Font Matching**: Uses Helvetica/HelveticaBold as fallback fonts
2. **Complex Layouts**: May not perfectly match very complex resume layouts
3. **Image Preservation**: Only handles text content, not images or graphics
4. **Multi-page**: Supports multi-page resumes but may need refinement for complex pagination

## Future Enhancements

1. **Font Detection**: Extract and preserve original fonts
2. **Layout Analysis**: More sophisticated layout detection
3. **Image Support**: Handle logos and graphics
4. **Style Preservation**: Maintain bold/italic formatting more accurately
5. **Template Matching**: Learn from common resume templates

## Testing

The feature can be tested by:
1. Uploading a resume PDF
2. Making alterations through the chat interface
3. Clicking "Download Updated PDF" to get the overlay-updated version
4. Comparing with the original to verify formatting preservation

## Troubleshooting

### Common Issues
1. **PDF not loading**: Ensure the uploaded file is a valid PDF
2. **Text not updating**: Check that the JSON structure matches expected format
3. **Layout issues**: The fallback white rectangle strategy should handle most cases

### Debug Information
- Check browser console for API errors
- Backend logs will show detailed error information
- PDF processing errors are logged with specific details
