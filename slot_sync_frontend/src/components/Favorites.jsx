import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Favorites.css';
import { showFavorites, deleteFromFavorites } from '../api/SlotSyncApiService';
import WorkshopGrid from './WorkshopGrid';
import ConfirmationModal from './ConfirmationModal.jsx';
import { useAuth } from '../security/AuthContext.jsx';
import trashIcon from '../assets/icons/trash.svg';

export default function Favorites() {
  const authContext = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [displayedFavorites, setDisplayedFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const observer = useRef();

  const fetchFavoriteWorkshops = useCallback(async () => {
    try {
      const response = await showFavorites(authContext.id);
      const data = await response.data.data.sort((a, b) => a.id - b.id);
      setFavorites(data);
      setDisplayedFavorites(data.slice(0, 8));
      setPage(1);
      setHasMore(data.length > 8);
    } catch (error) {
      console.error('Error fetching favorite workshops:', error);
    }
  }, [authContext.id]);

  useEffect(() => {
    fetchFavoriteWorkshops();
  }, [fetchFavoriteWorkshops]);

  const lastFavoriteElementRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore]);

  useEffect(() => {
    if (page > 1) {
      const start = (page - 1) * 8;
      const end = page * 8;
      setDisplayedFavorites((prevFavorites) => [
        ...prevFavorites,
        ...favorites.slice(start, end),
      ]);
    }
  }, [page, favorites]);

  const formatDate = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const date = dateTime.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    return `${date}`;
  };

  const formatTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const time = dateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return `${time}`;
  };

  const calculateAverageRating = (currRating, noOfRatings) => {
    if (noOfRatings === 0) return 0;
    const average = currRating / noOfRatings;
    return average.toFixed(1);
  };

  const handleRemoveFromFavourites = async (workshop) => {
    try {
      const deleteRequest = {
        slotId: workshop.id
      };
      await deleteFromFavorites(authContext.id, deleteRequest);
      setConfirmationMessage('Workshop removed from Favourites');
      setShowConfirmationModal(true);
      await fetchFavoriteWorkshops();
      setPage(1);
    } catch (error) {
      console.error('Error removing from favourites:', error);
      setConfirmationMessage('Failed to remove workshop from Favourites');
      setShowConfirmationModal(true);
    }
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  return (
    <div className="favorites-container">
      <div className="favorites-grid">
        {displayedFavorites.map((workshop, index) => (
          <div
            key={workshop.id}
            ref={index === displayedFavorites.length - 1 ? lastFavoriteElementRef : null}
            className="workshop-card-f"
          >
            <WorkshopGrid
              key={workshop.id}
              title={workshop.title}
              description={workshop.description}
              date={formatDate(workshop.date)}
              time={formatTime(workshop.date)}
              duration={workshop.duration}
              noOfRatings={workshop.noOfRatings}
              rating={calculateAverageRating(workshop.currRating, workshop.noOfRatings)}
              availableSlots={workshop.maxParticipants - workshop.currParticipants}
              imageUrl={workshop.imageUrl}
            />
            <div className="workshop-buttons-f" onClick={() => handleRemoveFromFavourites(workshop)}>
              <img src={trashIcon} className="remove-favorite-icon" alt="" />
            </div>
          </div>
        ))}
        {displayedFavorites.length === 0 && (
          <div className="no-results">
            <p>No favorite workshops found</p>
          </div>
        )}
      </div>
      <ConfirmationModal show={showConfirmationModal} message={confirmationMessage} handleClose={handleCloseConfirmationModal} />
      <div className="footer-space" />
    </div>
  );
}