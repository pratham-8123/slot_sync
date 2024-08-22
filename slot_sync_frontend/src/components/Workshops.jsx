import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Workshops.css';
import { bookSlot, fetchAllSlots, addToFavourites } from '../api/SlotSyncApiService'; // Import the new API service
import WorkshopGrid from './WorkshopGrid';
import BookModal from './BookModal.jsx';
import ConfirmationModal from './ConfirmationModal.jsx';
import { useAuth } from '../security/AuthContext.jsx';
import heartIcon from '../assets/icons/heart.svg';

export default function Workshops() {
  const authContext = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [workshops, setWorkshops] = useState([]);
  const [displayedWorkshops, setDisplayedWorkshops] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const observer = useRef();

  const fetchWorkshops = async () => {
    try {
      const response = await fetchAllSlots();
      const data = await response.data.data.sort((a, b) => a.id - b.id); // Sort by id
      setWorkshops(data);
      setDisplayedWorkshops(data.slice(0, 6));
      setPage(1); // Reset page to 1
      if (data.length <= 6) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error('Error fetching workshops:', error);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const lastWorkshopElementRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore]);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query === '') {
      setDisplayedWorkshops(workshops.slice(0, 6));
      setHasMore(true);
    } else {
      const filteredWorkshops = workshops.filter((workshop) =>
        workshop.title.toLowerCase().includes(query.toLowerCase())
      );
      setDisplayedWorkshops(filteredWorkshops.slice(0, 6));
      setHasMore(filteredWorkshops.length > 6);
    }

    setPage(1);
  };

  useEffect(() => {
    if (page > 1) {
      const start = (page - 1) * 6;
      const end = page * 6;

      if (searchQuery === '') {
        setDisplayedWorkshops((prevWorkshops) => [
          ...prevWorkshops,
          ...workshops.slice(start, end),
        ]);
      } else {
        const filteredWorkshops = workshops.filter((workshop) =>
          workshop.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setDisplayedWorkshops((prevWorkshops) => [
          ...prevWorkshops,
          ...filteredWorkshops.slice(start, end),
        ]);
      }
    }
  }, [page, workshops, searchQuery]);

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

  const handleWorkshopBook = (workshop) => {
    setSelectedWorkshop(workshop);
    setShowModal(true);
  };

  const handleAddToFavourites = async (workshop) => {
    try {
      const favouriteRequest = {
        slotId: workshop.id,
      };
      await addToFavourites(authContext.id, favouriteRequest);
      setConfirmationMessage('Workshop added to Favourites');
      setShowConfirmationModal(true);
    } catch (error) {
      console.error('Error adding to favourites:', error);
      setConfirmationMessage('Failed to add workshop to Favourites');
      setShowConfirmationModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmModal = async () => {
    try {
      const bookingRequest = {
        userId: authContext.id,
        slotId: selectedWorkshop.id,
        username: authContext.username,
        slotTitle: selectedWorkshop.title,
        slotDescription: selectedWorkshop.description
      };
      await bookSlot(bookingRequest);
      setShowModal(false);
      setConfirmationMessage('Workshop booked successfully');
      setShowConfirmationModal(true);
      await fetchWorkshops(); // Refresh the list after successful booking
      setPage(1); // Reset page to 1 after fetching new workshops
    } catch (error) {
      console.error('Error confirming workshop:', error);
      setConfirmationMessage('Failed to book the workshop');
      setShowModal(false);
      setShowConfirmationModal(true);
    }
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  return (
    <div className="workshops-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Workshop Title"
          className="search-here"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="workshops-grid">
        {displayedWorkshops.map((workshop, index) => (
          <div
            key={workshop.id}
            ref={index === displayedWorkshops.length - 1 ? lastWorkshopElementRef : null}
            className="workshop-card"
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
            <div className="workshop-buttons">
              <button className="book-button" onClick={() => handleWorkshopBook(workshop)}>Book</button>
              <img src={heartIcon} className="add-favorite-icon" onClick={() => handleAddToFavourites(workshop)} alt=""/>
            </div>
          </div>
        ))}
        {searchQuery !== '' && displayedWorkshops.length === 0 && (
          <div className="no-results">
            <p>No workshops found "{searchQuery}"</p>
          </div>
        )}
      </div>
      <BookModal show={showModal} handleClose={handleCloseModal} handleConfirm={handleConfirmModal} />
      <ConfirmationModal show={showConfirmationModal} message={confirmationMessage} handleClose={handleCloseConfirmationModal} />
      <div className="footer-space" />
    </div>
  );
}
