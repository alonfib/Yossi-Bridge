import React, { useState } from 'react';
import './BiddingTypeMenu.scss';

export const BiddingTypeMenu: React.FC = () => {
    const [selectedBidTypes, setSelectedBidTypes] = useState<Set<string>>(new Set());

    const handleCheckboxChange = (value: string) => {
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
            <label className="bid-type-option">
                <input
                    type="checkbox"
                    checked={selectedBidTypes.has("1NT")}
                    onChange={() => handleCheckboxChange("1NT")}
                />
                <span className="bid-type-text">
                    NT
                </span>
            </label>
            <label className="bid-type-option">
                <input
                    type="checkbox"
                    checked={selectedBidTypes.has("1M")}
                    onChange={() => handleCheckboxChange("1M")}
                />
                <span className="bid-type-text">
                    1♥/1♠
                </span>
            </label>
            <label className="bid-type-option">
                <input
                    type="checkbox"
                    checked={selectedBidTypes.has("1m")}
                    onChange={() => handleCheckboxChange("1m")}
                />
                <span className="bid-type-text">
                    1♣/1♦
                </span>
            </label>
        </div>
    );
}; 