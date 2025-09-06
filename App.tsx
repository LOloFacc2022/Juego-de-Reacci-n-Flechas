import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Sign, Level } from './types';
import { SIGNS_BY_LEVEL, GAME_DURATION } from './constants';

type Feedback = 'correct' | 'incorrect' | 'none';

// Helper: Pick a random sign from a given array
const getRandomSign = (signs: Sign[], excludeSign?: Sign): Sign => {
  let availableSigns = signs;
  if (excludeSign) {
    availableSigns = signs.filter(s => s.name !== excludeSign.name);
  }
  const randomIndex = Math.floor(Math.random() * availableSigns.length);
  return availableSigns[randomIndex];
};

const StartScreen: React.FC<{ onStart: (level: Level) => void }> = ({ onStart }) => {
  const [selectedLevel, setSelectedLevel] = useState<Level>(Level.Normal);

  const signsToShow = SIGNS_BY_LEVEL[selectedLevel];

  return (
    <div className="text-center flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl md:text-6xl font-bold text-cyan-400 mb-4">Juego de Reacción</h1>
      <p className="text-lg text-slate-300 max-w-2xl mb-8">
        ¡Pon a prueba tus reflejos! Elige un nivel y presiona la tecla correcta para la señal. Tienes {GAME_DURATION} segundos para conseguir la máxima puntuación.
      </p>
      
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setSelectedLevel(Level.Normal)}
          className={`font-bold py-3 px-8 rounded-full text-lg transition-all ${selectedLevel === Level.Normal ? 'bg-cyan-500 text-slate-900 scale-105 shadow-lg shadow-cyan-500/30' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
        >
          Nivel 1: Normal
        </button>
        <button
          onClick={() => setSelectedLevel(Level.Dificil)}
          className={`font-bold py-3 px-8 rounded-full text-lg transition-all ${selectedLevel === Level.Dificil ? 'bg-cyan-500 text-slate-900 scale-105 shadow-lg shadow-cyan-500/30' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
        >
          Nivel 2: Difícil
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10 text-left w-full max-w-4xl">
        {signsToShow.map(sign => (
          <div key={sign.name} className="bg-slate-800 p-4 rounded-lg flex items-center space-x-3">
            <sign.Icon className="w-8 h-8 text-cyan-400" />
            <span className="text-slate-200 font-medium">{sign.label}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => onStart(selectedLevel)}
        className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-4 px-10 rounded-full text-xl transition-transform transform hover:scale-105 shadow-lg shadow-cyan-500/30">
        Empezar a Jugar
      </button>
    </div>
  );
};

const GameScreen: React.FC<{
  score: number;
  timeLeft: number;
  signTimeLeft: number;
  currentSign: Sign;
  feedback: Feedback;
}> = ({ score, timeLeft, signTimeLeft, currentSign, feedback }) => {
  const feedbackColor = {
    correct: 'border-green-500 shadow-green-500/50',
    incorrect: 'border-red-500 shadow-red-500/50',
    none: 'border-slate-600',
  };

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference * (1 - signTimeLeft / 10);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center p-4 md:p-8">
      <div className="w-full flex justify-between items-center mb-10 px-4">
        <div>
          <span className="text-slate-400 text-xl font-medium">Puntuación</span>
          <p className="text-5xl font-bold text-white">{score}</p>
        </div>
        <div>
          <span className="text-slate-400 text-xl font-medium">Tiempo</span>
          <p className="text-5xl font-bold text-white">{timeLeft}</p>
        </div>
      </div>

      <div className={`relative w-64 h-64 md:w-80 md:h-80 bg-slate-800 rounded-full flex items-center justify-center border-8 transition-all duration-200 ${feedbackColor[feedback]} shadow-2xl`}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="5" className="text-slate-700" />
            <circle 
                cx="50" 
                cy="50" 
                r={radius} 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="5" 
                className="text-cyan-400 transition-all duration-300"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                transform="rotate(-90 50 50)"
                style={{ strokeLinecap: 'round' }}
            />
        </svg>
        <currentSign.Icon className="w-32 h-32 md:w-40 md:h-40 text-slate-100 z-10" />
      </div>

      <div className="mt-10 text-center">
         <p className="text-4xl md:text-5xl font-bold text-cyan-400">{currentSign.name}</p>
      </div>
    </div>
  );
};


export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [level, setLevel] = useState<Level>(Level.Normal);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [signTimeLeft, setSignTimeLeft] = useState(10);
  const [currentSign, setCurrentSign] = useState<Sign>(() => getRandomSign(SIGNS_BY_LEVEL[Level.Normal]));
  const [feedback, setFeedback] = useState<Feedback>('none');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gameIntervalRef = useRef<number | null>(null);
  const signIntervalRef = useRef<number | null>(null);

  const playBeep = useCallback(() => {
    if (!audioCtxRef.current) return;
    const audioCtx = audioCtxRef.current;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.1);
  }, []);
  
  const advanceToNextSign = useCallback(() => {
    const signsForCurrentLevel = SIGNS_BY_LEVEL[level];
    setCurrentSign(prevSign => getRandomSign(signsForCurrentLevel, prevSign));
    setSignTimeLeft(10);
  }, [level]);

  const endGame = useCallback(() => {
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    if (signIntervalRef.current) clearInterval(signIntervalRef.current);
    setGameState(GameState.Start);
  }, []);

  const startGame = (selectedLevel: Level) => {
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.error("Web Audio API is not supported in this browser");
      }
    }
    setLevel(selectedLevel);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setFeedback('none');

    const initialSigns = SIGNS_BY_LEVEL[selectedLevel];
    setCurrentSign(getRandomSign(initialSigns));
    setSignTimeLeft(10);
    
    setGameState(GameState.Playing);
  };

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
      if (gameState !== GameState.Playing) return;

      const key = event.key;
      
      if (currentSign.keys.includes(key)) {
        setFeedback('correct');
        setScore(prev => prev + 1);
        advanceToNextSign();
        setTimeout(() => setFeedback('none'), 200);
      } else {
        const allKeysForLevel = SIGNS_BY_LEVEL[level].flatMap(sign => sign.keys);
        if (allKeysForLevel.includes(key)) {
          setFeedback('incorrect');
          setTimeout(() => setFeedback('none'), 200);
        }
      }
    }, [gameState, currentSign, advanceToNextSign, level]);


  useEffect(() => {
    if (gameState === GameState.Playing) {
      playBeep();
    }
  }, [currentSign, gameState, playBeep]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameState === GameState.Playing) {
      gameIntervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      signIntervalRef.current = window.setInterval(() => {
        setSignTimeLeft(prev => {
          if (prev <= 1) {
            advanceToNextSign();
            return 10;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
        if (signIntervalRef.current) clearInterval(signIntervalRef.current);
      };
    }
  }, [gameState, endGame, advanceToNextSign]);


  const renderContent = () => {
    switch (gameState) {
      case GameState.Playing:
        return <GameScreen score={score} timeLeft={timeLeft} signTimeLeft={signTimeLeft} currentSign={currentSign} feedback={feedback} />;
      case GameState.Start:
      default:
        return <StartScreen onStart={startGame} />;
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-900 font-sans p-4">
      <div className="w-full max-w-5xl">
        {renderContent()}
      </div>
    </main>
  );
}
