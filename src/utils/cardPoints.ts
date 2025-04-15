export const CARD_POINTS: Record<string, number> = {
    'A': 4,
    'K': 3,
    'Q': 2,
    'J': 1
};

export function getCardPoints(card: string): number {
    return CARD_POINTS[card] || 0;
} 