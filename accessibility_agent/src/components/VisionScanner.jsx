import React, { useEffect, useRef, useState } from 'react';
import { Camera, Eye, Power, Activity, BrainCircuit, Play, Pause, Square } from 'lucide-react';

export default function VisionScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedFaces, setDetectedFaces] = useState(0);
  const [trackingBox, setTrackingBox] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("Offline");
  
  // AI Description States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sceneDescription, setSceneDescription] = useState("Awaiting deep scan trigger...");

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // 1. Toggle Real-Time Stream ON / OFF
  const toggleStream = async () => {
    if (isStreaming) {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (wsRef.current) wsRef.current.close();
      
      setIsStreaming(false);
      setTrackingBox([]);
      setDetectedFaces(0);
      setConnectionStatus("Offline");
      setSceneDescription("Awaiting deep scan trigger...");
      return;
    }

    try {
      setConnectionStatus("Connecting...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      
      if (videoRef.current) videoRef.current.srcObject = stream;

      // UPDATE 1: Connect to live Render WebSocket route using wss://
      wsRef.current = new WebSocket("wss://accessibility-agent-146x.onrender.com/ws/vision");

      wsRef.current.onopen = () => {
        setConnectionStatus("Live");
        setIsStreaming(true);
      };

      wsRef.current.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.status === "success") {
          setDetectedFaces(response.facesDetected);
          setTrackingBox(response.coordinates);
        }
      };

      wsRef.current.onerror = () => setConnectionStatus("Error: Backend Unreachable");
      wsRef.current.onclose = () => setConnectionStatus("Offline");

    } catch (err) {
      console.error("Camera access denied:", err);
      setConnectionStatus("Camera Error");
    }
  };

  // --- AUDIO CONTROLS ---
  const toggleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
      }
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  // 2. Deep AI Scene Analysis
  const triggerDeepScan = async () => {
    if (!canvasRef.current || !isStreaming) return;
    
    setIsAnalyzing(true);
    setSceneDescription("Transmitting frame to neural network... Processing scene...");
    
    try {
      const ctx = canvasRef.current.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, 640, 480);
      const base64Frame = canvasRef.current.toDataURL('image/jpeg', 0.9);
      
      // UPDATE 2: Connect to live Render API route using https://
      const response = await fetch("https://accessibility-agent-146x.onrender.com/api/ai/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          image_base64: base64Frame,
          prompt: "Describe this image in detail."
        })
      });
      
      const data = await response.json();
      const finalAnalysis = data.analysis || "No readable data found in environment.";
      
      // Update the UI text
      setSceneDescription(finalAnalysis);

      // SANITIZE THE TEXT FOR THE AUDIO ENGINE
      const cleanTextForSpeech = finalAnalysis
        .replace(/[#_*~`]/g, '') 
        .replace(/-/g, '')       
        .replace(/\n+/g, '. ')   
        .trim();

      // SPEAK THE CLEANED TEXT
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop anything currently playing
        
        const utterance = new SpeechSynthesisUtterance(cleanTextForSpeech);
        utterance.rate = 1.05; 
        utterance.pitch = 1.0;

        utterance.onstart = () => { setIsSpeaking(true); setIsPaused(false); };
        utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); };
        utterance.onpause = () => setIsPaused(true);
        utterance.onresume = () => setIsPaused(false);
        utterance.onerror = () => { setIsSpeaking(false); setIsPaused(false); };
        
        window.speechSynthesis.speak(utterance);
      }

    } catch (error) {
      setSceneDescription("System Error: Failed to connect to AI logic core.");
      
      if ('speechSynthesis' in window) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("System Error. Failed to connect."));
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 3. The Transmission Loop (FAST Loop for OpenCV)
  useEffect(() => {
    let intervalId;
    if (isStreaming && wsRef.current) {
      intervalId = setInterval(() => {
        if (videoRef.current && canvasRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          const ctx = canvasRef.current.getContext('2d');
          ctx.drawImage(videoRef.current, 0, 0, 640, 480);
          const base64Frame = canvasRef.current.toDataURL('image/jpeg', 0.5); 
          wsRef.current.send(base64Frame);
        }
      }, 1000); 
    }
    return () => clearInterval(intervalId);
  }, [isStreaming]);

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center font-sans">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
          AI Vision Sentinel
        </h1>
        <p className="text-gray-400 mt-2">Dual-Engine Tracking & Cognitive Analysis</p>
      </header>

      {/* Control Panel */}
      <div className="flex gap-4 mb-6 w-full max-w-3xl justify-between items-center bg-gray-900/60 p-4 rounded-xl border border-gray-800">
        <div className="flex gap-3">
          <button 
            onClick={toggleStream}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              isStreaming 
                ? "bg-red-500/20 text-red-400 border border-red-500/50" 
                : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            }`}
          >
            <Power className="w-4 h-4" />
            {isStreaming ? "Terminate" : "Initialize"}
          </button>

          <button 
            onClick={triggerDeepScan}
            disabled={!isStreaming || isAnalyzing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              !isStreaming || isAnalyzing
                ? "bg-gray-800 text-gray-600 border border-gray-700 cursor-not-allowed" 
                : "bg-purple-500/20 text-purple-400 border border-purple-500/50 hover:bg-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            }`}
          >
            <BrainCircuit className={`w-4 h-4 ${isAnalyzing ? "animate-pulse" : ""}`} />
            {isAnalyzing ? "Analyzing..." : "Deep Scan"}
          </button>
        </div>

        <div className="flex gap-6">
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1">
              <Activity className="w-3 h-3" /> System Link
            </span>
            <span className={`text-sm font-bold ${isStreaming ? 'text-green-400' : 'text-gray-400'}`}>
              {connectionStatus}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1">
              <Eye className="w-3 h-3" /> Targets
            </span>
            <span className="text-sm font-bold text-cyan-400">
              {detectedFaces} Lock(s)
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        {/* Video Sandbox Viewfinder */}
        <div className="relative border-4 border-gray-900 rounded-3xl overflow-hidden shadow-2xl bg-gray-950 w-full md:w-2/3 aspect-video flex items-center justify-center flex-shrink-0">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
          <canvas ref={canvasRef} width="640" height="480" className="hidden" />

          {/* Real-time bounding tracking box */}
          {trackingBox.map((box, index) => (
            <div 
              key={index}
              className="absolute border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] pointer-events-none rounded-sm transition-all duration-75"
              style={{
                left: `${(1 - (box.x + box.width) / 640) * 100}%`,
                top: `${(box.y / 480) * 100}%`,
                width: `${(box.width / 640) * 100}%`,
                height: `${(box.height / 480) * 100}%`
              }}
            >
              <div className="absolute -top-6 left-0 bg-cyan-900/80 text-cyan-300 text-[11px] font-bold uppercase px-2 py-0.5 border border-cyan-500/50 backdrop-blur-sm whitespace-nowrap">
                {box.label ? box.label : `Target: ${index + 1}`}
              </div>
            </div>
          ))}

          {!isStreaming && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center backdrop-blur-md">
              <Camera className="w-12 h-12 text-gray-700 mb-4" />
              <p className="text-lg font-bold tracking-wider text-gray-500">OPTICS OFFLINE</p>
            </div>
          )}
        </div>

        {/* AI Output Readout Panel */}
        <div className="flex-1 bg-gray-900/40 border border-gray-800 rounded-2xl p-5 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500"></div>
          
          {/* HEADER WITH AUDIO CONTROLS */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-purple-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" /> Cognitive Output
            </h3>
            
            {/* ONLY SHOW BUTTONS IF AUDIO IS ACTIVE OR PAUSED */}
            {(isSpeaking || isPaused) && (
              <div className="flex gap-2">
                <button 
                  onClick={toggleSpeech}
                  className="p-1.5 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/40 transition-colors"
                  title={isPaused ? "Resume Speech" : "Pause Speech"}
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <button 
                  onClick={stopSpeech}
                  className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40 transition-colors"
                  title="Stop Speech"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-full text-purple-400/70">
                <BrainCircuit className="w-10 h-10 animate-bounce mb-3" />
                <p>Decoding visual data...</p>
              </div>
            ) : (
              <p>{sceneDescription}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}