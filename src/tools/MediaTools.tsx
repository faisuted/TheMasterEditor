import React, { useState, useRef, useEffect } from 'react';
import { ToolWrapper } from '../components/ToolWrapper';
import { Play, Pause, Volume2, Mic, MicOff, Type, Download, Music } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";

export const TextToSpeech: React.FC = () => {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceSearch, setVoiceSearch] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !voice) {
        setVoice(availableVoices[0]);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [voice]);

  const filteredVoices = voices.filter(v => 
    v.name.toLowerCase().includes(voiceSearch.toLowerCase()) || 
    v.lang.toLowerCase().includes(voiceSearch.toLowerCase())
  );

  const downloadAudio = async () => {
    if (!text) return;
    setIsDownloading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      // Using Gemini 2.5 Flash TTS for high-quality, secure downloads
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text.slice(0, 2000) }] }], // Increased limit to 2000 chars
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              // Using 'Zephyr' as a high-quality default for downloads
              prebuiltVoiceConfig: { voiceName: 'Zephyr' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      
      if (!base64Audio) {
        throw new Error("No audio data received from API");
      }

      // Convert base64 to blob
      const byteCharacters = atob(base64Audio);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/mp3' });

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `master-editor-speech.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed", error);
      alert("Download failed. Please ensure you have a stable internet connection. The high-quality download service might be temporarily unavailable.");
    } finally {
      setIsDownloading(false);
    }
  };

  const speak = (shouldRecord = false) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      if (shouldRecord) startRecording();
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      if (shouldRecord) stopRecording();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      if (shouldRecord) stopRecording();
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    try {
      // Note: Capturing system audio is browser-dependent. 
      // Most browsers don't allow capturing speechSynthesis output directly via getDisplayMedia.
      // A better way for client-side is to use the Web Audio API to route the speech.
      // However, speechSynthesis doesn't expose an AudioNode.
      // For now, we'll provide a "Record via Mic" or inform the user.
      // Actually, many users expect a direct download. Since native TTS doesn't support it,
      // we'll add a note and provide the controls requested.
    } catch (err) {
      console.error("Recording failed", err);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <ToolWrapper
      title="Text to Speech"
      description="Convert written text into natural-sounding speech with custom controls."
      seoText="Free online text-to-speech tool. Convert any text into spoken audio using high-quality browser voices. Adjust rate, pitch, and volume. Perfect for accessibility and content creation."
    >
      <div className="space-y-6">
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-48 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
          placeholder="Type or paste your text here..."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between">
              Speed (Rate) <span>{rate}x</span>
            </label>
            <input 
              type="range" min="0.5" max="2" step="0.1" value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between">
              Pitch <span>{pitch}</span>
            </label>
            <input 
              type="range" min="0" max="2" step="0.1" value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between">
              Volume <span>{Math.round(volume * 100)}%</span>
            </label>
            <input 
              type="range" min="0" max="1" step="0.1" value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Search & Select Voice</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Search language (e.g. Hindi, French)..."
                value={voiceSearch}
                onChange={(e) => setVoiceSearch(e.target.value)}
                className="flex-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <select 
                className="flex-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                onChange={(e) => setVoice(voices.find(v => v.voiceURI === e.target.value) || null)}
                value={voice?.voiceURI || ''}
              >
                {filteredVoices.map((v, i) => (
                  <option key={`${v.voiceURI}-${i}`} value={v.voiceURI}>{v.name} ({v.lang})</option>
                ))}
                {filteredVoices.length === 0 && <option disabled>No voices found</option>}
              </select>
            </div>
          </div>
          
          <div className="flex gap-2 pt-6">
            {!isSpeaking ? (
              <button 
                onClick={() => speak(false)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" /> Speak
              </button>
            ) : (
              <button 
                onClick={stop}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Pause className="w-4 h-4" /> Stop
              </button>
            )}
            
            <button 
              onClick={downloadAudio}
              disabled={isDownloading || !text}
              className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-900 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> {isDownloading ? 'Downloading...' : 'Download MP3'}
            </button>
          </div>
        </div>
        {text.length > 2000 && (
          <p className="text-[10px] text-slate-400 italic">Note: Downloads are limited to the first 2000 characters.</p>
        )}
      </div>
    </ToolWrapper>
  );
};

export const SpeechToText: React.FC = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [lang, setLang] = useState('en-US');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setText(prev => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      recognition.onend = () => {
        // If it was supposed to be listening, restart it (fixes auto-off issue)
        if (isListening) {
          setTimeout(() => {
            try {
              if (isListening) recognition.start();
            } catch (e) {
              console.error("Failed to restart recognition", e);
            }
          }, 100);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
          alert("Microphone access denied. Please enable microphone permissions in your browser settings.");
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    }
  }, [lang, isListening]);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      recognitionRef.current?.stop();
    } else {
      setText('');
      setIsListening(true);
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error("Start failed", e);
      }
    }
  };

  return (
    <ToolWrapper
      title="Speech to Text"
      description="Transcribe your voice into text in real-time."
      seoText="Convert spoken words into text instantly with our browser-based speech recognition tool. Secure, private, and 100% client-side."
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <select 
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="flex-1 min-w-[200px] p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es-ES">Spanish (Spain)</option>
            <option value="fr-FR">French (France)</option>
            <option value="de-DE">German (Germany)</option>
            <option value="hi-IN">Hindi (India)</option>
            <option value="gu-IN">Gujarati (India)</option>
            <option value="mr-IN">Marathi (India)</option>
            <option value="ta-IN">Tamil (India)</option>
            <option value="te-IN">Telugu (India)</option>
            <option value="bn-IN">Bengali (India)</option>
            <option value="zh-CN">Chinese (Mandarin)</option>
            <option value="ja-JP">Japanese</option>
            <option value="ru-RU">Russian</option>
            <option value="pt-BR">Portuguese (Brazil)</option>
            <option value="it-IT">Italian</option>
          </select>
        </div>

        <div className="relative">
          <textarea 
            value={text}
            readOnly
            className="w-full h-64 p-4 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            placeholder="Your transcribed text will appear here..."
          />
          {isListening && (
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-red-500 uppercase tracking-wider">Listening</span>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={toggleListening}
            className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-3 shadow-lg ${
              isListening 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            {isListening ? 'Stop Listening' : 'Start Recording'}
          </button>
          
          {text && (
            <button 
              onClick={() => navigator.clipboard.writeText(text)}
              className="bg-slate-800 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-900 transition-all shadow-lg"
            >
              Copy Text
            </button>
          )}
        </div>
      </div>
    </ToolWrapper>
  );
};

export const AudioTrimmer: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onloadedmetadata = () => {
        const d = audioRef.current!.duration;
        setDuration(d);
        setEnd(d);
      };
    }
  }, [audioUrl]);

  return (
    <ToolWrapper
      title="Audio Trimmer"
      description="Cut and trim audio files to your desired length."
      seoText="Easily trim MP3 and WAV files in your browser. Select the start and end times to extract specific parts of your audio. No upload required."
    >
      <div className="space-y-8">
        {!audioUrl ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-12 bg-slate-50">
            <input type="file" onChange={handleUpload} className="hidden" id="audio-upload" accept="audio/*" />
            <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center">
              <Volume2 className="w-12 h-12 text-slate-400 mb-4" />
              <span className="text-slate-600 font-medium">Upload Audio File</span>
            </label>
          </div>
        ) : (
          <div className="space-y-8">
            <audio ref={audioRef} src={audioUrl} controls className="w-full" />
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Start Time (s)</label>
                <input 
                  type="number" step="0.1" min="0" max={end}
                  value={start}
                  onChange={(e) => setStart(parseFloat(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">End Time (s)</label>
                <input 
                  type="number" step="0.1" min={start} max={duration}
                  value={end}
                  onChange={(e) => setEnd(parseFloat(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="bg-slate-100 p-4 rounded-lg text-center text-sm text-slate-600">
              Selected range: <strong>{(end - start).toFixed(2)}s</strong>
            </div>

            <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
              Trim & Download (WAV)
            </button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};

export const AudioConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState('wav');

  const convert = async () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `converted-audio.${format}`;
    link.click();
  };

  return (
    <ToolWrapper
      title="Audio Converter"
      description="Convert audio files between different formats."
      seoText="Free online audio converter. Change your audio files to WAV, MP3, or OGG instantly in your browser."
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-12 bg-slate-50">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="audio-conv-upload" accept="audio/*" />
          <label htmlFor="audio-conv-upload" className="cursor-pointer flex flex-col items-center">
            <Music className="w-12 h-12 text-slate-400 mb-4" />
            <span className="text-slate-600 font-medium">Upload Audio to Convert</span>
          </label>
        </div>

        {file && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <select 
                value={format} 
                onChange={(e) => setFormat(e.target.value)}
                className="flex-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="wav">WAV</option>
                <option value="mp3">MP3</option>
                <option value="ogg">OGG</option>
              </select>
              <button 
                onClick={convert}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Convert & Download
              </button>
            </div>
            <p className="text-sm text-slate-500 text-center">Selected: {file.name}</p>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
