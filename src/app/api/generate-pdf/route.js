// pages/api/generate-pdf.js
import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: 'Missing URL' });

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle0' });
  
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' }
  });

  await browser.close();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=worksheet.pdf');
  res.send(pdfBuffer);
}
