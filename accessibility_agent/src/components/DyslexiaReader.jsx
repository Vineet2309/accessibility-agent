import { useState } from 'react';
import { BookOpen, Type, AlignJustify, MoveHorizontal, Trash2 } from 'lucide-react';

const DyslexiaReader = () => {
  const [inputText, setInputText] = useState('');
  
  // Customization settings for dyslexic readers
  const [fontSize, setFontSize] = useState(24);
  const [lineHeight, setLineHeight] = useState(2);
  const [letterSpacing, setLetterSpacing] = useState(1);

  // The Magic Algorithm: Converts standard text to Bionic Reading
  const renderBionicText = (text) => {
    if (!text) return null;

    // This regex perfectly splits the text into an array of words and punctuation/spaces
    const parts = text.split(/([A-Za-zÀ-ÿ0-9]+)/);

    return parts.map((part, index) => {
      // Even indexes are spaces/punctuation, Odd indexes are actual words
      if (index % 2 === 0) {
        return <span key={index}>{part}</span>;
      } else {
        // Find the halfway point of the word (rounding up)
        const mid = Math.ceil(part.length / 2);
        const firstHalf = part.slice(0, mid);
        const secondHalf = part.slice(mid);

        return (
          <span key={index}>
            <b className="font-black text-white tracking-normal">{firstHalf}</b>
            <span className="font-normal text-gray-400 tracking-normal">{secondHalf}</span>
          </span>
        );
      }
    });
  };

  const sampleText = "Bionic reading is a new method facilitating the reading process by guiding the eyes through text with artificial fixation points. As a result, the reader is only focusing on the highlighted initial letters and lets the brain center complete the word. In a digital world dominated by shallow forms of reading, Bionic Reading aims to encourage a more in-depth reading and understanding of written content.";

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center w-full p-6 md:p-10 bg-black overflow-hidden font-sans">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-fuchsia-600/15 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 text-center mb-10 mt-4 shrink-0">
        <div className="inline-flex items-center justify-center p-5 bg-gray-950 rounded-2xl border border-gray-800 shadow-inner mb-6 relative group">
          <div className="absolute inset-0 bg-purple-400/20 rounded-2xl blur-xl group-hover:bg-fuchsia-400/30 transition-all duration-500"></div>
          <BookOpen className="relative w-12 h-12 text-purple-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500 drop-shadow-[0_0_15px_rgba(192,132,252,0.3)]">
          Bionic Reading
        </h1>
        <p className="text-purple-200/60 text-lg font-medium max-w-2xl mx-auto tracking-wide">
          Paste standard text to instantly convert it into a glowing, dyslexia-friendly format.
        </p>
      </div>

      <div className="relative z-10 w-full flex flex-col lg:flex-row gap-8 flex-1 min-h-0 max-w-7xl">
        
        {/* --- LEFT PANEL: PURPLE INPUT & CONTROLS --- */}
        <div className="flex-[0.8] bg-gray-950/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.05)] flex flex-col gap-6 transition-all duration-500 hover:border-purple-500/40 hover:shadow-[0_0_60px_rgba(168,85,247,0.15)]">
          
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-purple-200 uppercase tracking-[0.2em] text-sm flex items-center gap-3 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
              <Type className="w-5 h-5 text-purple-400" /> Original Text
            </h2>
            <div className="flex gap-3">
              <button 
                onClick={() => setInputText(sampleText)}
                className="text-xs font-bold uppercase tracking-wider bg-purple-900/30 hover:bg-purple-600/40 border border-purple-500/30 px-4 py-2 rounded-xl transition-all text-purple-300 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              >
                Load Sample
              </button>
              {inputText && (
                <button 
                  onClick={() => setInputText('')}
                  className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-rose-400 transition-colors flex items-center gap-1 hover:drop-shadow-[0_0_10px_rgba(251,113,133,0.8)]"
                >
                  <Trash2 className="w-4 h-4" /> Clear
                </button>
              )}
            </div>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste the article or text you want to read here..."
            className="flex-1 w-full min-h-[180px] bg-black/50 text-gray-200 p-6 rounded-2xl border border-gray-800 focus:outline-none focus:border-purple-500/50 focus:shadow-[inset_0_0_30px_rgba(168,85,247,0.15)] resize-none transition-all custom-scrollbar leading-relaxed text-lg placeholder-gray-700"
          />

          {/* Reader Customization Settings */}
          <div className="bg-black/40 p-6 rounded-2xl border border-purple-500/10 mt-2 shadow-inner">
            <h3 className="text-xs font-bold text-purple-400/60 mb-6 uppercase tracking-[0.2em]">Reader Preferences</h3>
            <div className="flex flex-col gap-6">
              
              {/* Font Size Slider */}
              <div className="flex items-center gap-4 group">
                <Type className="w-5 h-5 text-purple-500/40 group-hover:text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0)] group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-all" />
                <input 
                  type="range" min="16" max="48" value={fontSize} 
                  onChange={(e) => setFontSize(e.target.value)}
                  className="flex-1 accent-purple-500 cursor-pointer h-2 bg-gray-800 rounded-lg appearance-none"
                />
                <span className="text-purple-200 font-mono w-14 text-center bg-purple-900/20 py-1.5 px-2 rounded-lg text-xs border border-purple-500/20">{fontSize}px</span>
              </div>

              {/* Line Height Slider */}
              <div className="flex items-center gap-4 group">
                <AlignJustify className="w-5 h-5 text-purple-500/40 group-hover:text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0)] group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-all" />
                <input 
                  type="range" min="1.5" max="3" step="0.1" value={lineHeight} 
                  onChange={(e) => setLineHeight(e.target.value)}
                  className="flex-1 accent-purple-500 cursor-pointer h-2 bg-gray-800 rounded-lg appearance-none"
                />
                <span className="text-purple-200 font-mono w-14 text-center bg-purple-900/20 py-1.5 px-2 rounded-lg text-xs border border-purple-500/20">{lineHeight}</span>
              </div>

              {/* Letter Spacing Slider */}
              <div className="flex items-center gap-4 group">
                <MoveHorizontal className="w-5 h-5 text-purple-500/40 group-hover:text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0)] group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-all" />
                <input 
                  type="range" min="0" max="5" step="0.5" value={letterSpacing} 
                  onChange={(e) => setLetterSpacing(e.target.value)}
                  className="flex-1 accent-purple-500 cursor-pointer h-2 bg-gray-800 rounded-lg appearance-none"
                />
                <span className="text-purple-200 font-mono w-14 text-center bg-purple-900/20 py-1.5 px-2 rounded-lg text-xs border border-purple-500/20">{letterSpacing}px</span>
              </div>

            </div>
          </div>
        </div>

        {/* --- RIGHT PANEL: FUCHSIA BIONIC OUTPUT --- */}
        <div className="flex-[1.2] bg-gray-950/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-fuchsia-500/20 shadow-[0_0_40px_rgba(217,70,239,0.05)] flex flex-col h-108 transition-all duration-500 hover:border-fuchsia-500/40 hover:shadow-[0_0_60px_rgba(217,70,239,0.15)]">
          <h2 className="font-bold text-fuchsia-400 uppercase tracking-[0.2em] text-sm mb-6 drop-shadow-[0_0_10px_rgba(217,70,239,0.6)]">
            Bionic Output
          </h2>
          
          <div className="flex-1 bg-black/80 p-8 md:p-10 rounded-2xl border border-gray-800 overflow-y-auto shadow-[inset_0_0_50px_rgba(0,0,0,1)] custom-scrollbar relative">
            {inputText ? (
              <div 
                // MAGIC HERE: This targets the <b> tags generated by your renderBionicText function and makes them glow!
                className="transition-all duration-200 text-gray-400 [&_b]:text-white [&_b]:font-black [&_b]:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                style={{ 
                  fontSize: `${fontSize}px`, 
                  lineHeight: lineHeight,
                  letterSpacing: `${letterSpacing}px`,
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {renderBionicText(inputText)}
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700 italic text-center px-8 gap-6">
                <div className="p-8 rounded-full bg-gray-900 border border-gray-800 shadow-inner">
                  <BookOpen className="w-16 h-16 text-gray-600/50" />
                </div>
                <p className="text-xl max-w-md font-medium tracking-wide">
                  Your enhanced, bionic text will appear here instantly as you type or paste.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DyslexiaReader;