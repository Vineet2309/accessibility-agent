import { useState, useRef, useEffect } from 'react';
import { Activity, MessageSquare, Pill, Clock, Send, Plus, Mic, MicOff, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const HealthHub = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI Health Assistant. You can type your question below or click the microphone to speak to me.' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // --- Voice State & Refs ---
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // --- Initialize Speech Recognition ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setInputText(currentTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // --- Voice Controls ---
  const toggleListening = (e) => {
    e.preventDefault();
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInputText('');
      recognitionRef.current?.start();
      setIsListening(true);
      window.speechSynthesis.cancel(); // Stop AI if it's currently talking
    }
  };

  const speakAloud = (text) => {
    window.speechSynthesis.cancel();
    // Strip markdown symbols (*, #, _, etc) so the robot sounds natural
    const cleanText = text.replace(/[*#_`]/g, ''); 
    const utterance = new SpeechSynthesisUtterance(cleanText);
    window.speechSynthesis.speak(utterance);
  };

  // --- Send Message to Python AI ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // 1. Stop listening if mic is on
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userText = inputText;
    setInputText('');
    setIsLoading(true);

    // 2. Add User Message to Chat
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);

    try {
      // 3. Hit the Python FastAPI backend directly
      const response = await fetch('http://localhost:8000/api/ai/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      
      const data = await response.json();

      // 4. Update the UI with AI response
      setMessages((prev) => [...prev, { role: 'ai', text: data.reply }]);

      // 5. Speak the answer out loud!
      speakAloud(data.reply);

    } catch (error) {
      console.error("AI Error:", error);
      const errorMsg = "Sorry, I am having trouble connecting to the AI brain. Please make sure the Python server is running.";
      setMessages((prev) => [...prev, { role: 'ai', text: errorMsg }]);
      speakAloud(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-black text-gray-100 overflow-hidden relative font-sans">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Sidebar (Optional Context) */}
      <div className="w-64 bg-gray-950/80 backdrop-blur-xl border-r border-cyan-500/20 p-4 hidden md:flex flex-col gap-4 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
        <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 p-3 rounded-xl transition-all font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] border border-cyan-400/50">
          <Plus className="w-5 h-5" /> New Session
        </button>
        <div className="flex flex-col gap-2 mt-4 text-gray-400">
          <p className="text-xs font-bold text-cyan-500/70 uppercase tracking-[0.2em] mb-2 px-2">System Capabilities</p>
          <div className="flex items-center gap-3 p-3 hover:bg-cyan-950/50 rounded-xl cursor-default transition-colors border border-transparent hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <Activity className="w-5 h-5 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]" /> Symptom Checker
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-cyan-950/50 rounded-xl cursor-default transition-colors border border-transparent hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <Pill className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" /> Medication Info
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-cyan-950/50 rounded-xl cursor-default transition-colors border border-transparent hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <MessageSquare className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" /> Voice Accessible
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative z-10">
        
        {/* Header */}
        <header className="p-6 border-b border-cyan-500/20 bg-black/40 backdrop-blur-md flex justify-between items-center shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] tracking-tight">
              Health Hub
            </h1>
            <p className="text-cyan-200/50 text-xs font-bold tracking-[0.2em] uppercase mt-1">AI Medical Assistant</p>
          </div>
        </header>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6 custom-scrollbar">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`p-5 rounded-3xl max-w-[90%] md:max-w-[80%] text-lg shadow-2xl transition-all ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white self-end rounded-br-none shadow-[0_0_25px_rgba(34,211,238,0.3)] border border-cyan-400/50' 
                  : 'bg-gray-900/80 backdrop-blur-md text-gray-200 self-start rounded-bl-none border border-fuchsia-500/30 shadow-[0_0_30px_rgba(217,70,239,0.15)]'
              }`}
            >
              {/* Markdown for AI, Plain text for User */}
              {msg.role === 'ai' ? (
                <div className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-headings:text-cyan-400 prose-strong:text-cyan-300 prose-a:text-fuchsia-400 prose-li:marker:text-fuchsia-500">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ) : (
                <span className="whitespace-pre-wrap font-medium">{msg.text}</span>
              )}
            </div>
          ))}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="p-5 rounded-3xl max-w-[85%] bg-gray-900/80 backdrop-blur-md text-cyan-400 self-start rounded-bl-none border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] flex items-center gap-4">
              <Loader className="w-6 h-6 animate-spin drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <span className="animate-pulse font-semibold tracking-wide">Processing query...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-4 md:p-6 bg-gray-950/80 backdrop-blur-xl border-t border-cyan-500/20 flex gap-3 md:gap-4 items-center">
          
          {/* Voice Dictation Button */}
          <button
            onClick={toggleListening}
            type="button"
            className={`p-4 rounded-2xl transition-all duration-300 focus:outline-none flex items-center justify-center min-w-[64px] border-2 ${
              isListening 
                ? 'bg-fuchsia-600 border-fuchsia-400 text-white animate-pulse shadow-[0_0_30px_rgba(217,70,239,0.6)] scale-105' 
                : 'bg-black border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]'
            }`}
            aria-label={isListening ? "Stop listening" : "Start voice dictation"}
          >
            {isListening ? <MicOff className="w-7 h-7 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" /> : <Mic className="w-7 h-7" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? "Listening... Speak now." : "Type or dictate a health query..."}
            disabled={isLoading}
            className="flex-1 bg-black text-white text-lg md:text-xl p-4 rounded-2xl border-2 border-gray-800 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 placeholder-gray-600 disabled:opacity-50 transition-all shadow-inner"
          />
          
          <button 
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 p-4 rounded-2xl transition-all focus:ring-4 focus:ring-cyan-500/40 outline-none flex items-center justify-center disabled:opacity-50 min-w-[64px] border border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] active:scale-95"
            aria-label="Send message"
          >
            <Send className="w-7 h-7 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default HealthHub;