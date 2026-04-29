import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Cybernetic Pulse (AI Gen)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "text-pink-500",
    shadow: "shadow-[0_0_15px_rgba(236,72,153,0.5)]"
  },
  {
    id: 2,
    title: "Neon Horizon (AI Gen)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "text-cyan-400",
    shadow: "shadow-[0_0_15px_rgba(34,211,238,0.5)]"
  },
  {
    id: 3,
    title: "Synthwave Dreams (AI Gen)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "text-purple-500",
    shadow: "shadow-[0_0_15px_rgba(168,85,247,0.5)]"
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className={`p-6 rounded-2xl bg-slate-900 border border-slate-700 ${currentTrack.shadow} transition-all duration-500 w-full max-w-sm flex flex-col items-center gap-6`}>
      <div className="text-center w-full">
        <h2 className="text-slate-400 text-xs uppercase tracking-[0.2em] mb-2 font-mono">Now Playing</h2>
        <div className={`text-xl font-bold ${currentTrack.color} truncate font-mono drop-shadow-[0_0_8px_currentColor]`}>
          {currentTrack.title}
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-6">
        <button 
          onClick={prevTrack}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button 
          onClick={togglePlay}
          className={`w-14 h-14 rounded-full flex items-center justify-center bg-slate-800 border-2 ${currentTrack.color.replace('text-', 'border-')} hover:scale-105 transition-all text-white`}
          style={{ boxShadow: isPlaying ? `0 0 15px ${currentTrack.color === 'text-pink-500' ? '#ec4899' : currentTrack.color === 'text-cyan-400' ? '#22d3ee' : '#a855f7'}` : 'none' }}
        >
          {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
        </button>

        <button 
          onClick={nextTrack}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-3 w-full px-4">
        <button onClick={() => setIsMuted(!isMuted)} className="text-slate-400 hover:text-white transition-colors">
          {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
        />
      </div>
    </div>
  );
}
