import { useState } from 'react';
import { Play, Square, FileText, Loader, Volume2, UploadCloud, Trash2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Tell PDF.js where to find its background worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const AudioBookify = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);
  const [isReadingFile, setIsReadingFile] = useState(false);

  // Universal File Extraction Logic
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;

    setIsReadingFile(true);
    setInputText('');

    const fileExtension = file.name.split('.').pop().toLowerCase();

    try {
      if (file.type === 'application/pdf' || fileExtension === 'pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map(item => item.str).join(' ') + '\n\n';
        }
        setInputText(fullText);
      } 
      else if (fileExtension === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
        setInputText(result.value);
      } 
      else if (fileExtension === 'html' || fileExtension === 'htm') {
        const text = await file.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');
        setInputText(doc.body.textContent || "");
      } 
      else if (file.type.startsWith('text/') || ['txt', 'md', 'csv'].includes(fileExtension)) {
        const text = await file.text();
        setInputText(text);
      } 
      else {
        alert("Sorry, I can only read .pdf, .docx, .html, .md, and .txt files right now!");
      }
    } catch (error) {
      console.error("Error reading file:", error);
      alert("Failed to read the file. It might be corrupted or password-protected.");
    } finally {
      setIsReadingFile(false);
    }
  };

  // Core Audio Logic
  const handleConvert = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setSummary('');
    window.speechSynthesis.cancel();
    setIsPlaying(false);

    try {
      const response = await fetch('http://localhost:8000/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      });
      
      const data = await response.json();
      setSummary(data.summary);
      playAudio(data.summary);
      
    } catch (error) {
      console.error("Summarization Error:", error);
      setSummary("Error connecting to the AI server.");
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = (text) => {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, ''); 
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9; 
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  // Helper to calculate words
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center w-full p-6 md:p-10 bg-black overflow-hidden font-sans">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 text-center mb-10 mt-4">
        <div className="inline-flex items-center justify-center p-4 bg-gray-950 rounded-2xl border border-gray-800 shadow-inner mb-6 relative group">
          <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur-xl group-hover:bg-fuchsia-400/30 transition-all duration-500"></div>
          <Volume2 className="relative w-12 h-12 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-500 drop-shadow-[0_0_10px_rgba(192,132,252,0.3)]">
          Audio-Bookify
        </h1>
        <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">
          Type, paste, or drag & drop a document to generate a glowing audio summary.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row gap-8">
        
        {/* --- LEFT PANEL: CYAN INPUT SECTION --- */}
        <div className="flex-1 bg-gray-950/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-cyan-500/20 shadow-[0_0_40px_rgba(34,211,238,0.05)] flex flex-col relative group transition-all duration-500 hover:border-cyan-500/40 hover:shadow-[0_0_50px_rgba(34,211,238,0.1)]">
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <h2 className="font-bold text-cyan-100 uppercase tracking-widest text-sm drop-shadow-md">Editor & Dropzone</h2>
            </div>
            
            {/* Clear Button & Word Count */}
            {wordCount > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-cyan-500/60 tracking-wider">{wordCount} words</span>
                <button 
                  onClick={() => setInputText('')}
                  className="text-gray-500 hover:text-rose-400 transition-colors flex items-center gap-1 text-sm font-semibold hover:drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]"
                  title="Clear Text"
                >
                  <Trash2 className="w-4 h-4" /> Clear
                </button>
              </div>
            )}
          </div>
          
          {/* Dropzone Overlay */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={handleDrop}
            className={`flex-1 relative rounded-2xl border-2 transition-all duration-300 ${
              isDragging 
                ? 'border-cyan-400 bg-cyan-900/20 shadow-[inset_0_0_30px_rgba(34,211,238,0.3)] scale-[1.02]' 
                : 'border-gray-800 bg-black/50 hover:border-cyan-500/30 focus-within:border-cyan-500/50 focus-within:shadow-[inset_0_0_20px_rgba(34,211,238,0.1)]'
            }`}
          >
            {isDragging && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-cyan-400 z-10 pointer-events-none backdrop-blur-sm rounded-2xl">
                <UploadCloud className="w-20 h-20 animate-bounce mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                <p className="text-2xl font-black tracking-wide drop-shadow-lg">Drop file to read!</p>
              </div>
            )}
            
            {isReadingFile ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-cyan-400 z-10 bg-black/80 rounded-2xl backdrop-blur-sm">
                <Loader className="w-16 h-16 animate-spin mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                <p className="text-xl font-bold animate-pulse tracking-wide">Extracting text...</p>
              </div>
            ) : (
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Start typing here, paste an article, or drag & drop a file (.pdf, .docx, .txt, .html)..."
                className="w-full h-full min-h-[350px] bg-transparent text-gray-200 p-6 rounded-2xl focus:outline-none resize-none relative z-0 leading-relaxed text-lg placeholder-gray-700 custom-scrollbar"
              />
            )}
          </div>

          <button
            onClick={handleConvert}
            disabled={!inputText.trim() || isProcessing || isReadingFile}
            className={`mt-6 w-full py-5 rounded-2xl font-black text-xl uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
              ${isProcessing || isReadingFile
                ? 'bg-transparent text-cyan-400 border-2 border-cyan-400/50 shadow-[inset_0_0_20px_rgba(34,211,238,0.2)]'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] border border-cyan-400/50'
              }`}
          >
            {isProcessing ? (
              <><Loader className="w-6 h-6 animate-spin" /> Condensing Data...</>
            ) : (
              <><Play className="w-6 h-6 fill-current" /> Summarize & Play</>
            )}
          </button>
        </div>

        {/* --- RIGHT PANEL: FUCHSIA OUTPUT SECTION --- */}
        <div className="flex-1 bg-gray-950/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-fuchsia-500/20 shadow-[0_0_40px_rgba(217,70,239,0.05)] flex flex-col transition-all duration-500 hover:border-fuchsia-500/40 hover:shadow-[0_0_50px_rgba(217,70,239,0.1)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-fuchsia-400 uppercase tracking-widest text-sm drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]">
              Podcast Script
            </h2>
            {summary && (
              <button 
                onClick={isPlaying ? stopAudio : () => playAudio(summary)}
                className={`p-3 rounded-full transition-all duration-300 shadow-lg ${
                  isPlaying 
                    ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 ring-2 ring-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse' 
                    : 'bg-fuchsia-500/20 text-fuchsia-400 hover:bg-fuchsia-500/30 ring-1 ring-fuchsia-500/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.4)]'
                }`}
                title={isPlaying ? "Stop Audio" : "Play Audio"}
              >
                {isPlaying ? <Square className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current pl-0.5" />}
              </button>
            )}
          </div>
          
          <div className="flex-1 bg-black/50 p-8 rounded-2xl border border-gray-800 overflow-y-auto min-h-[350px] shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] custom-scrollbar relative">
            {summary ? (
              <p className="text-xl md:text-2xl leading-relaxed text-gray-200 whitespace-pre-wrap font-medium animate-in fade-in duration-700">
                {summary}
              </p>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700 italic text-center px-8 gap-6">
                <div className="p-6 rounded-full bg-gray-900 border border-gray-800">
                  <Volume2 className="w-16 h-16 text-gray-600" />
                </div>
                <p className="text-lg max-w-xs font-medium">Your AI-generated summary will appear here and automatically begin playing.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AudioBookify;