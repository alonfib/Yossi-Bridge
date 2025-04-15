import React, { useState, useEffect } from 'react';
import { GameState, BidLevel } from '../types/game';
import { Suit } from '../types/card';
import './Game.scss';
import { generateValidDeal } from '../utils/utils';
import { Hand } from './Hand/Hand';
import { BiddingTypeMenu } from './bidding/BiddingTypeMenu';
import { handleBid } from '../utils/game';

const BID_SUITS: (Suit | 'NT')[] = ['♠', '♥', '♦', '♣', 'NT'];
const BID_LEVELS: BidLevel[] = [1, 2, 3, 4, 5, 6, 7];

const initialGameState: GameState = {
    hands: {
        North: [],
        East: [],
        South: [],
        West: []
    },
    currentPlayer: 'North',
    dealer: 'North',
    vulnerability: {
        NS: false,
        EW: false
    },
    bidding: [],
    contract: null,
    declarer: null,
    dummy: null,
    currentTrick: {
        cards: [],
        leader: 'North'
    },
    tricks: {
        NS: 0,
        EW: 0
    }
};

export const Game: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(initialGameState);
    const [selectedLevel, setSelectedLevel] = useState<BidLevel | null>(null);
    const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);

    useEffect(() => {
        startNewGame();

        const handleKeyPress = (e: KeyboardEvent) => {
            // Handle number keys for bid level
            if (e.key >= '1' && e.key <= '7') {
                setSelectedLevel(parseInt(e.key) as BidLevel);
            }

            // Handle suit keys
            if (e.key === 'h' || e.key === 'H') {
                setSelectedSuit('♥');
            } else if (e.key === 's' || e.key === 'S') {
                setSelectedSuit('♠');
            } else if (e.key === 'd' || e.key === 'D') {
                setSelectedSuit('♦');
            } else if (e.key === 'c' || e.key === 'C') {
                setSelectedSuit('♣');
            } else if (e.key === 'n' || e.key === 'N') {
                setSelectedSuit('NT');
            }

            // If both level and suit are selected, make the bid
            if (selectedLevel && selectedSuit) {
                handleBid({
                    level: selectedLevel,
                    suit: selectedSuit,
                    hand: gameState.hands.North,
                    setGameState,
                    setSelectedLevel,
                    setSelectedSuit
                });
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [selectedLevel, selectedSuit, handleBid]);

    const startNewGame = () => {
        const sortedHands = generateValidDeal();

        setGameState({
            ...initialGameState,
            hands: {
                North: sortedHands[0],
                East: sortedHands[1],
                South: sortedHands[2],
                West: sortedHands[3]
            }
        });
    };

    return (
        <div className="game-container">
            <Hand position="North" cards={gameState.hands.North} showPoints={true} />
            <div className="game-board">
                <div className="center-area">
                    <div className="game-controls">
                        <button onClick={startNewGame}>New Game</button>
                    </div>
                </div>
            </div>
            <div className="bidding-interface">
                <div className="bid-levels">
                    {BID_LEVELS.map(level => (
                        <button
                            key={level}
                            className={`bid-button ${selectedLevel === level ? 'selected' : ''}`}
                            onClick={() => setSelectedLevel(level)}
                        >
                            {level}
                        </button>
                    ))}
                </div>
                <div className="bid-suits">
                    {BID_SUITS.map(suit => (
                        <button
                            key={suit}
                            className={`bid-button ${selectedSuit === suit ? 'selected' : ''}`}
                            onClick={() => setSelectedSuit(suit)}
                            data-suit={suit}
                        >
                            {suit}
                        </button>
                    ))}
                </div>
                <button
                    className="submit-bid"
                    onClick={() => {
                        setSelectedSuit('PASS');
                    }}
                >
                    PASS
                </button>
                {/* <button
                    className="submit-bid"
                    onClick={() => {
                        if (selectedLevel && selectedSuit) {
                            handleBid({
                                level: selectedLevel,
                                suit: selectedSuit,
                                hand: gameState.hands.North,
                                setGameState,
                                setSelectedLevel,
                                setSelectedSuit
                            });
                        } else {
                            setGameState(prevState => ({
                                ...prevState,
                                bidding: [...prevState.bidding, { type: 'pass', player: 'North' }]
                            }));
                        }
                        setSelectedLevel(null);
                        setSelectedSuit(null);
                    }}
                >
                    PASS
                </button> */}
            </div>
            <BiddingTypeMenu />
        </div>
    );
}; 