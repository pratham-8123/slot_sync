import React, { useState, useEffect } from 'react';
import { updateWorkshop } from '../api/SlotSyncApiService'; // Import the new API services

import './EditModal.css'; // Assume common styles are in Modals.css

export default function EditModal({ show, handleClose, workshop }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    maxParticipants: ''
  });
  
  const [initialMaxParticipants, setInitialMaxParticipants] = useState(0);

  useEffect(() => {
    if (workshop) {
      setFormData({
        title: workshop.title,
        description: workshop.description,
        duration: workshop.duration,
        maxParticipants: workshop.maxParticipants
      });
      setInitialMaxParticipants(workshop.maxParticipants); // Store initial value
    }
  }, [workshop]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConfirm = async () => {
    try {
      await updateWorkshop(workshop.id, formData);
      handleClose();
    } catch (error) {
      console.error('Error updating workshop:', error);
    }
  };

  const handleInput = (e) => {
    if (e.target.value < initialMaxParticipants) {
      e.target.value = initialMaxParticipants;
      setFormData({ ...formData, maxParticipants: initialMaxParticipants });
    }
  };

  return (
    show && (
      <div className="modal-overlay">
        <div className="modal-content">
          <label>
            Title
            <input className="edit-field" type="text" name="title" value={formData.title} onChange={handleChange} />
          </label>
          <label>
            Description
            <input className="edit-field" type="text" name="description" value={formData.description} onChange={handleChange} />
          </label>
          <label>
            Duration
            <input className="edit-field" type="text" name="duration" value={formData.duration} onChange={handleChange} />
          </label>
          <label>
            Max Participants
            <input
              className="edit-field"
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              onInput={handleInput}
              min={initialMaxParticipants}
            />
          </label>
          <div className='edit-buttons'>
            <button onClick={handleConfirm}>Confirm</button>
            <button onClick={handleClose}>Cancel</button>
          </div>
        </div>
      </div>
    )
  );
}
