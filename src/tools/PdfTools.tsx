import React, { useState } from 'react';
import { ToolWrapper } from '../components/ToolWrapper';
import { FileText, Files, Image as ImageIcon, RotateCw, Scissors, FileSearch, Lock, Download, Trash2, Copy } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const PDFMerger: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const merge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const pdfBytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged-document.pdf';
      link.click();
    } catch (error) {
      console.error('Merge failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolWrapper
      title="PDF Merger"
      description="Combine multiple PDF files into a single document."
      seoText="Merge PDFs online for free. Our client-side tool allows you to combine multiple PDF documents into one without uploading them to any server. Fast, secure, and easy."
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-12 bg-slate-50">
          <input type="file" onChange={handleUpload} className="hidden" id="pdf-merge-upload" accept=".pdf" multiple />
          <label htmlFor="pdf-merge-upload" className="cursor-pointer flex flex-col items-center">
            <Files className="w-12 h-12 text-slate-400 mb-4" />
            <span className="text-slate-600 font-medium">Upload PDF Files to Merge</span>
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-200">
              {files.map((f, i) => (
                <div key={i} className="p-3 flex items-center justify-between">
                  <span className="text-sm text-slate-600 truncate max-w-[200px]">{f.name}</span>
                  <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button 
              onClick={merge}
              disabled={files.length < 2 || isProcessing}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Merging...' : `Merge ${files.length} Files`}
            </button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};

export const ImageToPDF: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const convert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const file of files) {
        const imgBytes = await file.arrayBuffer();
        let img;
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          img = await pdfDoc.embedJpg(imgBytes);
        } else if (file.type === 'image/png') {
          img = await pdfDoc.embedPng(imgBytes);
        } else continue;

        const page = pdfDoc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'images-to-pdf.pdf';
      link.click();
    } catch (error) {
      console.error('Conversion failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolWrapper
      title="Image to PDF"
      description="Convert JPG and PNG images into a PDF document."
      seoText="Create PDF documents from your images instantly. Our tool supports JPG and PNG formats and works entirely in your browser for maximum privacy."
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-12 bg-slate-50">
          <input type="file" onChange={handleUpload} className="hidden" id="img-pdf-upload" accept="image/jpeg,image/png" multiple />
          <label htmlFor="img-pdf-upload" className="cursor-pointer flex flex-col items-center">
            <ImageIcon className="w-12 h-12 text-slate-400 mb-4" />
            <span className="text-slate-600 font-medium">Upload Images (JPG/PNG)</span>
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {files.map((f, i) => (
                <div key={i} className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                  <img src={URL.createObjectURL(f)} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <button 
              onClick={convert}
              disabled={isProcessing}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              {isProcessing ? 'Converting...' : 'Convert to PDF'}
            </button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};

export const PDFRotator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);

  const rotate = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      pages.forEach(page => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotation));
      });
      const rotatedBytes = await pdfDoc.save();
      const blob = new Blob([rotatedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'rotated-document.pdf';
      link.click();
    } catch (error) {
      console.error('Rotation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolWrapper
      title="PDF Rotator"
      description="Rotate all pages in a PDF document by 90, 180, or 270 degrees."
      seoText="Fix the orientation of your PDF files. Rotate all pages clockwise easily with our browser-based PDF rotation tool."
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-12 bg-slate-50">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="pdf-rotate-upload" accept=".pdf" />
          <label htmlFor="pdf-rotate-upload" className="cursor-pointer flex flex-col items-center">
            <RotateCw className="w-12 h-12 text-slate-400 mb-4" />
            <span className="text-slate-600 font-medium">Upload PDF to Rotate</span>
          </label>
        </div>

        {file && (
          <div className="space-y-6">
            <div className="flex justify-center gap-4">
              {[90, 180, 270].map(deg => (
                <button 
                  key={deg}
                  onClick={() => setRotation(deg)}
                  className={`px-6 py-2 rounded-lg font-medium border transition-all ${
                    rotation === deg ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-500'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
            <button 
              onClick={rotate}
              disabled={isProcessing}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Rotate & Download'}
            </button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};

export const PDFSplitter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const split = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pageCount = pdfDoc.getPageCount();
      for (let i = 0; i < pageCount; i++) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(page);
        const bytes = await newPdf.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `page-${i+1}.pdf`;
        link.click();
      }
    } finally { setIsProcessing(false); }
  };
  return (
    <ToolWrapper
      title="PDF Splitter"
      description="Split a PDF into individual pages."
      seoText="Extract every page of your PDF as a separate file. Fast and secure browser-based splitting."
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-12 bg-slate-50">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="pdf-split-upload" accept=".pdf" />
          <label htmlFor="pdf-split-upload" className="cursor-pointer flex flex-col items-center">
            <Scissors className="w-12 h-12 text-slate-400 mb-4" />
            <span className="text-slate-600 font-medium">Upload PDF to Split</span>
          </label>
        </div>
        {file && (
          <button onClick={split} disabled={isProcessing} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">
            {isProcessing ? 'Splitting...' : 'Split into Pages'}
          </button>
        )}
      </div>
    </ToolWrapper>
  );
};

export const PDFTextExtractor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const extractText = async () => {
    if (!file) return;
    setIsProcessing(true);
    setText('');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }
      
      setText(fullText || 'No text found in this PDF.');
    } catch (error) {
      console.error('Extraction failed:', error);
      setText('Failed to extract text. The PDF might be scanned or encrypted.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolWrapper
      title="PDF Text Extractor"
      description="Extract plain text from your PDF documents instantly."
      seoText="Quickly get the text content from any PDF file. Ideal for copying data or analyzing documents. 100% client-side and secure."
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-12 bg-slate-50">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="pdf-text-upload" accept=".pdf" />
          <label htmlFor="pdf-text-upload" className="cursor-pointer flex flex-col items-center">
            <FileSearch className="w-12 h-12 text-slate-400 mb-4" />
            <span className="text-slate-600 font-medium">Upload PDF to Extract Text</span>
          </label>
        </div>

        {file && !text && (
          <button 
            onClick={extractText} 
            disabled={isProcessing}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            {isProcessing ? 'Extracting...' : 'Extract Text'}
          </button>
        )}

        {text && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Extracted Content</h4>
              <button 
                onClick={() => navigator.clipboard.writeText(text)}
                className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                <Copy className="w-3 h-3" /> Copy All
              </button>
            </div>
            <textarea 
              value={text} 
              readOnly 
              className="w-full h-80 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:ring-0 outline-none resize-none"
            />
            <button 
              onClick={() => { setFile(null); setText(''); }}
              className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold"
            >
              Clear & Start Over
            </button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};

export const PDFPasswordProtector: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  
  const protect = async () => {
    if (!file || !password) return;
    // Note: pdf-lib doesn't support encryption directly yet.
    // We inform the user and provide a professional explanation.
    alert("PDF Encryption (Password Protection) is a complex feature that requires specialized server-side libraries or heavy WASM modules for full security. To keep this app 100% free and client-side, this feature is currently limited. We recommend using system-level tools for sensitive encryption.");
  };

  return (
    <ToolWrapper
      title="PDF Password Protector"
      description="Secure your PDF files with a password (Information Only)."
      seoText="Learn about PDF security and how to protect your documents. Note: True client-side encryption is limited in browsers."
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-12 bg-slate-50">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="pdf-pass-upload" accept=".pdf" />
          <label htmlFor="pdf-pass-upload" className="cursor-pointer flex flex-col items-center">
            <Lock className="w-12 h-12 text-slate-400 mb-4" />
            <span className="text-slate-600 font-medium">Upload PDF to Protect</span>
          </label>
        </div>
        
        {file && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              <strong>Note:</strong> True PDF encryption is highly specialized. This tool currently serves as a demonstration of the UI flow for security features.
            </div>
            <input 
              type="password" 
              placeholder="Enter Desired Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
            <button onClick={protect} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
              Protect PDF
            </button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
