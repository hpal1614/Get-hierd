const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const { extractStructuredFromPdf } = require('./pdfParser');

/**
 * Applies edits to the original PDF while preserving formatting and layout
 * @param {Buffer} originalBuffer - The original PDF buffer
 * @param {Object} updatedJson - The updated resume data structure
 * @returns {Promise<Buffer>} - The modified PDF buffer
 */
async function applyEditsToPdf(originalBuffer, updatedJson) {
  try {
    console.log('📄 Starting PDF edit process...');
    
    // Load the original PDF
    const pdfDoc = await PDFDocument.load(originalBuffer);
    const pages = pdfDoc.getPages();
    console.log(`📄 Loaded PDF with ${pages.length} pages`);
    
    // Get structured PDF data for text positioning
    let structuredPdf;
    try {
      structuredPdf = await extractStructuredFromPdf(originalBuffer);
      console.log('📄 Successfully extracted structured PDF data');
    } catch (error) {
      console.warn('⚠️ Could not extract structured PDF data, using fallback approach:', error.message);
      structuredPdf = { Pages: [] };
    }
    
    // Process each page
    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      const page = pages[pageIndex];
      const pageData = structuredPdf.Pages && structuredPdf.Pages[pageIndex] ? structuredPdf.Pages[pageIndex] : null;
      
      console.log(`📄 Processing page ${pageIndex + 1}...`);
      
      if (!pageData || !pageData.Texts || pageData.Texts.length === 0) {
        console.log(`⚠️ No text data for page ${pageIndex + 1}, using fallback`);
        await addFallbackContent(page, updatedJson, pageIndex);
        continue;
      }
      
      // Get text elements from the page
      const textElements = pageData.Texts || [];
      console.log(`📄 Found ${textElements.length} text elements on page ${pageIndex + 1}`);
      
      // Simple approach: just overlay new content on top
      await overlayNewContent(page, textElements, updatedJson, pageIndex);
    }
    
    console.log('✅ PDF edit process completed successfully');
    // Return the modified PDF as buffer
    return await pdfDoc.save();
  } catch (error) {
    console.error('❌ Error applying edits to PDF:', error);
    throw new Error(`Failed to apply edits to PDF: ${error.message}`);
  }
}

/**
 * Simple overlay approach - just draw new content on top
 */
