'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

// GRID PANORÁMICO CON PÍXELES REDUCIDOS (88 x 44)
const GRID_COLS = 88;
const GRID_ROWS = 44;
const SPEED = 65; // Velocidad ajustada a la densidad de píxeles

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([
    { x: 44, y: 22 },
    { x: 43, y: 22 },
    { x: 42, y: 22 },
    { x: 41, y: 22 },
    { x: 40, y: 22 },
    { x: 39, y: 22 },
  ]);
  const [food, setFood] = useState<Position>({ x: 22, y: 22 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  const directionRef = useRef<Direction>(direction);
  directionRef.current = direction;

  // Genera el objetivo (cuadrado) en una posición aleatoria no ocupada por la serpiente
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_COLS),
        y: Math.floor(Math.random() * GRID_ROWS),
      };
      const collision = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!collision) break;
    }
    return newFood;
  }, []);

  // Reiniciar juego
  const resetGame = () => {
    const initialSnake = [
      { x: 44, y: 22 },
      { x: 43, y: 22 },
      { x: 42, y: 22 },
      { x: 41, y: 22 },
      { x: 40, y: 22 },
      { x: 39, y: 22 },
    ];
    setSnake(initialSnake);
    setDirection('RIGHT');
    setFood(generateFood(initialSnake));
    setScore(0);
    setGameOver(false);
    setIsGameStarted(true);
  };

  // MANEJO DE TECLAS Y BLOQUEO DEL SCROLL WEB MIENTRAS SE JUEGA
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Si el juego está activo, bloqueamos el scroll nativo de las teclas de dirección
      if (
        isGameStarted &&
        !gameOver &&
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'W', 's', 'S', 'a', 'A', 'd', 'D'].includes(e.key)
      ) {
        e.preventDefault();
      }

      if (!isGameStarted || gameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameStarted, gameOver]);

  // BUCLE PRINCIPAL DEL JUEGO
  useEffect(() => {
    if (!isGameStarted || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };

        switch (directionRef.current) {
          case 'UP':
            head.y -= 1;
            break;
          case 'DOWN':
            head.y += 1;
            break;
          case 'LEFT':
            head.x -= 1;
            break;
          case 'RIGHT':
            head.x += 1;
            break;
        }

        // Colisión con bordes de la pantalla
        if (
          head.x < 0 ||
          head.x >= GRID_COLS ||
          head.y < 0 ||
          head.y >= GRID_ROWS
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Colisión con el propio cuerpo
        for (let i = 0; i < prevSnake.length; i++) {
          if (prevSnake[i].x === head.x && prevSnake[i].y === head.y) {
            setGameOver(true);
            return prevSnake;
          }
        }

        const newSnake = [head, ...prevSnake];

        // Comer el objetivo (cuadrado)
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => {
            const nextScore = s + 10;
            if (nextScore > highScore) setHighScore(nextScore);
            return nextScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, SPEED);
    return () => clearInterval(interval);
  }, [isGameStarted, gameOver, food, highScore, generateFood]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center font-mono select-none p-2">
      {/* CABECERA ESTILO RADIO EN CASA */}
      <div className="w-full bg-[#1e1e1e] border border-[#5c5c5c]/60 p-3.5 mb-3 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f74a35] animate-pulse" />
          <h2
            className="text-white text-sm sm:text-base font-normal uppercase tracking-widest"
            style={{ fontFamily: "'Special Gothic Expanded One', sans-serif" }}
          >
            REC • SNAKE
          </h2>
        </div>

        <div className="flex gap-5 text-xs font-bold tracking-wider text-neutral-300">
          <span>PUNTOS: <strong className="text-[#f74a35]">{score}</strong></span>
          <span>RÉCORD: <strong className="text-[#436df7]">{highScore}</strong></span>
        </div>
      </div>

      {/* TABLERO PANORÁMICO */}
      <div 
        className="relative w-full aspect-[2/1] bg-[#1a1a1a] border border-[#5c5c5c]/80 shadow-2xl overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, #222222 1px, transparent 1px),
            linear-gradient(to bottom, #222222 1px, transparent 1px)
          `,
          backgroundSize: `${100 / GRID_COLS}% ${100 / GRID_ROWS}%`,
        }}
      >
        {/* RENDERIZADO DE MATRIZ (88x44) */}
        <div
          className="w-full h-full grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
          }}
        >
          {Array.from({ length: GRID_COLS * GRID_ROWS }).map((_, idx) => {
            const x = idx % GRID_COLS;
            const y = Math.floor(idx / GRID_COLS);

            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.some(
              (segment, i) => i !== 0 && segment.x === x && segment.y === y
            );
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={idx}
                className="w-full h-full flex items-center justify-center p-[0.25px]"
              >
                {/* CABEZA EN ROJO */}
                {isHead && (
                  <div className="w-full h-full bg-[#f74a35] shadow-sm shadow-[#f74a35]" />
                )}

                {/* CUERPO EN GRIS */}
                {isBody && (
                  <div className="w-full h-full bg-[#808080]" />
                )}

                {/* OBJETIVO: CUADRADO AZUL #436DF7 SIN BORDE */}
                {isFood && (
                  <div className="w-full h-full bg-[#436df7] animate-pulse shadow-sm shadow-[#436df7]" />
                )}
              </div>
            );
          })}
        </div>

        {/* PANTALLA INICIAL */}
        {!isGameStarted && (
          <div className="absolute inset-0 bg-[#181818]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <span className="text-[10px] text-[#f74a35] font-bold uppercase tracking-widest">
              MINIJUEGO EDITORIAL
            </span>
            <h3
              className="text-xl sm:text-2xl text-white font-normal uppercase tracking-widest"
              style={{ fontFamily: "'Special Gothic Expanded One', sans-serif" }}
            >
              PRESIONÁ INICIAR PARA JUGAR
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Usa las flechas del teclado o las teclas <strong className="text-white">WASD</strong> para dirigir la serpiente.
            </p>
            <button
              onClick={resetGame}
              className="bg-[#f74a35] hover:bg-white hover:text-neutral-900 text-white px-8 py-3 text-xs font-bold uppercase tracking-widest transition-colors duration-300 shadow-xl cursor-pointer"
            >
              INICIAR JUEGO →
            </button>
          </div>
        )}

        {/* PANTALLA GAME OVER */}
        {gameOver && (
          <div className="absolute inset-0 bg-[#181818]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3">
            <span className="text-[#f74a35] font-bold text-[10px] uppercase tracking-widest">
              FIN DEL JUEGO
            </span>
            <h3
              className="text-2xl sm:text-3xl text-white font-normal uppercase tracking-wider"
              style={{ fontFamily: "'Special Gothic Expanded One', sans-serif" }}
            >
              GAME OVER
            </h3>
            <p className="text-xs text-neutral-300 font-bold">
              PUNTUACIÓN OBTENIDA: <strong className="text-[#436df7]">{score}</strong>
            </p>
            <button
              onClick={resetGame}
              className="bg-[#f74a35] hover:bg-white hover:text-neutral-900 text-white px-8 py-3 text-xs font-bold uppercase tracking-widest transition-colors duration-300 shadow-xl cursor-pointer mt-2"
            >
              REINTENTAR ↻
            </button>
          </div>
        )}
      </div>

      {/* CONTROLES TÁCTILES PARA MÓVILES */}
      <div className="w-full grid grid-cols-3 gap-1.5 mt-3 max-w-[220px] sm:hidden">
        <div />
        <button
          onClick={() => directionRef.current !== 'DOWN' && setDirection('UP')}
          className="bg-[#1e1e1e] border border-[#5c5c5c] text-white py-2.5 text-xs font-bold active:bg-[#f74a35]"
        >
          ▲
        </button>
        <div />
        <button
          onClick={() => directionRef.current !== 'RIGHT' && setDirection('LEFT')}
          className="bg-[#1e1e1e] border border-[#5c5c5c] text-white py-2.5 text-xs font-bold active:bg-[#f74a35]"
        >
          ◄
        </button>
        <button
          onClick={() => directionRef.current !== 'UP' && setDirection('DOWN')}
          className="bg-[#1e1e1e] border border-[#5c5c5c] text-white py-2.5 text-xs font-bold active:bg-[#f74a35]"
        >
          ▼
        </button>
        <button
          onClick={() => directionRef.current !== 'LEFT' && setDirection('RIGHT')}
          className="bg-[#1e1e1e] border border-[#5c5c5c] text-white py-2.5 text-xs font-bold active:bg-[#f74a35]"
        >
          ►
        </button>
      </div>
    </div>
  );
}