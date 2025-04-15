import { useEffect, useState } from 'react';
import { BidLevel } from '../types/game';
import { CardType, Suit } from '../types/card';
import { isValidBid } from '../utils/handEvaluation';

type UseHandleBidProps = {
    hand: CardType[];
}

const useHandleBid = ({ hand }: UseHandleBidProps) => {
    const [selectedLevel, setSelectedLevel] = useState<BidLevel | null>(null);
    const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);
    /** undefined means the bid is not yet submitted */
    const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);

    const resetAnswer = () => {
        setSelectedLevel(null);
        setSelectedSuit(null);
    }

    useEffect(() => {
        if (selectedLevel && selectedSuit) {
            const isValid = isValidBid(hand, selectedLevel, selectedSuit);
            setIsCorrect(isValid);
        } else if (selectedSuit === 'PASS') {
            const isValid = isValidBid(hand, undefined, 'PASS');
            setIsCorrect(isValid);
        }
    }, [selectedLevel, selectedSuit, hand]);

    return { selectedLevel, selectedSuit, isCorrect, resetAnswer };
};

export default useHandleBid;