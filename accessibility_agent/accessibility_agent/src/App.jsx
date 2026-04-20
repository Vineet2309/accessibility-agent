import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Mic, Eye, Activity, Volume2, BookOpen } from 'lucide-react';
import LandingPage from './components/LandingPage';
import VisionScanner from './components/VisionScanner';
import HealthHub from './components/HealthHub';
import AccessibleVoiceCommand from './components/AccessibleVoiceCommand';
import AudioBookify from './components/AudioBookify';
import DyslexiaReader from './components/DyslexiaReader';

// Placeholder Components
//const VoiceAssistant = () => <div className="p-8 text-2xl font-bold">Voice & Content Agent Active</div>;
//const VisionScanner = () => <div className="p-8 text-2xl font-bold">Vision Pipeline Active</div>;
//const HealthHub = () => <div className="p-8 text-2xl font-bold">Health Assistant Active</div>;

function App() {
 return (
    <Router>
      <div className="min-h-screen flex flex-col md:flex-row bg-black font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        
        {/* Sidebar Navigation - Glassmorphism & Neon Hover States */}
        <nav className="bg-gray-950/80 backdrop-blur-2xl w-full md:w-80 p-6 flex flex-col gap-4 border-b md:border-r border-gray-800 z-50 relative shadow-[4px_0_24px_rgba(0,0,0,0.8)] shrink-0">
          
          {/* Subtle sidebar ambient glow */}
          <div className="absolute top-0 left-0 w-full h-32 bg-cyan-600/5 blur-[80px] pointer-events-none"></div>

          {/* App Brand / Logo */}
          <Link 
            to="/" 
            className="text-3xl font-black mb-8 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-rose-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.3)] hover:opacity-80 transition-opacity"
          >
            AccessAgent.
          </Link>

          {/* Navigation Links */}
          <div className="flex flex-col gap-3">
            
            {/* Accessible Voice - Neon Blue */}
            <Link 
              to="/accessible-voice" 
              className="group flex items-center gap-4 p-4 bg-gray-900/40 rounded-2xl border border-transparent hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 focus:ring-4 focus:ring-blue-500/30 outline-none hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
            >
              <div className="p-2 bg-black rounded-xl border border-gray-800 group-hover:border-blue-500/50 transition-colors shadow-inner">
                <Mic className="w-6 h-6 text-gray-500 group-hover:text-blue-400 transition-colors drop-shadow-[0_0_0px_rgba(59,130,246,0)] group-hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              </div>
              <span className="text-lg font-bold text-gray-400 group-hover:text-blue-300 transition-colors tracking-wide">Accessible Voice</span>
            </Link>

            {/* Vision Scanner - Neon Rose */}
            <Link 
              to="/vision" 
              className="group flex items-center gap-4 p-4 bg-gray-900/40 rounded-2xl border border-transparent hover:border-rose-500/50 hover:bg-rose-500/10 transition-all duration-300 focus:ring-4 focus:ring-rose-500/30 outline-none hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]"
            >
              <div className="p-2 bg-black rounded-xl border border-gray-800 group-hover:border-rose-500/50 transition-colors shadow-inner">
                <Eye className="w-6 h-6 text-gray-500 group-hover:text-rose-400 transition-colors drop-shadow-[0_0_0px_rgba(244,63,94,0)] group-hover:drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
              </div>
              <span className="text-lg font-bold text-gray-400 group-hover:text-rose-300 transition-colors tracking-wide">Vision Scanner</span>
            </Link>

            {/* Health Hub - Neon Green */}
            <Link 
              to="/health" 
              className="group flex items-center gap-4 p-4 bg-gray-900/40 rounded-2xl border border-transparent hover:border-green-500/50 hover:bg-green-500/10 transition-all duration-300 focus:ring-4 focus:ring-green-500/30 outline-none hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]"
            >
              <div className="p-2 bg-black rounded-xl border border-gray-800 group-hover:border-green-500/50 transition-colors shadow-inner">
                <Activity className="w-6 h-6 text-gray-500 group-hover:text-green-400 transition-colors drop-shadow-[0_0_0px_rgba(34,197,94,0)] group-hover:drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
              </div>
              <span className="text-lg font-bold text-gray-400 group-hover:text-green-300 transition-colors tracking-wide">Health Hub</span>
            </Link>
            
            {/* Audio-Bookify - Neon Cyan */}
            <Link 
              to="/audiobook" 
              className="group flex items-center gap-4 p-4 bg-gray-900/40 rounded-2xl border border-transparent hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300 focus:ring-4 focus:ring-cyan-500/30 outline-none hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
            >
              <div className="p-2 bg-black rounded-xl border border-gray-800 group-hover:border-cyan-500/50 transition-colors shadow-inner">
                <Volume2 className="w-6 h-6 text-gray-500 group-hover:text-cyan-400 transition-colors drop-shadow-[0_0_0px_rgba(6,182,212,0)] group-hover:drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              </div>
              <span className="text-lg font-bold text-gray-400 group-hover:text-cyan-300 transition-colors tracking-wide">Audio-Bookify</span>
            </Link>

            {/* Dyslexia Reader - Neon Purple */}
            <Link 
              to="/dyslexia" 
              className="group flex items-center gap-4 p-4 bg-gray-900/40 rounded-2xl border border-transparent hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 focus:ring-4 focus:ring-purple-500/30 outline-none hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
            >
              <div className="p-2 bg-black rounded-xl border border-gray-800 group-hover:border-purple-500/50 transition-colors shadow-inner">
                <BookOpen className="w-6 h-6 text-gray-500 group-hover:text-purple-400 transition-colors drop-shadow-[0_0_0px_rgba(168,85,247,0)] group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
              </div>
              <span className="text-lg font-bold text-gray-400 group-hover:text-purple-300 transition-colors tracking-wide">Dyslexia Reader</span>
            </Link>

          </div>
        </nav>

        {/* Main Content Area - Renders the selected glowing tool */}
        <main className="flex-1 bg-black flex flex-col overflow-x-hidden relative">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/accessible-voice" element={<AccessibleVoiceCommand />} />
            <Route path="/vision" element={<VisionScanner />} />
            <Route path="/health" element={<HealthHub />} />
            <Route path="/audiobook" element={<AudioBookify />} />
            <Route path="/dyslexia" element={<DyslexiaReader />} />
          </Routes>
        </main>
        
      </div>
    </Router>
  );
}

export default App;