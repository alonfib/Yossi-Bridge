import React, { useState, useEffect } from 'react';
import { createDeck, shuffleDeck, dealHands, sortHand } from '../utils/deck';
import { GameState, PlayerPosition } from '../types/game';
import { Card as CardType, Suit, CARD_POINTS } from '../types/card';
import './Game.scss';

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];

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

// Helper functions for hand evaluation
const getHighCardPoints = (hand: CardType[]): number => {
    return hand.reduce((sum, card) => sum + (CARD_POINTS[card.rank] || 0), 0);
};

const getSuitLength = (hand: CardType[], suit: Suit): number => {
    return hand.filter(card => card.suit === suit).length;
};

const isBalanced = (hand: CardType[]): boolean => {
    const suitLengths = SUITS.map(suit => getSuitLength(hand, suit));
    const hasDoubletons = suitLengths.filter(length => length === 2).length;
    const hasSingleton = suitLengths.some(length => length === 1);
    const hasVoid = suitLengths.some(length => length === 0);

    return !hasSingleton && !hasVoid && hasDoubletons <= 1;
};

const is1NTOpening = (hand: CardType[]): boolean => {
    const points = getHighCardPoints(hand);
    return points >= 15 && points <= 17 && isBalanced(hand);
};

const generateValidDeal = (): CardType[][] => {
    let attempts = 0;
    const maxAttempts = 1000;

    while (attempts < maxAttempts) {
        const deck = shuffleDeck(createDeck());
        const hands = dealHands(deck);
        const northHand = hands[0];

        if (is1NTOpening(northHand)) {
            return hands.map(sortHand);
        }
        attempts++;
    }

    // If we couldn't find a valid deal, return a regular shuffled deal
    const deck = shuffleDeck(createDeck());
    return dealHands(deck).map(sortHand);
};

interface CardProps {
    card: CardType;
}

const Card: React.FC<CardProps> = ({ card }) => (
    <div className="card">
        <span className="rank">{card.rank}</span>
        <span className="suit" data-suit={card.suit}>{card.suit}</span>
        <span className="rank bottom">{card.rank}</span>
    </div>
);

interface SuitGroupProps {
    cards: CardType[];
    suit: Suit;
    position: PlayerPosition;
}

const SuitGroup: React.FC<SuitGroupProps> = ({ cards, suit, position }) => {
    const suitCards = cards.filter(card => card.suit === suit);
    if (suitCards.length === 0) return null;
    const isEastWest = position === 'East' || position === 'West';

    return (
        <div className={`suit-group ${isEastWest ? 'east-west' : 'north-south'} ${position}`}>
            {suitCards.map(card => (
                <Card key={`${card.rank}${card.suit}`} card={card} />
            ))}
        </div>
    );
};

interface HandProps {
    position: PlayerPosition;
    cards: CardType[];
    showPoints?: boolean;
}

const Hand: React.FC<HandProps> = ({ position, cards, showPoints }) => {
    const points = showPoints ? getHighCardPoints(cards) : null;

    return (
        <div className={`hand ${position.toLowerCase()}`}>
            <h3>{position}{points !== null ? ` (${points} HCP)` : ''}</h3>
            <div className="cards">
                {SUITS.map(suit => (
                    <SuitGroup key={suit} cards={cards} suit={suit} position={position} />
                ))}
            </div>
        </div>
    );
};

export const Game: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(initialGameState);

    useEffect(() => {
        startNewGame();
    }, []);

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
            <Hand position="West" cards={gameState.hands.West} />
            <div className="game-board">
                <div className="center-area">
                    <div className="game-controls">
                        <button onClick={startNewGame}>New Game</button>
                    </div>
                </div>
            </div>
            <Hand position="East" cards={gameState.hands.East} />
            <Hand position="South" cards={gameState.hands.South} />
        </div>
    );
}; 