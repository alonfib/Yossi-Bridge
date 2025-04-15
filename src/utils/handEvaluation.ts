import { CardType, Suit, CARD_SUITS, CARD_POINTS } from '../types/card';

export const getHighCardPoints = (hand: CardType[]): number => {
    return hand.reduce((sum, card) => sum + (CARD_POINTS[card.rank] || 0), 0);
};

export const getSuitLength = (hand: CardType[], suit: Suit): number => {
    return hand.filter(card => card.suit === suit).length;
};

export const isValidBid = (hand: CardType[], level?: number, suit?: Suit): boolean => {
    const points = getHighCardPoints(hand);

    // Handle pass bid (no level or suit provided)
    const isPass = suit === 'PASS';
    if (isPass) {
        // Pass is valid if you have less than 13 points
        return points < 12;
    }

    if (suit === 'NT') {
        // For NT bids, check if hand is balanced
        const suitLengths = CARD_SUITS.map(s => getSuitLength(hand, s));
        const hasSingleton = suitLengths.some(length => length === 1);
        const hasVoid = suitLengths.some(length => length === 0);
        const hasDoubletons = suitLengths.filter(length => length === 2).length;

        if (hasSingleton || hasVoid || hasDoubletons > 1) return false;

        // Check points range for NT
        if (level === 1 && points >= 15 && points <= 17) return true;
        if (level === 2 && points >= 20 && points <= 22) return true;
        if (level === 3 && points >= 25) return true;
        return false;
    } else if (suit) {
        // For suit bids
        const suitLength = getSuitLength(hand, suit);

        // Check if suit length is valid
        if (suit === '♠' || suit === '♥') {
            // Major suits require 5+ cards
            if (suitLength < 5) return false;
        } else {
            // Minor suits require 3+ cards
            if (suitLength < 3) return false;
        }

        // Check points range for suit bids
        if (level === 1 && points >= 13 && points <= 21) return true;
        if (level === 2 && points >= 5 && points <= 9) return true;
        if (level === 3 && points >= 5 && points <= 9) return true;
        return false;
    }
    return false;
}; 