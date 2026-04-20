import { Link } from 'react-router-dom';
import { Activity, Volume2, BookOpen, Eye, Mic, Sparkles, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const tools = [
    {
      name: "Accessible Voice",
      description: "Massive, high-contrast voice interface powered by AI. Converse, ask questions, and navigate hands-free.",
      icon: <Mic className="w-12 h-12 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]" />,
      path: "/accessible-voice",
      accent: "group-hover:border-blue-400 group-hover:shadow-[0_0_40px_rgba(96,165,250,0.4)]",
      buttonColor: "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-black"
    },
    {
      name: "Vision Scanner",
      description: "Cloud-powered scene describer. Point your camera at anything to hear a highly accurate description of your surroundings.",
      icon: <Eye className="w-12 h-12 text-rose-400 drop-shadow-[0_0_15px_rgba(251,113,133,0.8)]" />,
      path: "/vision",
      accent: "group-hover:border-rose-400 group-hover:shadow-[0_0_40px_rgba(251,113,133,0.4)]",
      buttonColor: "bg-rose-500/10 text-rose-400 group-hover:bg-rose-500 group-hover:text-white"
    },
    {
      name: "Health Hub",
      description: "Voice-activated medical assistant. Ask health questions and get clearly spoken, perfectly formatted answers.",
      icon: <Activity className="w-12 h-12 text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.8)]" />,
      path: "/health",
      accent: "group-hover:border-green-400 group-hover:shadow-[0_0_40px_rgba(74,222,128,0.4)]",
      buttonColor: "bg-green-500/10 text-green-400 group-hover:bg-green-500 group-hover:text-black"
    },
    {
      name: "Audio-Bookify",
      description: "Instantly convert PDFs, Word docs, and web articles into spoken, continuous podcast-style audio summaries.",
      icon: <Volume2 className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />,
      path: "/audiobook",
      accent: "group-hover:border-cyan-400 group-hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]",
      buttonColor: "bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black"
    },
    {
      name: "Dyslexia Reader",
      description: "Bionic reading converter. Instantly format text with artificial fixation points for faster, easier reading.",
      icon: <BookOpen className="w-12 h-12 text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.8)]" />,
      path: "/dyslexia",
      accent: "group-hover:border-purple-400 group-hover:shadow-[0_0_40px_rgba(192,132,252,0.4)]",
      buttonColor: "bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white"
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-8 bg-black relative overflow-x-hidden pt-16">
      
      {/* Background Neon Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Hero Section */}
      <div className="text-center z-10 mb-20 max-w-4xl px-4">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gray-900 border border-gray-800 mb-8 shadow-lg shadow-cyan-500/10">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold tracking-widest text-gray-300 uppercase">AI-Powered Accessibility</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight leading-tight">
          Navigate the world <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            without limits.
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-2xl mx-auto font-medium">
          A unified suite of intelligent tools designed to break down visual, auditory, and cognitive barriers.
        </p>
      </div>

      {/* The Neon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl z-10 pb-16">
        {tools.map((tool, index) => (
          <Link 
            key={index} 
            to={tool.path}
            // If it's the 5th item (Dyslexia), we center it on the bottom row for large screens
            className={`group relative flex flex-col bg-gray-900/80 backdrop-blur-sm p-8 rounded-3xl border-2 border-gray-800 transition-all duration-500 transform hover:-translate-y-2 ${tool.accent} ${index === 4 ? 'lg:col-start-2' : ''}`}
          >
            {/* Icon Box */}
            <div className="mb-8 flex items-start justify-between">
              <div className="p-5 bg-black rounded-2xl border border-gray-800 shadow-inner group-hover:border-gray-700 transition-colors">
                {tool.icon}
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4 tracking-wide">{tool.name}</h2>
            <p className="text-gray-400 flex-1 leading-relaxed text-lg mb-10">{tool.description}</p>
            
            {/* Launch Button */}
            <div className={`mt-auto flex items-center justify-between px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${tool.buttonColor}`}>
              Launch Tool
              <ArrowRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;