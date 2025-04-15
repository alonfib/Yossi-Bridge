import { Card, Suit } from './card';

export type PlayerPosition = 'North' | 'East' | 'South' | 'West';

export type BidLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Bid = {
    type: 'bid';
    level: BidLevel;
    suit: Suit | 'NT';
    player: PlayerPosition;
} | {
    type: 'pass';
    player: PlayerPosition;
};

export interface GameState {
    hands: Record<PlayerPosition, Card[]>;
    currentPlayer: PlayerPosition;
    dealer: PlayerPosition;
    vulnerability: {
        NS: boolean;
        EW: boolean;
    };
    bidding: Bid[];
    contract: Bid | null;
    declarer: PlayerPosition | null;
    dummy: PlayerPosition | null;
    currentTrick: {
        cards: Card[];
        leader: PlayerPosition;
    };
    tricks: {
        NS: number;
        EW: number;
    };
}

export const PLAYER_ORDER: PlayerPosition[] = ['North', 'East', 'South', 'West'];

export function getNextPlayer(current: PlayerPosition): PlayerPosition {
    const currentIndex = PLAYER_ORDER.indexOf(current);
    return PLAYER_ORDER[(currentIndex + 1) % 4];
} 