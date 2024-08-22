import React, { useState } from 'react';
import './CompleteModal.css';

const CompleteModal = ({ isOpen, onClose, onSubmit }) => {
    const [rating, setRating] = useState(1);

    const handleStarClick = (star) => {
        setRating(star);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>Please rate the workshop?</p>
                <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`star ${star <= rating ? 'filled' : ''}`}
                            onClick={() => handleStarClick(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <div className="modal-buttons">
                    <button onClick={() => onSubmit(rating)} className="modal-button submit">Submit</button>
                    <button onClick={onClose} className="modal-button cancel">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default CompleteModal;
