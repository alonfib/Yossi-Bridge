import { CardType, CARD_SUITS, CARD_RANKS } from '../types/card';

export const createDeck = (): CardType[] => {
    const deck: CardType[] = [];
    for (const suit of CARD_SUITS) {
        for (const rank of CARD_RANKS) {
            deck.push({ suit, rank });
        }
    }
    return deck;
};

export const shuffleDeck = (deck: CardType[]): CardType[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export const dealHands = (deck: CardType[]): CardType[][] => {
    const hands: CardType[][] = [[], [], [], []];
    for (let i = 0; i < 52; i++) {
        hands[i % 4].push(deck[i]);
    }
    return hands;
};

export const sortHand = (hand: CardType[]): CardType[] => {
    return [...hand].sort((a, b) => {
        if (a.suit !== b.suit) {
            return CARD_SUITS.indexOf(a.suit) - CARD_SUITS.indexOf(b.suit);
        }
        return CARD_RANKS.indexOf(a.rank) - CARD_RANKS.indexOf(b.rank);
    });
}; 