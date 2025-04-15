import { CardType, Suit } from "../../../types/card";
import { PlayerPosition } from "../../../types/game";
import { Card } from "../../card/Card";
import './SuitGroup.scss';

type SuitGroupProps = {
    cards: CardType[];
    suit: Suit;
    position: PlayerPosition;
}


export const SuitGroup: React.FC<SuitGroupProps> = ({ cards, suit, position }) => {
    const suitCards = cards.filter(card => card.suit === suit);
    if (suitCards.length === 0) return null;
    const isEastWest = position === 'East' || position === 'West';

    return (
        <div className={`suit-group ${isEastWest ? 'east-west' : 'north-south'} ${position}`}>
            {suitCards.map(card => (
                <Card key={`${card.rank}${card.suit}`} card={card} />
            ))}
        </div>
    );
};