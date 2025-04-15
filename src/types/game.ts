import { CardType, Suit } from './card';

export type PlayerPosition = 'North' | 'East' | 'South' | 'West';

export type BidLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type BidType = 'bid' | 'pass' | 'double' | 'redouble';

export interface Bid {
    type: BidType;
    level?: BidLevel;
    suit?: Suit;
    player: PlayerPosition;
}

export interface GameState {
    hands: Record<PlayerPosition, CardType[]>;
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
        cards: CardType[];
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