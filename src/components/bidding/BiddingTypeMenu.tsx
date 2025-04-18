import React, { useState } from 'react';
import './BiddingTypeMenu.scss';

export const BiddingTypeMenu: React.FC = () => {
    const [selectedBidTypes, setSelectedBidTypes] = useState<Set<string>>(new Set());

    const handleButtonClick = (value: string) => {
        setSelectedBidTypes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(value)) {
                newSet.delete(value);
            } else {
                newSet.add(value);
            }
            return newSet;
        });
    };

    return (
        <div className="bidding-type-menu">
            <h3>Opening Bids</h3>
            <button
                className={`bid-type-button ${selectedBidTypes.has("1NT") ? 'selected' : ''}`}
                onClick={() => handleButtonClick("1NT")}
            >
                Opening Bids
            </button>
            <button
                className={`bid-type-button ${selectedBidTypes.has("1M") ? 'selected' : ''}`}
                onClick={() => handleButtonClick("1M")}
            >
                Response with fit - M
            </button>
            <button
                className={`bid-type-button ${selectedBidTypes.has("1m") ? 'selected' : ''}`}
                onClick={() => handleButtonClick("1m")}
            >
                Response with fit
            </button>
            <button
                className={`bid-type-button ${selectedBidTypes.has("general") ? 'selected' : ''}`}
                onClick={() => handleButtonClick("general")}
            >
                General response
            </button>
        </div>
    );
}; 