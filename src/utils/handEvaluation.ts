import { CardType, Suit, CARD_SUITS, CARD_POINTS } from '../types/card';

export const getHighCardPoints = (hand: CardType[]): number => {
    return hand.reduce((sum, card) => sum + (CARD_POINTS[card.rank] || 0), 0);
};

export const getSuitLength = (hand: CardType[], suit: Suit): number => {
    return hand.filter(card => card.suit === suit).length;
};

export const isValidBid = (hand: CardType[], level?: number, suit?: Suit | 'NT'): boolean => {
    const points = getHighCardPoints(hand);

    // Handle pass bid (no level or suit provided)
    if (!level || !suit) {
        // Pass is valid if you have less than 12 points
        return points < 12;
    }

    // Check if points are in valid range for opening
    if (points < 12) return false;

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
    } else {
        // For suit bids
        const suitLength = getSuitLength(hand, suit);
        const diamondLength = getSuitLength(hand, '♦');
        const clubLength = getSuitLength(hand, '♣');

        // Check if suit length is valid
        if (suit === '♠' || suit === '♥') {
            // Major suits require 5+ cards
            if (suitLength < 5) return false;
        } else {
            // Minor suits require 3+ cards
            if (suitLength < 3) return false;

            // For minor suits, determine the correct bid
            if (clubLength === diamondLength) {
                // If equal length (3-3 or 4-4), clubs is the right bid
                if ((clubLength === 3 || clubLength === 4) && suit === '♦') {
                    return false; // Diamond bid is wrong when equal length
                }
                if ((clubLength === 3 || clubLength === 4) && suit === '♣') {
                    return true; // Club bid is right when equal length
                }
            } else {
                // If different lengths, bid the longer suit
                if (suit === '♣' && clubLength < diamondLength) return false;
                if (suit === '♦' && diamondLength < clubLength) return false;
            }
        }

        // Check points range for suit bids
        if (level === 1 && points >= 12 && points <= 21) return true;
        if (level === 2 && points >= 5 && points <= 9) return true;
        if (level === 3 && points >= 5 && points <= 9) return true;
        return false;
    }
}; 