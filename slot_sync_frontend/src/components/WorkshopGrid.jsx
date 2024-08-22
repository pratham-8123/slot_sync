import React, { useState, useEffect } from 'react';
import './WorkshopGrid.css'; // Import CSS for styling
import { getSlotImage } from '../api/SlotSyncApiService.js';
import starIcon from '../assets/icons/star.svg';

const WorkshopGrid = ({ title, description, date, time, duration, noOfRatings, rating, availableSlots, imageUrl }) => {
  const [image, setImage] = useState(''); // Initialize with ''

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await getSlotImage(imageUrl);
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const imageName = URL.createObjectURL(blob);
        setImage(imageName);
      } catch (error) {
        console.error('Error fetching the image:', error);
      }
    };

    fetchImage();
  }, [imageUrl]);

  return (
    <div className="workshop-item" style={{ backgroundImage: `url(${image})` }}>
        <div className="overlay">
          <div className="overlay-inside-box">
            <h2>{title}</h2>
            <p>{description}</p>
            <ul>
              <li>{date} at {time}</li>
              <li>{duration} minutes workshop</li>
              <li>{availableSlots} more slots available</li>
            </ul>
            <img src={starIcon} className='star-icon' alt=""/>
            <div className='rating-text'>{rating}</div>
          </div>
        </div>
    </div>
  );
};

export default WorkshopGrid;
