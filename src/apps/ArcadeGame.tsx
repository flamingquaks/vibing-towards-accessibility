import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        <h1>{t('arcadeGame.title')}</h1>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">{t('arcadeGame.score')}</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">{t('arcadeGame.highScore')}</span>
            <span className="stat-value">{highScore}</span>
          </div>
          <div className="stat">
            <span className="stat-label">{t('arcadeGame.length')}</span>
            <span className="stat-value">{snake.length}</span>
          </div>
        </div>
      </div>

      <div className="game-container">
        <div 
          className="game-board"
          role="application"
          aria-label={t('arcadeGame.gameBoard')}
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
                {t('arcadeGame.startGame')}
              </button>
            )}
            {!isPlaying && gameOver && (
              <button onClick={startGame} className="control-btn restart-btn">
                {t('arcadeGame.playAgain')}
              </button>
            )}
            {isPlaying && (
              <button onClick={pauseGame} className="control-btn pause-btn">
                {t('arcadeGame.pause')}
              </button>
            )}
            <button onClick={resetGame} className="control-btn reset-btn">
              {t('arcadeGame.reset')}
            </button>
          </div>

          <div className="direction-controls">
            <div className="direction-row">
              <button 
                className="direction-btn"
                onClick={() => handleDirectionClick('UP')}
                aria-label={t('arcadeGame.moveUp')}
                disabled={!isPlaying}
              >
                ⬆️
              </button>
            </div>
            <div className="direction-row">
              <button 
                className="direction-btn"
                onClick={() => handleDirectionClick('LEFT')}
                aria-label={t('arcadeGame.moveLeft')}
                disabled={!isPlaying}
              >
                ⬅️
              </button>
              <button 
                className="direction-btn"
                onClick={() => handleDirectionClick('DOWN')}
                aria-label={t('arcadeGame.moveDown')}
                disabled={!isPlaying}
              >
                ⬇️
              </button>
              <button 
                className="direction-btn"
                onClick={() => handleDirectionClick('RIGHT')}
                aria-label={t('arcadeGame.moveRight')}
                disabled={!isPlaying}
              >
                ➡️
              </button>
            </div>
          </div>

          <div className="instructions">
            <h3>{t('arcadeGame.howToPlay')}</h3>
            <ul>
              <li>{t('arcadeGame.instructions.movement')}</li>
              <li>{t('arcadeGame.instructions.eat')}</li>
              <li>{t('arcadeGame.instructions.avoid')}</li>
              <li>{t('arcadeGame.instructions.pause')}</li>
              <li>{t('arcadeGame.instructions.speed')}</li>
            </ul>
          </div>
        </div>
      </div>

      {gameOver && (
        <div className="game-over-modal">
          <div className="modal-content">
            <h2>{t('arcadeGame.gameOver.title')}</h2>
            <p>{t('arcadeGame.gameOver.finalScore', { score })}</p>
            <p>{t('arcadeGame.gameOver.snakeLength', { length: snake.length })}</p>
            {score === highScore && score > 0 && (
              <p className="new-high-score">{t('arcadeGame.gameOver.newHighScore')}</p>
            )}
            <button onClick={startGame} className="play-again-btn">
              {t('arcadeGame.gameOver.playAgain')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}