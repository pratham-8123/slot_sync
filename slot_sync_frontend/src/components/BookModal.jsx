// Modal.jsx
import React from 'react';
import './BookModal.css';

export default function BookModal({ show, handleClose, handleConfirm }) {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>Are you sure you want to book this slot ?</p>
        <div className="modal-buttons">
          <button onClick={handleConfirm} className='popup-button'>Yes</button>
          <button onClick={handleClose} className='popup-button'>No</button>
        </div>
      </div>
    </div>
  );
}
