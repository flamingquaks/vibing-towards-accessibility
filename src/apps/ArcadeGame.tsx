import { useState, useEffect, useCallback, useRef } from 'react';
import './ArcadeGame.css';

interface Position {
  x: number;
  y: number;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Direction = 'RIGHT';

export default function ArcadeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(200);
  
  const gameLoopRef = useRef<number | null>(null);
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood({ x: 15, y: 10 });
    directionRef.current = INITIAL_DIRECTION;
    setGameOver(false);
    setScore(0);
    setIsPlaying(false);
    setGameSpeed(200);
  };

  const startGame = () => {
    if (gameOver) {
      resetGame();
    }
    setIsPlaying(true);
  };

  const pauseGame = () => {
    setIsPlaying(false);
  };

  const moveSnake = useCallback(() => {
    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

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

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      // Check self collision
      if (currentSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
          }
          return newScore;
        });
        setFood(generateFood(newSnake));
        setGameSpeed(prev => Math.max(100, prev - 5)); // Increase speed
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood, highScore]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!isPlaying) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (gameOver) {
          resetGame();
        }
        setIsPlaying(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        if (directionRef.current !== 'DOWN') {
          directionRef.current = 'UP';
        }
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault();
        if (directionRef.current !== 'UP') {
          directionRef.current = 'DOWN';
        }
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault();
        if (directionRef.current !== 'RIGHT') {
          directionRef.current = 'LEFT';
        }
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault();
        if (directionRef.current !== 'LEFT') {
          directionRef.current = 'RIGHT';
        }
        break;
      case ' ':
        e.preventDefault();
        pauseGame();
        break;
    }
  }, [isPlaying, gameOver]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, gameSpeed);
    } else {
      if (gameLoopRef.current) {
        window.clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        window.clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameOver, moveSnake, gameSpeed]);

  const handleDirectionClick = (newDirection: Direction) => {
    if (!isPlaying) return;
    
    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT'
    };

    if (directionRef.current !== opposites[newDirection]) {
      directionRef.current = newDirection;
    }
  };

  return (
    <div className="arcade-game">
      <div className="game-header">
        <h1>🐍 Snake Game</h1>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Score:</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">High Score:</span>
            <span className="stat-value">{highScore}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Length:</span>
            <span className="stat-value">{snake.length}</span>
          </div>
        </div>
      </div>

      <div className="game-container">
        <div 
          className="game-board"
          role="application"
          aria-label="Snake game board"
          tabIndex={0}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            const isSnake = snake.some(segment => segment.x === x && segment.y === y);
            const isHead = snake[0]?.x === x && snake[0]?.y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={index}
                className={`cell ${isSnake ? 'snake' : ''} ${isHead ? 'head' : ''} ${isFood ? 'food' : ''}`}
                aria-hidden="true"
              />
            );
          })}
        </div>

        <div className="game-controls">
          <div className="control-buttons">
            {!isPlaying && !gameOver && (
              <button onClick={startGame} className="control-btn start-btn">
                ▶️ Start Game
              </button>
            )}
            {!isPlaying && gameOver && (
              <button onClick={startGame} className="control-btn restart-btn">
                🔄 Play Again
              </button>
            )}
            {isPlaying && (
              <button onClick={pauseGame} className="control-btn pause-btn">
                ⏸️ Pause
              </button>
            )}
            <button onClick={resetGame} className="control-btn reset-btn">
              🔄 Reset
            </button>
          </div>

          <div className="direction-controls">
            <div className="direction-row">
              <button 
                className="direction-btn"
                onClick={() => handleDirectionClick('UP')}
                aria-label="Move up"
                disabled={!isPlaying}
              >
                ⬆️
              </button>
            </div>
            <div className="direction-row">
              <button 
                className="direction-btn"
                onClick={() => handleDirectionClick('LEFT')}
                aria-label="Move left"
                disabled={!isPlaying}
              >
                ⬅️
              </button>
              <button 
                className="direction-btn"
                onClick={() => handleDirectionClick('DOWN')}
                aria-label="Move down"
                disabled={!isPlaying}
              >
                ⬇️
              </button>
              <button 
                className="direction-btn"
                onClick={() => handleDirectionClick('RIGHT')}
                aria-label="Move right"
                disabled={!isPlaying}
              >
                ➡️
              </button>
            </div>
          </div>

          <div className="instructions">
            <h3>How to Play:</h3>
            <ul>
              <li>Use arrow keys or WASD to move</li>
              <li>Eat the red food to grow and score points</li>
              <li>Don't hit the walls or yourself</li>
              <li>Press Space to pause/start</li>
              <li>Game gets faster as you score more!</li>
            </ul>
          </div>
        </div>
      </div>

      {gameOver && (
        <div className="game-over-modal">
          <div className="modal-content">
            <h2>Game Over!</h2>
            <p>Final Score: <strong>{score}</strong></p>
            <p>Snake Length: <strong>{snake.length}</strong></p>
            {score === highScore && score > 0 && (
              <p className="new-high-score">🎉 New High Score! 🎉</p>
            )}
            <button onClick={startGame} className="play-again-btn">
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}