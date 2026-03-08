import React, { useState, useEffect } from 'react';
import { 
  Search, Menu, X, Github, Info, 
  Image as ImageIcon, Video, Music, Calculator, 
  FileText, Code, Settings, Shield, Zap, FileCode,
  ArrowRight, ExternalLink, Download, Lock,
  Scissors, Type, Volume2, Mic, Sliders,
  RotateCw, Files, FileSearch, QrCode, TrendingUp,
  Scale, Ruler, Percent, Wallet, Clock, AlignLeft,
  Link as LinkIcon, Hash, Pipette, Maximize
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './utils';

const AdSlot: React.FC<{ className?: string; label?: string }> = ({ className, label = "Advertisement" }) => (
  <div className={cn("bg-slate-100 border border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 min-h-[100px]", className)}>
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</span>
    <div className="w-full h-full bg-slate-200/50 rounded flex items-center justify-center text-slate-300 italic text-xs">
      Ad Space
    </div>
  </div>
);

// Import Tools
import { ImageConverter, ImageCompressor, Base64Image, ImageResizer, ColorPicker, ImageCropper } from './tools/ImageTools';
import { TextToSpeech, SpeechToText, AudioTrimmer, AudioConverter } from './tools/MediaTools';
import { AgeCalculator, BMICalculator, EMICalculator, SIPCalculator, UnitConverter, PercentageCalculator, TipCalculator } from './tools/CalculatorTools';
import { QRCodeGenerator, PasswordGenerator, JSONFormatter, WordCounter, TimerStopwatch, Base64Text, CaseConverter, LoremIpsum, URLEncoder } from './tools/DevTools';
import { PDFMerger, ImageToPDF, PDFRotator, PDFSplitter, PDFTextExtractor, PDFPasswordProtector } from './tools/PdfTools';
import { BMRCalculator, BinaryConverter, HexConverter } from './tools/MiscTools';

// Categories Definition
const CATEGORIES = [
  { id: 'image', name: 'Image Tools', icon: ImageIcon, color: 'text-blue-500' },
  { id: 'media', name: 'Media Tools', icon: Music, color: 'text-purple-500' },
  { id: 'pdf', name: 'PDF Tools', icon: FileText, color: 'text-red-500' },
  { id: 'calc', name: 'Calculators', icon: Calculator, color: 'text-green-500' },
  { id: 'dev', name: 'Dev Tools', icon: Code, color: 'text-indigo-500' },
  { id: 'misc', name: 'Misc Tools', icon: Zap, color: 'text-orange-500' },
];

// Tools Definition
const TOOLS = [
  // Image Tools
  { id: 'image-converter', name: 'Image Converter', category: 'image', icon: ImageIcon, component: ImageConverter, description: 'Convert between JPG, PNG, WEBP' },
  { id: 'image-compressor', name: 'Image Compressor', category: 'image', icon: Sliders, component: ImageCompressor, description: 'Reduce image file size' },
  { id: 'base64-image', name: 'Base64 Image', category: 'image', icon: Code, component: Base64Image, description: 'Convert image to Base64' },
  { id: 'image-resizer', name: 'Image Resizer', category: 'image', icon: Maximize, component: ImageResizer, description: 'Change image dimensions' },
  { id: 'image-cropper', name: 'Image Cropper', category: 'image', icon: Scissors, component: ImageCropper, description: 'Crop images to square' },
  { id: 'color-picker', name: 'Color Picker', category: 'image', icon: Pipette, component: ColorPicker, description: 'Pick colors from palette' },
  
  // Media Tools
  { id: 'text-to-speech', name: 'Text to Speech', category: 'media', icon: Volume2, component: TextToSpeech, description: 'Convert text to audio' },
  { id: 'speech-to-text', name: 'Speech to Text', category: 'media', icon: Mic, component: SpeechToText, description: 'Transcribe voice to text' },
  { id: 'audio-trimmer', name: 'Audio Trimmer', category: 'media', icon: Scissors, component: AudioTrimmer, description: 'Cut audio files' },
  { id: 'audio-converter', name: 'Audio Converter', category: 'media', icon: Music, component: AudioConverter, description: 'Convert audio formats' },

  // PDF Tools
  { id: 'pdf-merger', name: 'PDF Merger', category: 'pdf', icon: Files, component: PDFMerger, description: 'Combine multiple PDFs' },
  { id: 'image-to-pdf', name: 'Image to PDF', category: 'pdf', icon: ImageIcon, component: ImageToPDF, description: 'Convert images to PDF' },
  { id: 'pdf-rotator', name: 'PDF Rotator', category: 'pdf', icon: RotateCw, component: PDFRotator, description: 'Rotate PDF pages' },
  { id: 'pdf-splitter', name: 'PDF Splitter', category: 'pdf', icon: Scissors, component: PDFSplitter, description: 'Split PDF into pages' },
  { id: 'pdf-text', name: 'PDF Text Extractor', category: 'pdf', icon: FileSearch, component: PDFTextExtractor, description: 'Extract text from PDF' },
  { id: 'pdf-protect', name: 'PDF Protector', category: 'pdf', icon: Lock, component: PDFPasswordProtector, description: 'Add password to PDF' },

  // Calculators
  { id: 'age-calculator', name: 'Age Calculator', category: 'calc', icon: Clock, component: AgeCalculator, description: 'Calculate exact age' },
  { id: 'bmi-calculator', name: 'BMI Calculator', category: 'calc', icon: Scale, component: BMICalculator, description: 'Calculate Body Mass Index' },
  { id: 'emi-calculator', name: 'EMI Calculator', category: 'calc', icon: Wallet, component: EMICalculator, description: 'Calculate loan EMI' },
  { id: 'sip-calculator', name: 'SIP Calculator', category: 'calc', icon: TrendingUp, component: SIPCalculator, description: 'Calculate investment growth' },
  { id: 'unit-converter', name: 'Unit Converter', category: 'calc', icon: Ruler, component: UnitConverter, description: 'Convert length, weight, temp' },
  { id: 'percentage-calc', name: 'Percentage Calc', category: 'calc', icon: Percent, component: PercentageCalculator, description: 'Calculate percentages' },
  { id: 'tip-calculator', name: 'Tip Calculator', category: 'calc', icon: Wallet, component: TipCalculator, description: 'Calculate tips & split bills' },

  // Dev Tools
  { id: 'qr-generator', name: 'QR Generator', category: 'dev', icon: QrCode, component: QRCodeGenerator, description: 'Generate QR codes' },
  { id: 'password-gen', name: 'Password Generator', category: 'dev', icon: Lock, component: PasswordGenerator, description: 'Create secure passwords' },
  { id: 'json-formatter', name: 'JSON Formatter', category: 'dev', icon: FileCode, component: JSONFormatter, description: 'Format & validate JSON' },
  { id: 'word-counter', name: 'Word Counter', category: 'dev', icon: AlignLeft, component: WordCounter, description: 'Count words & chars' },
  { id: 'stopwatch', name: 'Stopwatch', category: 'dev', icon: Clock, component: TimerStopwatch, description: 'Online stopwatch' },
  { id: 'base64-text', name: 'Base64 Text', category: 'dev', icon: Hash, component: Base64Text, description: 'Encode/Decode Base64' },
  { id: 'case-converter', name: 'Case Converter', category: 'dev', icon: Type, component: CaseConverter, description: 'Change text case' },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum', category: 'dev', icon: AlignLeft, component: LoremIpsum, description: 'Generate dummy text' },
  { id: 'url-encoder', name: 'URL Encoder', category: 'dev', icon: LinkIcon, component: URLEncoder, description: 'Encode/Decode URLs' },

  // Misc Tools
  { id: 'bmr-calculator', name: 'BMR Calculator', category: 'misc', icon: Calculator, component: BMRCalculator, description: 'Calculate metabolic rate' },
  { id: 'binary-converter', name: 'Binary Converter', category: 'misc', icon: Hash, component: BinaryConverter, description: 'Text to Binary' },
  { id: 'hex-converter', name: 'Hex Converter', category: 'misc', icon: Hash, component: HexConverter, description: 'Text to Hex' },
];

export default function App() {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Hash Routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setActiveToolId(hash || null);
      
      // Update SEO Title & Meta
      const tool = TOOLS.find(t => t.id === hash);
      if (tool) {
        document.title = `${tool.name} - The Master Editor All-in-One Utility`;
      } else {
        document.title = 'The Master Editor - 100% Client-Side All-in-One Utility Web App';
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const filteredTools = TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTool = TOOLS.find(t => t.id === activeToolId);

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-xl lg:shadow-none",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-bottom border-slate-100 flex items-center justify-between">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h1 className="font-black text-xl tracking-tight">The Master Editor</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">v1.0.0 • Client-Side</p>
              </div>
            </a>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tools..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 pb-6 space-y-8 custom-scrollbar">
            {CATEGORIES.map(category => {
              const categoryTools = filteredTools.filter(t => t.category === category.id);
              if (categoryTools.length === 0) return null;

              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center gap-2 px-2 mb-3">
                    <category.icon className={cn("w-4 h-4", category.color)} />
                    <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{category.name}</h2>
                  </div>
                  <div className="space-y-1">
                    {categoryTools.map(tool => (
                      <a 
                        key={tool.id}
                        href={`#${tool.id}`}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                          activeToolId === tool.id 
                            ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <tool.icon className={cn(
                          "w-4 h-4 transition-colors",
                          activeToolId === tool.id ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                        )} />
                        {tool.name}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <AdSlot className="mb-4" />
            <div className="flex items-center justify-between text-slate-400">
              <a href="https://github.com/faisuted" className="hover:text-slate-600 transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#info" className="hover:text-slate-600 transition-colors"><Info className="w-5 h-5" /></a>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Local Only</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:block">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <a href="#" className="hover:text-slate-900 transition-colors">Home</a>
                {activeTool && (
                  <>
                    <ArrowRight className="w-3 h-3" />
                    <span className="text-slate-900">{activeTool.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
              <Shield className="w-3 h-3" />
              100% Private & Secure
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto px-6 pt-6">
            <AdSlot className="w-full h-24" label="Top Advertisement" />
          </div>
          <AnimatePresence mode="wait">
            {!activeToolId ? (
              <motion.div 
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-6xl mx-auto px-6 py-12 lg:py-20"
              >
                <div className="text-center space-y-6 mb-20">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold mb-4"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    Over 40+ Tools in One App
                  </motion.div>
                  <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-tight">
                    The Ultimate <span className="text-indigo-600">All-in-One</span> <br /> Utility Toolbox
                  </h1>
                  <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    A comprehensive collection of 100% client-side tools for images, media, PDFs, calculations, and development. No uploads, no servers, just pure browser power.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <button onClick={() => document.getElementById('tools-grid')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all">
                      Explore All Tools
                    </button>
                    <a href="#info" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                      How it Works
                    </a>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                  {[
                    { title: '100% Private', desc: 'All processing happens in your browser. Your files never leave your device.', icon: Shield, color: 'bg-blue-500' },
                    { title: 'No Installation', desc: 'Works directly in your web browser on any device. No software to install.', icon: Zap, color: 'bg-orange-500' },
                    { title: 'Free & Fast', desc: 'Completely free to use with no limits. Blazing fast performance using native APIs.', icon: Zap, color: 'bg-green-500' },
                  ].map((feature, i) => (
                    <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg", feature.color)}>
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                      <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Tools Grid Section */}
                <div id="tools-grid" className="space-y-12">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Available Tools</h2>
                      <p className="text-slate-500 mt-2">Browse our collection of powerful utilities.</p>
                    </div>
                    <div className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
                      {TOOLS.length} Tools Ready
                    </div>
                  </div>

                  <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar bg-slate-100/30 p-4 rounded-3xl border border-slate-200/50 shadow-inner">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {TOOLS.map((tool, i) => (
                        <motion.a
                          key={tool.id}
                          href={`#${tool.id}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.02 }}
                          className="group p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all"
                        >
                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors mb-4">
                            <tool.icon className="w-6 h-6" />
                          </div>
                          <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{tool.name}</h3>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1">{tool.description}</p>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SEO Content Section */}
                <div className="mt-40 pt-20 border-t border-slate-200">
                  <div className="max-w-3xl mx-auto prose prose-slate">
                    <h2 className="text-3xl font-black text-slate-900 mb-8">Why Choose The Master Editor?</h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-6">
                      In today's digital world, we often need quick tools to convert images, edit PDFs, or perform complex calculations. Most online tools require you to upload your sensitive files to their servers, posing a significant privacy risk.
                    </p>
                    <p className="text-lg text-slate-600 leading-relaxed mb-6">
                      <strong>The Master Editor</strong> changes that. By leveraging modern browser APIs like the Canvas API, Web Audio API, and FileSystem API, we've built a suite of over 40 tools that run <strong>entirely on your device</strong>.
                    </p>
                    <ul className="space-y-4 text-slate-600">
                      <li className="flex gap-3">
                        <Zap className="w-5 h-5 text-indigo-600 shrink-0" />
                        <span><strong>Privacy First:</strong> Your data never leaves your computer. No server-side storage, no tracking.</span>
                      </li>
                      <li className="flex gap-3">
                        <Zap className="w-5 h-5 text-indigo-600 shrink-0" />
                        <span><strong>Offline Capable:</strong> Once loaded, many tools work even without an internet connection.</span>
                      </li>
                      <li className="flex gap-3">
                        <Zap className="w-5 h-5 text-indigo-600 shrink-0" />
                        <span><strong>Developer Friendly:</strong> Built with clean code and high performance in mind.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={activeToolId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto px-6 py-12"
              >
                {activeTool ? (
                  <activeTool.component />
                ) : (
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-slate-900">Tool Not Found</h2>
                    <p className="text-slate-500 mt-2">The tool you're looking for doesn't exist or has been moved.</p>
                    <a href="#" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">Back to Home</a>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="max-w-6xl mx-auto px-6 pb-12">
            <AdSlot className="w-full h-32" label="Bottom Advertisement" />
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
            <p>© 2025 The Master Editor. Built with 100% Client-Side Technology.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
              <a href="https://github.com/faisuted" className="flex items-center gap-1 hover:text-slate-600 transition-colors">
                <Github className="w-4 h-4" /> GitHub
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
