import { useState, useEffect, useCallback } from 'react';
import './Solitaire.css';

type Suit = '♠' | '♥' | '♦' | '♣';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface Card {
  suit: Suit;
  rank: Rank;
  color: 'red' | 'black';
  id: string;
}

export default function Solitaire() {
  const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
  const [tableau, setTableau] = useState<Card[][]>([[], [], [], [], [], [], []]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [stock, setStock] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<{ pile: string, index: number } | null>(null);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const suits: Suit[] = ['♠', '♥', '♦', '♣'];
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const createDeck = useCallback((): Card[] => {
    const newDeck: Card[] = [];
    suits.forEach(suit => {
      ranks.forEach(rank => {
        newDeck.push({
          suit,
          rank,
          color: suit === '♥' || suit === '♦' ? 'red' : 'black',
          id: `${suit}${rank}`
        });
      });
    });
    return shuffleDeck(newDeck);
  }, []);

  const shuffleDeck = (deck: Card[]): Card[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const getRankValue = (rank: Rank): number => {
    switch (rank) {
      case 'A': return 1;
      case 'J': return 11;
      case 'Q': return 12;
      case 'K': return 13;
      default: return parseInt(rank);
    }
  };

  const canPlaceOnFoundation = (card: Card, foundation: Card[]): boolean => {
    if (foundation.length === 0) {
      return card.rank === 'A';
    }
    const topCard = foundation[foundation.length - 1];
    return card.suit === topCard.suit && getRankValue(card.rank) === getRankValue(topCard.rank) + 1;
  };

  const canPlaceOnTableau = (card: Card, tableau: Card[]): boolean => {
    if (tableau.length === 0) {
      return card.rank === 'K';
    }
    const topCard = tableau[tableau.length - 1];
    return card.color !== topCard.color && getRankValue(card.rank) === getRankValue(topCard.rank) - 1;
  };

  const newGame = useCallback(() => {
    const newDeck = createDeck();
    const newTableau: Card[][] = [[], [], [], [], [], [], []];
    let deckIndex = 0;

    // Deal cards to tableau
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row <= col; row++) {
        newTableau[col].push(newDeck[deckIndex++]);
      }
    }

    setTableau(newTableau);
    setStock(newDeck.slice(deckIndex));
    setWaste([]);
    setFoundations([[], [], [], []]);
    setSelectedCard(null);
    setMoves(0);
    setGameWon(false);
  }, [createDeck]);

  const drawFromStock = () => {
    if (stock.length > 0) {
      const newWaste = [...waste, stock[0]];
      const newStock = stock.slice(1);
      setWaste(newWaste);
      setStock(newStock);
      setMoves(prev => prev + 1);
    } else if (waste.length > 0) {
      setStock([...waste].reverse());
      setWaste([]);
      setMoves(prev => prev + 1);
    }
  };

  const handleCardClick = (pile: string, index: number) => {
    if (selectedCard) {
      // Try to move the selected card
      moveCard(selectedCard, { pile, index });
      setSelectedCard(null);
    } else {
      // Select a card
      if (pile === 'waste' && index === waste.length - 1) {
        setSelectedCard({ pile, index });
      } else if (pile.startsWith('tableau') && index === tableau[parseInt(pile.slice(-1))].length - 1) {
        setSelectedCard({ pile, index });
      }
    }
  };

  const moveCard = (from: { pile: string, index: number }, to: { pile: string, index: number }) => {
    let sourceCard: Card | null = null;
    
    // Get the source card
    if (from.pile === 'waste') {
      sourceCard = waste[from.index];
    } else if (from.pile.startsWith('tableau')) {
      const tableauIndex = parseInt(from.pile.slice(-1));
      sourceCard = tableau[tableauIndex][from.index];
    }

    if (!sourceCard) return;

    // Try to place on foundation
    if (to.pile.startsWith('foundation')) {
      const foundationIndex = parseInt(to.pile.slice(-1));
      if (canPlaceOnFoundation(sourceCard, foundations[foundationIndex])) {
        const newFoundations = [...foundations];
        newFoundations[foundationIndex] = [...newFoundations[foundationIndex], sourceCard];
        setFoundations(newFoundations);
        
        // Remove from source
        if (from.pile === 'waste') {
          setWaste(prev => prev.slice(0, -1));
        } else if (from.pile.startsWith('tableau')) {
          const tableauIndex = parseInt(from.pile.slice(-1));
          const newTableau = [...tableau];
          newTableau[tableauIndex] = newTableau[tableauIndex].slice(0, -1);
          setTableau(newTableau);
        }
        
        setMoves(prev => prev + 1);
      }
    }
    // Try to place on tableau
    else if (to.pile.startsWith('tableau')) {
      const tableauIndex = parseInt(to.pile.slice(-1));
      if (canPlaceOnTableau(sourceCard, tableau[tableauIndex])) {
        const newTableau = [...tableau];
        newTableau[tableauIndex] = [...newTableau[tableauIndex], sourceCard];
        setTableau(newTableau);
        
        // Remove from source
        if (from.pile === 'waste') {
          setWaste(prev => prev.slice(0, -1));
        } else if (from.pile.startsWith('tableau')) {
          const sourceTableauIndex = parseInt(from.pile.slice(-1));
          newTableau[sourceTableauIndex] = newTableau[sourceTableauIndex].slice(0, -1);
        }
        
        setMoves(prev => prev + 1);
      }
    }
  };

  useEffect(() => {
    newGame();
  }, [newGame]);

  useEffect(() => {
    // Check if game is won
    const totalFoundationCards = foundations.reduce((sum, foundation) => sum + foundation.length, 0);
    if (totalFoundationCards === 52) {
      setGameWon(true);
    }
  }, [foundations]);

  return (
    <div className="solitaire-app">
      <div className="solitaire-header">
        <h1>Solitaire</h1>
        <div className="game-stats">
          <span>Moves: {moves}</span>
          <button onClick={newGame} className="new-game-btn">
            New Game
          </button>
        </div>
      </div>

      {gameWon && (
        <div className="win-message">
          🎉 Congratulations! You won in {moves} moves! 🎉
        </div>
      )}

      <div className="solitaire-board">
        <div className="top-area">
          <div className="stock-waste">
            <div 
              className="stock pile"
              onClick={drawFromStock}
              role="button"
              tabIndex={0}
              aria-label={`Stock pile: ${stock.length} cards remaining`}
            >
              {stock.length > 0 ? '🂠' : '⭕'}
            </div>
            <div className="waste pile">
              {waste.length > 0 && (
                <div 
                  className={`card ${selectedCard?.pile === 'waste' ? 'selected' : ''}`}
                  onClick={() => handleCardClick('waste', waste.length - 1)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${waste[waste.length - 1].rank} of ${waste[waste.length - 1].suit}`}
                >
                  <span className={`card-content ${waste[waste.length - 1].color}`}>
                    {waste[waste.length - 1].rank}{waste[waste.length - 1].suit}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="foundations">
            {foundations.map((foundation, index) => (
              <div 
                key={index}
                className="foundation pile"
                onClick={() => handleCardClick(`foundation${index}`, foundation.length)}
                role="button"
                tabIndex={0}
                aria-label={`Foundation ${index + 1}: ${foundation.length} cards`}
              >
                {foundation.length > 0 ? (
                  <div className="card">
                    <span className={`card-content ${foundation[foundation.length - 1].color}`}>
                      {foundation[foundation.length - 1].rank}{foundation[foundation.length - 1].suit}
                    </span>
                  </div>
                ) : (
                  <div className="empty-foundation">
                    {suits[index]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="tableau">
          {tableau.map((column, columnIndex) => (
            <div key={columnIndex} className="tableau-column">
              {column.map((card, cardIndex) => (
                <div 
                  key={card.id}
                  className={`card ${selectedCard?.pile === `tableau${columnIndex}` && selectedCard?.index === cardIndex ? 'selected' : ''}`}
                  style={{ top: `${cardIndex * 20}px` }}
                  onClick={() => handleCardClick(`tableau${columnIndex}`, cardIndex)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${card.rank} of ${card.suit}`}
                >
                  <span className={`card-content ${card.color}`}>
                    {card.rank}{card.suit}
                  </span>
                </div>
              ))}
              {column.length === 0 && (
                <div 
                  className="empty-tableau"
                  onClick={() => handleCardClick(`tableau${columnIndex}`, 0)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Empty tableau column ${columnIndex + 1}`}
                >
                  👑
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}