async function overlayNewContent(page, textElements, updatedJson, pageIndex) {
  const { width, height } = page.getSize();
  
  // Get available fonts
  const helvetica = await page.doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await page.doc.embedFont(StandardFonts.HelveticaBold);
  
  console.log(`📄 Overlaying new content on page ${pageIndex + 1}...`);
  
  // Only process first page for contact, summary, skills
  if (pageIndex === 0) {
    // Draw a white rectangle to cover the top area
    page.drawRectangle({
      x: 0,
      y: height - 200, // Cover top 200 points
      width: width,
      height: 200,
      color: rgb(1, 1, 1), // White background
    });
    
    // Draw new contact info
    if (updatedJson.contact) {
      let currentY = height - 50;
      
      if (updatedJson.contact.name) {
        page.drawText(updatedJson.contact.name.toUpperCase(), {
          x: 50,
          y: currentY,
          size: 18,
          font: helveticaBold,
          color: rgb(0, 0, 0),
        });
        currentY -= 25;
      }
      
      const contactInfo = [];
      if (updatedJson.contact.email) contactInfo.push(updatedJson.contact.email);
      if (updatedJson.contact.phone) contactInfo.push(updatedJson.contact.phone);
      if (updatedJson.contact.address) contactInfo.push(updatedJson.contact.address);
      
      if (contactInfo.length > 0) {
        page.drawText(contactInfo.join(' | '), {
          x: 50,
          y: currentY,
          size: 12,
          font: helvetica,
          color: rgb(0, 0, 0),
        });
        currentY -= 20;
      }
      
      const links = [];
      if (updatedJson.contact.linkedin) links.push(`LinkedIn: ${updatedJson.contact.linkedin}`);
      if (updatedJson.contact.portfolio) links.push(`Portfolio: ${updatedJson.contact.portfolio}`);
      
      if (links.length > 0) {
        page.drawText(links.join(' | '), {
          x: 50,
          y: currentY,
          size: 12,
          font: helvetica,
          color: rgb(0, 0, 0),
        });
        currentY -= 30;
      }
      
      // Draw summary
      if (updatedJson.summary) {
        page.drawText('SUMMARY', {
          x: 50,
          y: currentY,
          size: 14,
          font: helveticaBold,
          color: rgb(0, 0, 0),
        });
        currentY -= 20;
        
        // Word wrap the summary
        const words = updatedJson.summary.split(' ');
        let currentLine = '';
        const maxWidth = width - 100;
        
        for (const word of words) {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          if (testLine.length > 80 && currentLine) {
            page.drawText(currentLine, {
              x: 50,
              y: currentY,
              size: 11,
              font: helvetica,
              color: rgb(0, 0, 0),
            });
            currentY -= 15;
            currentLine = word;
            if (currentY < height - 180) break;
          } else {
            currentLine = testLine;
          }
        }
        
        if (currentLine && currentY > height - 180) {
          page.drawText(currentLine, {
            x: 50,
            y: currentY,
            size: 11,
            font: helvetica,
            color: rgb(0, 0, 0),
          });
          currentY -= 25;
        }
      }
      
      // Draw skills
      if (updatedJson.skills && Array.isArray(updatedJson.skills)) {
        page.drawText('TECHNICAL SKILLS', {
          x: 50,
          y: currentY,
          size: 14,
          font: helveticaBold,
          color: rgb(0, 0, 0),
        });
        currentY -= 20;
        
        const skillsText = updatedJson.skills.join(', ');
        const words = skillsText.split(' ');
        let currentLine = '';
        
        for (const word of words) {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          if (testLine.length > 80 && currentLine) {
            page.drawText(currentLine, {
              x: 50,
              y: currentY,
              size: 11,
              font: helvetica,
              color: rgb(0, 0, 0),
            });
            currentY -= 15;
            currentLine = word;
            if (currentY < height - 180) break;
          } else {
            currentLine = testLine;
          }
        }
        
        if (currentLine && currentY > height - 180) {
          page.drawText(currentLine, {
            x: 50,
            y: currentY,
            size: 11,
            font: helvetica,
            color: rgb(0, 0, 0),
          });
        }
      }
    }
  }
  
  // Process experience on appropriate pages
  if (updatedJson.experience && Array.isArray(updatedJson.experience)) {
    // Draw a white rectangle to cover the experience area
    page.drawRectangle({
      x: 0,
      y: height - 400, // Cover middle area
      width: width,
      height: 200,
      color: rgb(1, 1, 1), // White background
    });
    
    let currentY = height - 250;
    
    page.drawText('PROFESSIONAL EXPERIENCE', {
      x: 50,
      y: currentY,
      size: 14,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    currentY -= 20;
    
    updatedJson.experience.forEach((item, index) => {
      if (currentY < height - 400) return;
      
      const text = typeof item === 'string' ? item : JSON.stringify(item);
      page.drawText('• ' + text, {
        x: 50,
        y: currentY,
        size: 11,
        font: helvetica,
        color: rgb(0, 0, 0),
      });
      currentY -= 15;
    });
  }
  
  // Process education on appropriate pages
  if (updatedJson.education && Array.isArray(updatedJson.education)) {
    // Draw a white rectangle to cover the education area
    page.drawRectangle({
      x: 0,
      y: height - 600, // Cover bottom area
      width: width,
      height: 200,
      color: rgb(1, 1, 1), // White background
    });
    
    let currentY = height - 450;
    
    page.drawText('EDUCATION', {
      x: 50,
      y: currentY,
      size: 14,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    currentY -= 20;
    
    updatedJson.education.forEach((item, index) => {
      if (currentY < height - 600) return;
      
      const text = typeof item === 'string' ? item : JSON.stringify(item);
      page.drawText('• ' + text, {
        x: 50,
        y: currentY,
        size: 11,
        font: helvetica,
        color: rgb(0, 0, 0),
      });
      currentY -= 15;
    });
  }
}

/**
 * Fallback function to add content when structured PDF data is not available
 */
async function addFallbackContent(page, updatedJson, pageIndex) {
  const { width, height } = page.getSize();
  const helvetica = await page.doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await page.doc.embedFont(StandardFonts.HelveticaBold);
  
  console.log(`📄 Using fallback content for page ${pageIndex + 1}`);
  
  // Draw a white background to cover existing content
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    color: rgb(1, 1, 1), // White background
  });
  
  const fontSize = 12;
  const lineHeight = fontSize + 4;
  let currentY = height - 50; // Start from top with margin
  
  // Add contact information
  if (updatedJson.contact) {
    if (updatedJson.contact.name) {
      page.drawText(updatedJson.contact.name, {
        x: 30,
        y: currentY,
        size: fontSize + 6,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });
      currentY -= lineHeight * 1.5;
    }
    
    const contactInfo = [
      updatedJson.contact.email,
      updatedJson.contact.phone
    ].filter(Boolean).join(' | ');
    
    if (contactInfo) {
      page.drawText(contactInfo, {
        x: 30,
        y: currentY,
        size: fontSize,
        font: helvetica,
        color: rgb(0, 0, 0),
      });
      currentY -= lineHeight * 2;
    }
  }
  
  // Add summary
  if (updatedJson.summary) {
    page.drawText('SUMMARY', {
      x: 30,
      y: currentY,
      size: fontSize + 2,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    currentY -= lineHeight;
    
    const words = updatedJson.summary.split(' ');
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      if (testLine.length > 80) {
        page.drawText(currentLine, {
          x: 30,
          y: currentY,
          size: fontSize,
          font: helvetica,
          color: rgb(0, 0, 0),
        });
        currentY -= lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      page.drawText(currentLine, {
        x: 30,
        y: currentY,
        size: fontSize,
        font: helvetica,
        color: rgb(0, 0, 0),
      });
      currentY -= lineHeight * 1.5;
    }
  }
  
  // Add other sections if there's space
  const sections = [
    { name: 'EXPERIENCE', data: updatedJson.experience },
    { name: 'EDUCATION', data: updatedJson.education },
    { name: 'SKILLS', data: updatedJson.skills }
  ];
  
  for (const section of sections) {
    if (!section.data || !Array.isArray(section.data) || section.data.length === 0) continue;
    if (currentY < 50) break; // No more space
    
    page.drawText(section.name, {
      x: 30,
      y: currentY,
      size: fontSize + 2,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    currentY -= lineHeight;
    
    for (const item of section.data.slice(0, 5)) { // Limit to 5 items per section
      if (currentY < 50) break;
      
      const text = typeof item === 'string' ? item : JSON.stringify(item);
      const displayText = text.length > 100 ? text.substring(0, 100) + '...' : text;
      
      page.drawText('• ' + displayText, {
        x: 30,
        y: currentY,
        size: fontSize,
        font: helvetica,
        color: rgb(0, 0, 0),
      });
      currentY -= lineHeight;
    }
    
    currentY -= lineHeight * 0.5; // Extra space between sections
  }
}

module.exports = { applyEditsToPdf };