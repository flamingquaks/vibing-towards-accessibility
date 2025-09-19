import { useState, useEffect, useRef } from 'react';
import './RainbowGenerator.css';

interface Rainbow {
  id: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  size: number;
  hue: number;
}

export default function RainbowGenerator() {
  const [rainbows, setRainbows] = useState<Rainbow[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const rainbowIdRef = useRef(0);

  const createRainbow = (x?: number, y?: number): Rainbow => {
    const container = containerRef.current;
    if (!container) return { id: 0, x: 0, y: 0, velocityX: 0, velocityY: 0, size: 50, hue: 0 };

    return {
      id: rainbowIdRef.current++,
      x: x ?? Math.random() * (container.clientWidth - 100),
      y: y ?? Math.random() * (container.clientHeight - 100),
      velocityX: (Math.random() - 0.5) * 4,
      velocityY: (Math.random() - 0.5) * 4,
      size: Math.random() * 50 + 30,
      hue: Math.random() * 360,
    };
  };

  const addRainbow = (event?: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    let x: number | undefined, y: number | undefined;
    if (event) {
      const rect = container.getBoundingClientRect();
      x = event.clientX - rect.left - 50;
      y = event.clientY - rect.top - 25;
    }

    setRainbows(prev => [...prev, createRainbow(x, y)]);
  };

  const startGenerating = () => {
    setIsGenerating(true);
  };

  const stopGenerating = () => {
    setIsGenerating(false);
  };

  const clearRainbows = () => {
    setRainbows([]);
    setIsGenerating(false);
  };

  useEffect(() => {
    let interval: number;
    
    if (isGenerating) {
      interval = window.setInterval(() => {
        setRainbows(prev => {
          if (prev.length < 20) {
            return [...prev, createRainbow()];
          }
          return prev;
        });
      }, 500);
    }

    return () => window.clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    const animate = () => {
      setRainbows(prev => 
        prev.map(rainbow => {
          const container = containerRef.current;
          if (!container) return rainbow;

          let newX = rainbow.x + rainbow.velocityX;
          let newY = rainbow.y + rainbow.velocityY;
          let newVelocityX = rainbow.velocityX;
          let newVelocityY = rainbow.velocityY;

          // Bounce off walls
          if (newX <= 0 || newX >= container.clientWidth - rainbow.size) {
            newVelocityX = -newVelocityX;
            newX = Math.max(0, Math.min(newX, container.clientWidth - rainbow.size));
          }
          if (newY <= 0 || newY >= container.clientHeight - rainbow.size) {
            newVelocityY = -newVelocityY;
            newY = Math.max(0, Math.min(newY, container.clientHeight - rainbow.size));
          }

          return {
            ...rainbow,
            x: newX,
            y: newY,
            velocityX: newVelocityX,
            velocityY: newVelocityY,
            hue: (rainbow.hue + 2) % 360, // Slowly change colors
          };
        })
      );

      animationRef.current = window.requestAnimationFrame(animate);
    };

    if (rainbows.length > 0) {
      animationRef.current = window.requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [rainbows.length]);

  return (
    <div className="rainbow-app">
      <div className="rainbow-controls">
        <h1>Rainbow Generator</h1>
        <div className="control-buttons">
          <button 
            onClick={addRainbow}
            className="control-btn add-btn"
            aria-label="Add a single rainbow"
          >
            🌈 Add Rainbow
          </button>
          <button 
            onClick={isGenerating ? stopGenerating : startGenerating}
            className={`control-btn ${isGenerating ? 'stop-btn' : 'start-btn'}`}
            aria-label={isGenerating ? 'Stop generating rainbows' : 'Start generating rainbows automatically'}
          >
            {isGenerating ? '⏹️ Stop' : '▶️ Auto Generate'}
          </button>
          <button 
            onClick={clearRainbows}
            className="control-btn clear-btn"
            aria-label="Clear all rainbows"
          >
            🗑️ Clear All
          </button>
        </div>
        <p className="instructions">
          Click anywhere in the area below to create a rainbow, or use the buttons above!
        </p>
      </div>

      <div 
        ref={containerRef}
        className="rainbow-container"
        onClick={addRainbow}
        role="application"
        aria-label="Rainbow playground - click to add rainbows"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            addRainbow();
          }
        }}
      >
        {rainbows.map(rainbow => (
          <div
            key={rainbow.id}
            className="rainbow"
            style={{
              left: rainbow.x,
              top: rainbow.y,
              width: rainbow.size,
              height: rainbow.size / 2,
              filter: `hue-rotate(${rainbow.hue}deg)`,
            }}
            aria-hidden="true"
          />
        ))}
        {rainbows.length === 0 && (
          <div className="empty-state">
            <p>Click here or use the buttons above to create bouncing rainbows!</p>
          </div>
        )}
      </div>

      <div className="rainbow-info">
        <p>Rainbows active: <strong>{rainbows.length}</strong></p>
        <p>Status: <strong>{isGenerating ? 'Auto-generating' : 'Manual mode'}</strong></p>
      </div>
    </div>
  );
}