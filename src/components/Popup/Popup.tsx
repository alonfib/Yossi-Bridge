import React, { useEffect } from 'react';
import './Popup.scss';

interface PopupProps {
    message: string;
    isCorrect: boolean;
    onClose: () => void;
}

export const Popup: React.FC<PopupProps> = ({ message, isCorrect, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 2000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`popup ${isCorrect ? 'correct' : 'wrong'}`}>
            {message}
        </div>
    );
}; 