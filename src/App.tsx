import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Star, Volume2, VolumeX } from 'lucide-react';

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function App() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [dragonBalls, setDragonBalls] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Handle background music
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.15; // Âm lượng nhỏ, thư giãn
      if (isRunning && !isMuted) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isRunning, isMuted]);

  // Handle timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Timer finished
      if (mode === 'work') {
        setDragonBalls((prev) => Math.min(prev + 1, 7));
        setMode('break');
        setTimeLeft(BREAK_TIME);
      } else {
        setMode('work');
        setTimeLeft(WORK_TIME);
      }
      setIsRunning(false);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => {
    if (dragonBalls === 7 && mode === 'work' && timeLeft === WORK_TIME) {
      setDragonBalls(0);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(WORK_TIME);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    if (dragonBalls === 7 && !isRunning && mode === 'work' && timeLeft === WORK_TIME) {
      return "SHENRON SUMMONED! WISH GRANTED.";
    }
    if (mode === 'work') {
      return isRunning ? "TRAINING IN PROGRESS..." : "READY TO TRAIN?";
    } else {
      return isRunning ? "RECOVERING KI..." : "TAKE A SENZU BEAN!";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gray-900">
      {/* Background Image - Goku Ultra Instinct */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 transition-opacity duration-1000"
        style={{ 
          backgroundImage: `url('https://images.hdqwalls.com/wallpapers/goku-ultra-instinct-4k-artwork-31.jpg')`,
          backgroundPosition: 'center 15%'
        }}
      ></div>
      
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900/80 via-gray-900/50 to-gray-900/90 pointer-events-none"></div>

      {/* Animated Aura Elements */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-screen filter blur-[100px] transition-colors duration-1000 ${mode === 'work' ? 'bg-blue-500' : 'bg-radar-green'}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full mix-blend-screen filter blur-[100px] transition-colors duration-1000 ${mode === 'work' ? 'bg-purple-500' : 'bg-emerald-500'}`}></div>
      </div>

      {/* Relaxing Lofi Background Music */}
      <audio 
        ref={audioRef} 
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3" 
        loop 
      />

      <div className="z-10 w-full max-w-md flex flex-col items-center gap-8">
        
        {/* Header */}
        <div className="text-center space-y-2 relative">
          <h1 className="font-display text-5xl md:text-6xl tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-400 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            ULTRA POMODORO
          </h1>
          <p className="font-sans font-bold text-gray-300 tracking-widest text-sm uppercase drop-shadow-md">
            {getStatusText()}
          </p>
        </div>

        {/* Timer Circle */}
        <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
          {/* Outer Ring */}
          <div 
            className={`absolute inset-0 rounded-full border-4 transition-all duration-500 ${
              mode === 'work' 
                ? isRunning ? 'ui-aura border-blue-400' : 'border-blue-900/50'
                : isRunning ? 'radar-pulse border-radar-green' : 'border-radar-green/50'
            }`}
          ></div>
          
          {/* Inner Circle */}
          <div className="absolute inset-4 rounded-full bg-gray-900/60 backdrop-blur-md border border-gray-700/50 flex flex-col items-center justify-center shadow-2xl">
            <div className="font-display text-7xl md:text-8xl tracking-wider text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
              {formatTime(timeLeft)}
            </div>
            <div className={`mt-2 font-sans font-bold text-sm tracking-widest uppercase ${mode === 'work' ? 'text-blue-400' : 'text-radar-green'}`}>
              {mode === 'work' ? 'Mastering Instinct' : 'Kame House Break'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mt-4">
          <button 
            onClick={resetTimer}
            className="w-14 h-14 rounded-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 flex items-center justify-center text-gray-300 hover:bg-gray-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Reset Timer"
          >
            <RotateCcw size={24} />
          </button>
          
          <button 
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 ${
              mode === 'work' 
                ? 'bg-gradient-to-br from-blue-600 to-purple-700 hover:from-blue-500 hover:to-purple-600 focus:ring-blue-500/50 shadow-[0_0_25px_rgba(59,130,246,0.5)]' 
                : 'bg-gradient-to-br from-radar-green to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 focus:ring-emerald-500/50 shadow-[0_0_25px_rgba(46,139,87,0.5)]'
            }`}
            aria-label={isRunning ? "Pause Timer" : "Start Timer"}
          >
            {isRunning ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-2" />}
          </button>

          <button 
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 ${isMuted ? 'text-red-400 hover:bg-gray-700' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </div>

        {/* Dragon Ball Tracker */}
        <div className="w-full mt-8 p-6 bg-gray-900/60 backdrop-blur-md rounded-3xl border border-gray-700/50 shadow-xl">
          <h3 className="text-center font-sans font-bold text-xs text-gray-400 tracking-widest uppercase mb-4">
            Dragon Balls Collected
          </h3>
          <div className="flex justify-between items-center px-2">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div 
                key={num} 
                className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  num <= dragonBalls 
                    ? 'bg-gradient-to-br from-yellow-400 to-db-orange db-glow scale-110' 
                    : 'bg-gray-800/80 border-2 border-gray-600 opacity-50 grayscale'
                }`}
              >
                {/* Stars inside the Dragon Ball */}
                {num <= dragonBalls && (
                  <div className="absolute inset-0 flex flex-wrap items-center justify-center p-1.5 opacity-80">
                    {Array.from({ length: num }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={num > 4 ? 8 : 10} 
                        fill="#DC2626" 
                        className="text-red-600 drop-shadow-sm m-[1px]" 
                      />
                    ))}
                  </div>
                )}
                
                {/* Glossy highlight */}
                {num <= dragonBalls && (
                  <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full opacity-40 blur-[1px]"></div>
                )}
              </div>
            ))}
          </div>
          
          {dragonBalls === 7 && (
            <div className="mt-6 text-center animate-pulse">
              <p className="font-display text-2xl text-ssj-yellow tracking-widest drop-shadow-[0_0_5px_rgba(255,215,0,0.8)]">
                "STATE YOUR WISH!"
              </p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
