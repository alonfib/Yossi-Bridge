import React, { useState, useEffect } from 'react';
import { createDeck, shuffleDeck, dealHands, sortHand } from '../utils/deck';
import { GameState, PlayerPosition, BidLevel, Bid } from '../types/game';
import { Card as CardType, Suit, CARD_POINTS } from '../types/card';
import './Game.scss';

const CARD_SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
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

// Helper functions for hand evaluation
const getHighCardPoints = (hand: CardType[]): number => {
    return hand.reduce((sum, card) => sum + (CARD_POINTS[card.rank] || 0), 0);
};

const generateValidDeal = (): CardType[][] => {
    let attempts = 0;
    const maxAttempts = 1000;

    while (attempts < maxAttempts) {
        const deck = shuffleDeck(createDeck());
        const hands = dealHands(deck);
        const northHand = hands[0];
        const points = getHighCardPoints(northHand);

        if (points >= 12) {
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
                {CARD_SUITS.map(suit => (
                    <SuitGroup key={suit} cards={cards} suit={suit} position={position} />
                ))}
            </div>
        </div>
    );
};

const BiddingTypeMenu: React.FC = () => {
    const [selectedBidTypes, setSelectedBidTypes] = useState<Set<string>>(new Set());

    const handleCheckboxChange = (value: string) => {
        setSelectedBidTypes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(value)) {
                newSet.delete(value);
            } else {
                newSet.add(value);
            }
            return newSet;
        });
    };

    return (
        <div className="bidding-type-menu">
            <h3>Opening Bids</h3>
            <label className="bid-type-option">
                <input
                    type="checkbox"
                    checked={selectedBidTypes.has("1NT")}
                    onChange={() => handleCheckboxChange("1NT")}
                />
                <span className="bid-type-text">
                    NT
                </span>
            </label>
            <label className="bid-type-option">
                <input
                    type="checkbox"
                    checked={selectedBidTypes.has("1M")}
                    onChange={() => handleCheckboxChange("1M")}
                />
                <span className="bid-type-text">
                    1♥/1♠
                </span>
            </label>
            <label className="bid-type-option">
                <input
                    type="checkbox"
                    checked={selectedBidTypes.has("1m")}
                    onChange={() => handleCheckboxChange("1m")}
                />
                <span className="bid-type-text">
                    1♣/1♦
                </span>
            </label>
        </div>
    );
};

export const Game: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(initialGameState);
    const [selectedLevel, setSelectedLevel] = useState<BidLevel | null>(null);
    const [selectedSuit, setSelectedSuit] = useState<Suit | 'NT' | null>(null);

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

    const handleBid = (level: BidLevel, suit: Suit | 'NT') => {
        const newBid: Bid = {
            type: 'bid',
            level,
            suit,
            player: 'North'
        };

        setGameState(prevState => ({
            ...prevState,
            bidding: [...prevState.bidding, newBid]
        }));

        setSelectedLevel(null);
        setSelectedSuit(null);
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
                        if (selectedLevel && selectedSuit) {
                            handleBid(selectedLevel, selectedSuit);
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
                </button>
            </div>
            <BiddingTypeMenu />
        </div>
    );
}; 