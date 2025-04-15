export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = 'A' | 'K' | 'Q' | 'J' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';

export interface Card {
    suit: Suit;
    rank: Rank;
}

export const CARD_POINTS: Record<Rank, number> = {
    'A': 4,
    'K': 3,
    'Q': 2,
    'J': 1,
    '10': 0,
    '9': 0,
    '8': 0,
    '7': 0,
    '6': 0,
    '5': 0,
    '4': 0,
    '3': 0,
    '2': 0
}; 