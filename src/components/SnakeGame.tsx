import React, { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 120;

const COLORS = [
  'bg-cyan-400 shadow-[0_0_10px_#22d3ee]',
  'bg-pink-500 shadow-[0_0_10px_#ec4899]',
  'bg-green-400 shadow-[0_0_10px_#4ade80]',
  'bg-purple-500 shadow-[0_0_10px_#a855f7]'
];

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [foodColor, setFoodColor] = useState(COLORS[0]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const directionRef = useRef(direction);
  
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    setFood(newFood);
    setFoodColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setHasStarted(true);
    generateFood(INITIAL_SNAKE);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys to keep focus on game
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (!hasStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setHasStarted(true);
      }

      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
          if (y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y
        };

        // Check bounds
        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          generateFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, hasStarted, generateFood]);

  useEffect(() => {
    if (gameOver) {
      if (score > highScore) {
        setHighScore(score);
      }
    }
  }, [gameOver, score, highScore]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-between items-end mb-4 px-2">
        <div className="flex flex-col">
          <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">Score</span>
          <span className="text-2xl font-bold text-green-400 font-mono drop-shadow-[0_0_8px_#4ade80]">{score}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">High Score</span>
          <span className="text-xl font-bold text-slate-200 font-mono">{highScore}</span>
        </div>
      </div>

      <div className="relative p-2 bg-slate-900 rounded-xl border border-slate-800 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
        <div 
          className="bg-black/80 rounded border border-slate-800 relative overflow-hidden"
          style={{ width: 400, height: 400 }}
        >
          {/* Grid lines (optional faint neon effect) */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: `${400/GRID_SIZE}px ${400/GRID_SIZE}px`
          }} />

          {/* Food */}
          <div 
            className={`absolute rounded-full ${foodColor} transition-all duration-300 transform scale-110`}
            style={{ 
              left: food.x * (400/GRID_SIZE), 
              top: food.y * (400/GRID_SIZE), 
              width: 400/GRID_SIZE, 
              height: 400/GRID_SIZE 
            }} 
          />

          {/* Snake */}
          {snake.map((segment, index) => (
            <div 
              key={index}
              className={`absolute rounded-sm ${index === 0 ? 'bg-green-400 shadow-[0_0_12px_#4ade80] z-10' : 'bg-green-500/80 shadow-[0_0_8px_#22c55e]'}`}
              style={{
                left: segment.x * (400/GRID_SIZE) + 1,
                top: segment.y * (400/GRID_SIZE) + 1,
                width: (400/GRID_SIZE) - 2,
                height: (400/GRID_SIZE) - 2,
                transition: 'all 50ms linear' // slight smoothing
              }}
            />
          ))}

          {/* Overlays */}
          {!hasStarted && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
              <div className="text-center">
                <p className="text-green-400 font-mono text-xl mb-4 drop-shadow-[0_0_8px_#4ade80] animate-pulse">Press Arrow Keys to Start</p>
                <p className="text-slate-400 font-mono text-xs">Spacebar to Pause</p>
              </div>
            </div>
          )}

          {isPaused && hasStarted && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20">
              <p className="text-cyan-400 font-mono text-3xl font-bold tracking-[0.2em] drop-shadow-[0_0_10px_#22d3ee]">PAUSED</p>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-20">
              <div className="text-center flex flex-col items-center">
                <h3 className="text-red-500 font-mono text-4xl font-bold mb-2 drop-shadow-[0_0_15px_#ef4444]">GAME OVER</h3>
                <p className="text-slate-300 font-mono mb-6">Final Score: <span className="text-green-400 font-bold">{score}</span></p>
                <button 
                  onClick={resetGame}
                  className="px-6 py-2 bg-slate-800 text-green-400 border border-green-500/50 rounded hover:bg-slate-700 hover:text-white hover:border-green-400 hover:shadow-[0_0_15px_#4ade80] transition-all font-mono uppercase tracking-wider text-sm"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Controls (visible only on small screens) */}
      <div className="grid grid-cols-3 gap-2 mt-8 md:hidden w-64">
        <div />
        <button className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 active:bg-slate-700 flex justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)]" onClick={() => setDirection({ x: 0, y: -1 })}>
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-slate-300" />
        </button>
        <div />
        <button className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 active:bg-slate-700 flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)]" onClick={() => setDirection({ x: -1, y: 0 })}>
          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[12px] border-r-slate-300" />
        </button>
        <button className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 active:bg-slate-700 flex justify-center items-center shadow-[0_0_10px_rgba(0,0,0,0.5)]" onClick={() => setDirection({ x: 0, y: 1 })}>
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-slate-300" />
        </button>
        <button className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 active:bg-slate-700 flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)]" onClick={() => setDirection({ x: 1, y: 0 })}>
          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[12px] border-l-slate-300" />
        </button>
      </div>
    </div>
  );
}
