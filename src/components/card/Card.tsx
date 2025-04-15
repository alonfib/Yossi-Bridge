import React from 'react';
import { CardType } from '../../types/card';
import './Card.scss';

interface CardProps {
    card: CardType;
}

export const Card: React.FC<CardProps> = ({ card }) => (
    <div className="card">
        <span className="rank">{card.rank}</span>
        <span className="suit" data-suit={card.suit}>{card.suit}</span>
        <span className="rank bottom">{card.rank}</span>
    </div>
); 