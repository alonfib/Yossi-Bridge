import React, { useState, useEffect } from 'react';
import { GameState, BidLevel } from '../types/game';
import './Game.scss';
import { generateValidDeal } from '../utils/utils';
import { Hand } from './Hand/Hand';
import { BiddingTypeMenu } from './bidding/BiddingTypeMenu';
import { handleBid } from '../utils/game';
import useHandleBid from '../hooks/useHandleBid';
import BiddingBox from './BiddingBox/BiddingBox';



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
    const { selectedLevel, selectedSuit, setSelectedLevel, setSelectedSuit, resetAnswer } = useHandleBid({
        hand: gameState.hands.North,
        onAnswerSubmitted: (isValid: boolean) => {
            console.log('Is answer valid:', isValid);
        }
    });
    const startNewGame = () => {
        resetAnswer();
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

    useEffect(() => {
        startNewGame();
    }, []);

    useEffect(() => {
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
            <BiddingBox selectedLevel={selectedLevel} selectedSuit={selectedSuit} setSelectedLevel={setSelectedLevel} setSelectedSuit={setSelectedSuit} />
            <BiddingTypeMenu />
        </div>
    );
}; 