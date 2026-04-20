import { useState, useRef, useEffect } from 'react';
import { Camera, Loader, Eye, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const VisionScanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  // --- 1. Start the Webcam ---
  useEffect(() => {
    let currentStream = null;
    const startCamera = async () => {
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) videoRef.current.srcObject = currentStream;
      } catch (err) {
        setError("Please allow camera access to use the Vision Scanner.");
      }
    };
    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // --- 2. Capture & Analyze ---
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsAnalyzing(true);
    setResult('');
    setError('');
    window.speechSynthesis.cancel();
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      const MAX_WIDTH = 500;
      const scale = MAX_WIDTH / video.videoWidth;
      canvas.width = MAX_WIDTH;
      canvas.height = video.videoHeight * scale;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const base64Image = canvas.toDataURL('image/jpeg', 0.5);

      const response = await fetch('http://localhost:8000/api/ai/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: base64Image })
      });
      
      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || "Server rejected the request.");
      
      const cleanText = data.analysis;
      setResult(cleanText);
      
      const audioCleanText = cleanText.replace(/[*#_`$→]/g, '').replace(/\\rightarrow/g, '');
      const spokenText = `I see ${audioCleanText}.`;
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(spokenText));

    } catch (err) {
      console.error("Vision error:", err);
      setError(err.message || "Failed to connect to the AI servers.");
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(err.message));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center p-6 bg-black overflow-hidden font-sans">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl mx-auto gap-8 mt-4">
        
        {/* Header Section */}
        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center p-5 bg-gray-950 rounded-2xl border border-gray-800 shadow-inner mb-6 relative group">
            {/* Pulsing ring behind the icon */}
            <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur-xl group-hover:bg-cyan-400/40 transition-all duration-500"></div>
            <Eye className="relative w-14 h-14 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black flex items-center justify-center gap-3 mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-500 drop-shadow-[0_0_15px_rgba(192,132,252,0.4)]">
            Vision Scanner
          </h1>
          <p className="text-cyan-200/50 font-bold tracking-[0.2em] uppercase text-xs">
            Powered by Hugging Face AI
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="w-full bg-red-950/50 backdrop-blur-md text-red-200 p-5 rounded-2xl flex items-center gap-4 border-2 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            <AlertCircle className="w-8 h-8 flex-shrink-0 drop-shadow-[0_0_10px_rgba(239,68,68,1)] text-red-400" />
            <p className="font-semibold tracking-wide">{error}</p>
          </div>
        )}

        {/* Camera Viewfinder */}
        <div 
          className={`w-full relative rounded-3xl overflow-hidden border-2 bg-gray-950 aspect-video transition-all duration-700 ${
            error 
              ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]' 
              : isAnalyzing 
                ? 'border-cyan-400 shadow-[0_0_60px_rgba(34,211,238,0.5)] scale-[1.02]'
                : 'border-fuchsia-500/50 hover:border-fuchsia-400 hover:shadow-[0_0_40px_rgba(217,70,239,0.3)]'
          }`}
        >
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-80 mix-blend-screen" />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Cyberpunk Scanning Reticle Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 border-4 border-cyan-400/30 m-4 rounded-2xl pointer-events-none flex items-center justify-center">
               <div className="w-full h-1 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)] absolute animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          )}
        </div>

        {/* Neon Action Button */}
        <button
          onClick={captureAndAnalyze}
          disabled={isAnalyzing}
          className={`w-full py-6 rounded-2xl font-black text-2xl uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
            ${isAnalyzing 
              ? 'bg-transparent text-cyan-400 border-2 border-cyan-400 shadow-[inset_0_0_20px_rgba(34,211,238,0.4)]' 
              : 'bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-white border-none hover:from-fuchsia-500 hover:to-cyan-500 shadow-[0_0_40px_rgba(217,70,239,0.5)] hover:shadow-[0_0_60px_rgba(34,211,238,0.6)]'
            }`}
        >
          {isAnalyzing ? (
            <><Loader className="w-8 h-8 animate-spin" /> Processing Data...</>
          ) : (
            <><Camera className="w-8 h-8" /> Initialize Scan</>
          )}
        </button>

        {/* Formatted Markdown Output Box */}
        {result && (
          <div className="w-full bg-gray-950/80 backdrop-blur-xl p-8 rounded-3xl border border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.15)] animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="prose prose-invert prose-lg md:prose-xl max-w-none prose-p:leading-relaxed prose-p:text-gray-300 prose-headings:text-cyan-400 prose-strong:text-fuchsia-400 prose-li:marker:text-cyan-500">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {result}
              </ReactMarkdown>
            </div>
          </div>
        )}
        
      </div>
      
      {/* Keyframes for the scanning laser */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default VisionScanner;