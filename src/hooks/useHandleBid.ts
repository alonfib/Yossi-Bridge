import { useEffect, useState } from 'react';
import { BidLevel } from '../types/game';
import { CardType, Suit } from '../types/card';
import { isValidBid } from '../utils/handEvaluation';

type UseHandleBidProps = {
    hand: CardType[];
    onAnswerSubmitted: (isValid: boolean) => void;
}

const useHandleBid = ({ hand, onAnswerSubmitted }: UseHandleBidProps) => {
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
            onAnswerSubmitted(isValid);
        } else if (selectedSuit === 'PASS') {
            const isValid = isValidBid(hand, undefined, 'PASS');
            setIsCorrect(isValid);
            onAnswerSubmitted(isValid);
        }
    }, [selectedLevel, selectedSuit, hand, onAnswerSubmitted]);

    return { selectedLevel, selectedSuit, isCorrect, resetAnswer, setSelectedLevel, setSelectedSuit, onAnswerSubmitted };
};

export default useHandleBid;