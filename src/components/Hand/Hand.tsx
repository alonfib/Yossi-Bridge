import React from 'react';
import { CardType, CARD_SUITS } from '../../types/card';
import { PlayerPosition } from '../../types/game';
import './Hand.scss';
import SuitGroup from './SuitGroup';
import { getHighCardPoints } from '../../utils/handEvaluation';

interface HandProps {
    position: PlayerPosition;
    cards: CardType[];
    showPoints?: boolean;
}

export const Hand: React.FC<HandProps> = ({ position, cards, showPoints }) => {
    const points = showPoints ? getHighCardPoints(cards) : null;

    return (
        <div className={`hand ${position.toLowerCase()}`}>
            <h3>{position}{points !== null ? ` (${points} HCP)` : ''}</h3>
            <div className="cards">
                {CARD_SUITS.map(suit => (
                    <SuitGroup key={suit} cards={cards} suit={suit} position={position} />
                ))}
            </div>
        </div>
    );
};
