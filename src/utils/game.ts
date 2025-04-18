import { CardType, Suit } from "../types/card";
import { Bid, BidLevel, GameState } from "../types/game";
import { isValidBid } from "./handEvaluation";

type HandleBid = {
    level: BidLevel,
    suit: Suit,
    hand: CardType[],
    setGameState: (prevState: GameState) => void,
    setSelectedLevel: (level: BidLevel | null) => void,
    setSelectedSuit: (suit: Suit | null) => void,
    onBidResult?: (isValid: boolean) => void,
}

export const handleBid = (props: HandleBid) => {
    const { level, suit, hand, setGameState, setSelectedLevel, setSelectedSuit, onBidResult } = props;
    const isValid = isValidBid(hand, level, suit);

    const newBid: Bid = {
        type: 'bid',
        level,
        suit,
        player: 'North'
    };

    // @ts-expect-error need to fix this
    setGameState(prevState => ({
        ...prevState,
        bidding: [...prevState.bidding, newBid]
    }));

    setSelectedLevel(null);
    setSelectedSuit(null);

    // Call the callback if provided
    if (onBidResult) {
        onBidResult(isValid);
    }
};