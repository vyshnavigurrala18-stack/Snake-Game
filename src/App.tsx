import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-pink-500/30 flex flex-col relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="w-full p-6 border-b border-white/5 bg-slate-950/50 backdrop-blur-md relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Terminal className="text-emerald-400 w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                NEON SNAKE
              </h1>
              <p className="text-xs text-slate-500 font-mono tracking-widest">v1.0.0 // SYS.ONLINE</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-12 hidden md:flex items-center justify-center gap-12 relative z-10 h-full">
        <div className="flex-1 flex justify-center">
          <SnakeGame />
        </div>
        <div className="w-full max-w-sm flex shrink-0">
          <MusicPlayer />
        </div>
      </main>

      {/* Mobile Content */}
      <main className="flex-1 w-full p-4 flex flex-col items-center gap-8 relative z-10 md:hidden pt-8">
        <MusicPlayer />
        <SnakeGame />
      </main>
    </div>
  );
}
