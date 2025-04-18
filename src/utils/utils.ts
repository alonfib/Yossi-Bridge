import { CARD_SUITS, CardType, Suit } from "../types/card";
import { BidLevel } from "../types/game";
import { CARD_POINTS } from "./cardPoints";
import { createDeck, dealHands, shuffleDeck, sortHand } from "./deck";

// Helper functions for hand evaluation
const getHighCardPoints = (hand: CardType[]): number => {
    return hand.reduce((sum, card) => sum + (CARD_POINTS[card.rank] || 0), 0);
};

const getSuitLength = (hand: CardType[], suit: Suit): number => {
    return hand.filter(card => card.suit === suit).length;
};

export const isValidBid = (hand: CardType[], level: BidLevel, suit: Suit | 'NT'): boolean => {
    const points = getHighCardPoints(hand);

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
};

export const generateValidDeal = (): CardType[][] => {
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

export const BID_SUITS: Suit[] = ['NT', '♠', '♥', '♦', '♣'];
export const BID_LEVELS: BidLevel[] = [1, 2, 3, 4, 5, 6, 7];