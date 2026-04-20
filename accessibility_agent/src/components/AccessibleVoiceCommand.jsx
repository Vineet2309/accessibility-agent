import { useState, useEffect, useRef } from 'react';
import { Mic, Radio } from 'lucide-react';

const AccessibleVoiceCommand = () => {
  const [status, setStatus] = useState('Press the spacebar or click anywhere to start.');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // --- 1. Text-to-Speech (Audio Feedback) ---
  const speak = (text) => {
    window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
    setStatus(text);
  };

  // --- 2. Initialize Speech Recognition ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setStatus("Your browser does not support voice commands. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; 
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      speak("Listening...");
    };

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase().trim();
      processCommand(command);
    };

    recognition.onerror = (event) => {
      if (event.error !== 'aborted') {
        speak("I didn't quite catch that. Please try again.");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  // --- 3. Keyboard Shortcut (Spacebar to talk) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isListening) {
        e.preventDefault();
        startListening();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListening]);

  // --- 4. Command Logic ---
  const processCommand = async (command) => {
    console.log("Heard:", command);

    if (command.includes('time')) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return speak(`The current time is ${time}.`);
    } else if (command.includes('exit') || command.includes('stop')) {
      return speak("Voice commands deactivated.");
    }

    speak("Let me think about that..."); 
    
    try {
      const response = await fetch('http://localhost:8000/api/ai/voiceCommand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: command })
      });
      
      const data = await response.json();
      const cleanText = data.reply.replace(/[*#]/g, '');
      speak(cleanText);
      
    } catch (error) {
      console.error("AI Connection Error:", error);
      speak("Sorry, I am having trouble connecting to my servers right now. Please check your connection.");
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Microphone already active");
      }
    }
  };

  return (
    <button 
      onClick={startListening}
      className="group relative w-full min-h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden flex flex-col items-center justify-center bg-black focus:outline-none focus:ring-8 focus:ring-fuchsia-500 transition-all duration-700 cursor-pointer font-sans"
      aria-label="Activate voice commands. Press spacebar or click anywhere."
    >
      {/* Dynamic Ambient Background Glows (Dual Tone) */}
      <div 
        className={`fixed top-0 left-0 rounded-full blur-[150px] pointer-events-none transition-all duration-1000 ease-in-out
          ${isListening ? 'w-[800px] h-[800px] bg-cyan-600/30 translate-x-[-10%] translate-y-[-10%]' : 'w-[500px] h-[500px] bg-cyan-900/20'}`}
      ></div>
      <div 
        className={`fixed bottom-0 right-0 rounded-full blur-[150px] pointer-events-none transition-all duration-1000 ease-in-out
          ${isListening ? 'w-[800px] h-[800px] bg-fuchsia-600/30 translate-x-[10%] translate-y-[10%]' : 'w-[500px] h-[500px] bg-purple-900/20'}`}
      ></div>

      {/* Main Content Container */}
      <div className="z-10 flex flex-col items-center w-full px-4 md:px-8 max-w-4xl py-20">
        
        {/* Glowing Microphone Reticle */}
        <div className="relative flex items-center justify-center mb-16">
          {/* Radar Ping Animations (Only active when listening) */}
          {isListening && (
            <>
              <div className="absolute w-48 h-48 bg-cyan-500/20 rounded-full animate-ping"></div>
              <div className="absolute w-72 h-72 border-2 border-fuchsia-400/30 rounded-full animate-pulse"></div>
              <div className="absolute w-96 h-96 border border-cyan-500/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}

          {/* Central Mic Button */}
          <div className={`relative z-10 p-10 rounded-full border-4 transition-all duration-500 
            ${isListening 
              ? 'bg-cyan-950 border-cyan-400 shadow-[0_0_80px_rgba(34,211,238,0.6)] scale-110' 
              : 'bg-gray-950 border-gray-800 group-hover:border-fuchsia-500 group-hover:shadow-[0_0_50px_rgba(217,70,239,0.4)]'}`}
          >
            {isListening ? (
              <Radio className="w-24 h-24 text-cyan-400 animate-pulse drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
            ) : (
              <Mic className="w-24 h-24 text-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.6)] group-hover:text-fuchsia-400 transition-colors" />
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.3)]">
          {isListening ? "Awaiting Command..." : "Accessible Voice"}
        </h1>
        
        {/* Status Text inside a Frosted Glass Panel */}
        <div className="w-full bg-gray-950/60 backdrop-blur-xl border border-fuchsia-500/20 shadow-[0_0_40px_rgba(217,70,239,0.1)] rounded-3xl p-8 md:p-10 transition-all duration-500 min-h-[150px] flex items-center justify-center">
          <p 
            className="text-xl md:text-3xl text-gray-200 font-medium leading-relaxed text-center"
            aria-live="polite"
          >
            {status}
          </p>
        </div>

      </div>

      {/* Bottom Action Hint */}
      <div className="bottom-8 left-0 w-full text-center opacity-80 z-20 pointer-events-none">
        <p className="text-cyan-200/70 font-bold tracking-[0.2em] uppercase text-sm flex items-center justify-center gap-3">
          <span className={`w-3 h-3 rounded-full ${isListening ? 'bg-fuchsia-400 animate-pulse shadow-[0_0_15px_rgba(217,70,239,1)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]'}`}></span>
          Press Spacebar or Click Anywhere
        </p>
      </div>
    </button>
  );
};

export default AccessibleVoiceCommand;