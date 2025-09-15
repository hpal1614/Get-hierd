const pdfParse = require('pdf-parse');
const PDFParser = require('pdf2json');

async function extractTextFromPdf(buffer) {
  const data = await pdfParse(buffer);
  return data.text || '';
}

function extractStructuredFromPdf(buffer) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on('pdfParser_dataError', (err) => reject(err.parserError || err));
    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      resolve(pdfData);
    });
    pdfParser.parseBuffer(buffer);
  });
}

module.exports = { extractTextFromPdf, extractStructuredFromPdf };


