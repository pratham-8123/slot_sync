import React from 'react';
import './CompleteModal.css';

const CancelModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>Do you want to cancel the booking?</p>
                <div className="modal-buttons">
                    <button onClick={onConfirm} className="modal-button sure">Sure</button>
                    <button onClick={onClose} className="modal-button cancel">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default CancelModal;