import { BID_LEVELS, BID_SUITS } from "../../utils/utils";
import { Suit } from "../../types/card";
import { BidLevel } from "../../types/game";
import './BiddingBox.scss';

interface BiddingBoxProps {
    selectedLevel: BidLevel | null;
    selectedSuit: Suit | null;
    setSelectedLevel: (level: BidLevel) => void;
    setSelectedSuit: (suit: Suit) => void;
}

const BiddingBox = ({ selectedLevel, selectedSuit, setSelectedLevel, setSelectedSuit }: BiddingBoxProps) => {
    return (
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
                    setSelectedSuit('PASS');
                }}
            >
                PASS
            </button>
        </div>
    );
};

export default BiddingBox;