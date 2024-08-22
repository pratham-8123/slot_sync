import React from 'react';
import './BookModal.css';

export default function ConfirmationModal({ show, message, handleClose }) {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={handleClose} className='popup-button'>Close</button>
        </div>
      </div>
    </div>
  );
}
