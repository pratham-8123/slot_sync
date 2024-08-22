import React, { useState } from 'react';
import { createWorkshop } from '../api/SlotSyncApiService'; // Import the updated API service
import './EditModal.css'; // Assume common styles are in Modals.css

export default function CreateModal({ show, handleClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dateTime: '',
    duration: 30, // Default value
    maxParticipants: 5, // Default value
    image: null
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'duration') {
      setFormData({ ...formData, [name]: parseInt(value, 10) });
    } else if (name === 'maxParticipants') {
      setFormData({ ...formData, [name]: Math.max(parseInt(value, 10), 5) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setFormData({ ...formData, image: file });
      setErrorMessage(''); // Clear error message on valid file upload
    } else {
      setErrorMessage('Please select a valid image file (JPG or PNG).');
    }
  };

  const handleCreate = async () => {
    const { title, description, dateTime, duration, maxParticipants, image } = formData;
    if (!title || !description) {
      setErrorMessage('Title and Description are required.');
      return;
    }
    if (!dateTime) {
      setErrorMessage('Date and Time are required.');
      return;
    }
    if (!image) {
      setErrorMessage('Image is required.');
      return;
    }

    setErrorMessage(''); // Clear previous errors
    try {
      await createWorkshop(title, description, dateTime, duration, maxParticipants, image);
      handleClose();
    } catch (error) {
      console.error('Error creating workshop:', error);
      setErrorMessage('Error creating workshop. Please try again.');
    }
  };

  return (
    show && (
      <div className="modal-overlay">
        <div className="modal-content">
          <label>
            Title
            <input
              className="edit-field"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </label>
          <label>
            Description
            <input
              className="edit-field"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </label>
          <label>
            Date and Time
            <input
              className="edit-field"
              type="datetime-local"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
            />
          </label>
          <label>
            Duration
            <select
              className="edit-field"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
            >
              {[30, 60, 90, 120].map((time) => (
                <option key={time} value={time}>
                  {time} minutes
                </option>
              ))}
            </select>
          </label>
          <label>
            Maximum Participants
            <input
              className="edit-field"
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              min="5"
              onChange={handleChange}
            />
          </label>
          <label className="image-label">
            Image
            <input
              className="edit-field file-input"
              type="file"
              name="image"
              onChange={handleFileChange}
            />
          </label>
          <div className='edit-buttons'>
            <button onClick={handleCreate}>Create</button>
            <button onClick={handleClose}>Cancel</button>
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      </div>
    )
  );
}