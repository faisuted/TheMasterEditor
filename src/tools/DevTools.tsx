import React, { useState, useEffect } from 'react';
import { ToolWrapper } from '../components/ToolWrapper';
import { QrCode, Lock, FileCode, Type, Hash, Clock, AlignLeft, Link as LinkIcon, FileText } from 'lucide-react';
import QRCode from 'qrcode';

export const QRCodeGenerator: React.FC = () => {
  const [text, setText] = useState('https://omnitool.app');
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    if (text) {
      QRCode.toDataURL(text, { width: 400, margin: 2 }, (err, url) => {
        if (!err) setQrUrl(url);
      });
    }
  }, [text]);

  return (
    <ToolWrapper
      title="QR Code Generator"
      description="Generate high-quality QR codes for URLs, text, or contact info."
      seoText="Create custom QR codes instantly. Our free online generator allows you to convert any link or text into a downloadable QR code image."
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Enter URL or Text</label>
          <input 
            type="text" value={text} 
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://example.com"
          />
        </div>
        {qrUrl && (
          <div className="flex flex-col items-center gap-6">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
              <img src={qrUrl} alt="QR Code" className="w-64 h-64" />
            </div>
            <a 
              href={qrUrl} download="qrcode.png"
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              Download PNG
            </a>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};

export const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState({
    upper: true, lower: true, numbers: true, symbols: true
  });

  const generate = () => {
    const charSets = {
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lower: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };
    let chars = '';
    if (options.upper) chars += charSets.upper;
    if (options.lower) chars += charSets.lower;
    if (options.numbers) chars += charSets.numbers;
    if (options.symbols) chars += charSets.symbols;
    
    let pass = '';
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  useEffect(generate, [length, options]);

  return (
    <ToolWrapper
      title="Password Generator"
      description="Create strong, secure passwords to protect your accounts."
      seoText="Generate random, secure passwords with our free tool. Customize length and character types to meet any security requirement. 100% client-side."
    >
      <div className="space-y-6">
        <div className="p-6 bg-slate-900 rounded-2xl text-center relative group">
          <div className="text-2xl font-mono text-indigo-400 break-all">{password}</div>
          <button 
            onClick={() => navigator.clipboard.writeText(password)}
            className="mt-4 text-xs text-slate-400 hover:text-white transition-colors uppercase tracking-widest font-bold"
          >
            Click to Copy
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700">Length: {length}</label>
            <input 
              type="range" min="8" max="64" value={length} 
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-48 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(options).map(([key, val]) => (
              <label key={key} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input 
                  type="checkbox" checked={val} 
                  onChange={() => setOptions(prev => ({ ...prev, [key]: !val }))}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="text-sm font-medium text-slate-700 capitalize">{key}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};

export const JSONFormatter: React.FC = () => {
  const [json, setJson] = useState('');
  const [error, setError] = useState('');

  const format = () => {
    try {
      const parsed = JSON.parse(json);
      setJson(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(json);
      setJson(JSON.stringify(parsed));
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <ToolWrapper
      title="JSON Formatter & Validator"
      description="Format, minify, and validate your JSON code."
      seoText="Clean up your JSON data with our online formatter. Validate syntax, minify code, and make it readable instantly. Perfect for developers."
    >
      <div className="space-y-4">
        <textarea 
          value={json} onChange={(e) => setJson(e.target.value)}
          className="w-full h-80 p-4 border border-slate-300 rounded-xl font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
          placeholder="Paste your JSON here..."
        />
        {error && <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
        <div className="flex gap-4">
          <button onClick={format} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">Format</button>
          <button onClick={minify} className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition-colors">Minify</button>
        </div>
      </div>
    </ToolWrapper>
  );
};

export const WordCounter: React.FC = () => {
  const [text, setText] = useState('');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const lines = text.split('\n').filter(l => l.length > 0).length;
  return (
    <ToolWrapper
      title="Word Counter"
      description="Count words, characters, and lines in your text."
      seoText="Analyze your text instantly. Get word count, character count, and line count for any content. Useful for writers and students."
    >
      <div className="space-y-6">
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-64 p-4 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Type or paste text..." />
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div className="text-2xl font-bold text-indigo-600">{words}</div>
            <div className="text-xs text-slate-500 uppercase">Words</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div className="text-2xl font-bold text-indigo-600">{chars}</div>
            <div className="text-xs text-slate-500 uppercase">Characters</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div className="text-2xl font-bold text-indigo-600">{lines}</div>
            <div className="text-xs text-slate-500 uppercase">Lines</div>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};

export const TimerStopwatch: React.FC = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    let interval: any;
    if (running) interval = setInterval(() => setTime(t => t + 10), 10);
    else clearInterval(interval);
    return () => clearInterval(interval);
  }, [running]);
  const format = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const mss = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${mss.toString().padStart(2, '0')}`;
  };
  return (
    <ToolWrapper
      title="Stopwatch"
      description="A simple and precise online stopwatch."
      seoText="Track time with our accurate online stopwatch. Start, stop, and reset with ease. Perfect for timing tasks and workouts."
    >
      <div className="flex flex-col items-center space-y-8 py-8">
        <div className="text-7xl font-mono font-black text-slate-900 tracking-tighter">{format(time)}</div>
        <div className="flex gap-4">
          <button onClick={() => setRunning(!running)} className={`px-8 py-3 rounded-full font-bold text-white transition-all shadow-lg ${running ? 'bg-red-600' : 'bg-green-600'}`}>{running ? 'Stop' : 'Start'}</button>
          <button onClick={() => { setTime(0); setRunning(false); }} className="px-8 py-3 rounded-full font-bold bg-slate-800 text-white shadow-lg">Reset</button>
        </div>
      </div>
    </ToolWrapper>
  );
};

export const Base64Text: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const encode = () => setOutput(btoa(input));
  const decode = () => { try { setOutput(atob(input)); } catch { setOutput('Invalid Base64'); } };
  return (
    <ToolWrapper
      title="Base64 Text Encoder/Decoder"
      description="Encode or decode text to Base64 format."
      seoText="Convert text to Base64 and back. Useful for data encoding and web development tasks."
    >
      <div className="space-y-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-32 p-3 border border-slate-300 rounded-xl outline-none" placeholder="Input text..." />
        <div className="flex gap-4">
          <button onClick={encode} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold">Encode</button>
          <button onClick={decode} className="flex-1 bg-slate-800 text-white py-2 rounded-lg font-bold">Decode</button>
        </div>
        <textarea value={output} readOnly className="w-full h-32 p-3 border border-slate-300 rounded-xl bg-slate-50" placeholder="Output..." />
      </div>
    </ToolWrapper>
  );
};

export const CaseConverter: React.FC = () => {
  const [text, setText] = useState('');
  const convert = (type: string) => {
    if (type === 'upper') setText(text.toUpperCase());
    if (type === 'lower') setText(text.toLowerCase());
    if (type === 'title') setText(text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
  };
  return (
    <ToolWrapper
      title="Case Converter"
      description="Change text case to UPPERCASE, lowercase, or Title Case."
      seoText="Quickly change the case of your text. Supports uppercase, lowercase, and title case conversions."
    >
      <div className="space-y-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-48 p-4 border border-slate-300 rounded-xl outline-none" placeholder="Enter text..." />
        <div className="flex flex-wrap gap-2">
          <button onClick={() => convert('upper')} className="px-4 py-2 bg-slate-100 rounded-lg font-medium hover:bg-slate-200">UPPERCASE</button>
          <button onClick={() => convert('lower')} className="px-4 py-2 bg-slate-100 rounded-lg font-medium hover:bg-slate-200">lowercase</button>
          <button onClick={() => convert('title')} className="px-4 py-2 bg-slate-100 rounded-lg font-medium hover:bg-slate-200">Title Case</button>
        </div>
      </div>
    </ToolWrapper>
  );
};

export const LoremIpsum: React.FC = () => {
  const [paras, setParas] = useState(3);
  const [text, setText] = useState('');
  const generate = () => {
    const base = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ";
    setText(Array(paras).fill(base).join('\n\n'));
  };
  useEffect(generate, [paras]);
  return (
    <ToolWrapper
      title="Lorem Ipsum Generator"
      description="Generate placeholder text for your designs and layouts."
      seoText="Create dummy text for your mockups. Choose the number of paragraphs and copy the generated Lorem Ipsum text."
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Paragraphs:</label>
          <input type="number" value={paras} onChange={(e) => setParas(parseInt(e.target.value))} className="w-20 p-2 border border-slate-300 rounded-lg" />
        </div>
        <textarea value={text} readOnly className="w-full h-64 p-4 border border-slate-300 rounded-xl bg-slate-50 outline-none" />
        <button onClick={() => navigator.clipboard.writeText(text)} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">Copy Text</button>
      </div>
    </ToolWrapper>
  );
};

export const URLEncoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const encode = () => setOutput(encodeURIComponent(input));
  const decode = () => { try { setOutput(decodeURIComponent(input)); } catch { setOutput('Invalid URL'); } };
  return (
    <ToolWrapper
      title="URL Encoder/Decoder"
      description="Safely encode or decode URLs for web use."
      seoText="Encode special characters in URLs or decode encoded links. Essential for web development and debugging."
    >
      <div className="space-y-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-32 p-3 border border-slate-300 rounded-xl outline-none" placeholder="Enter URL or text..." />
        <div className="flex gap-4">
          <button onClick={encode} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold">Encode</button>
          <button onClick={decode} className="flex-1 bg-slate-800 text-white py-2 rounded-lg font-bold">Decode</button>
        </div>
        <textarea value={output} readOnly className="w-full h-32 p-3 border border-slate-300 rounded-xl bg-slate-50" placeholder="Output..." />
      </div>
    </ToolWrapper>
  );
};
