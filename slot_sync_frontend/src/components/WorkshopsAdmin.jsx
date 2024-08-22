import React, { useState, useEffect, useRef, useCallback } from 'react';
import './WorkshopsAdmin.css';
import { fetchAllSlots, deleteWorkshop } from '../api/SlotSyncApiService'; // Import the new API services
import WorkshopGrid from './WorkshopGrid';
import EditModal from './EditModal.jsx';
import ConfirmationModal from './ConfirmationModal.jsx';
import CreateModal from './CreateModal.jsx';
import deleteIcon from '../assets/icons/delete.svg';

export default function WorkshopsAdmin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [workshops, setWorkshops] = useState([]);
  const [displayedWorkshops, setDisplayedWorkshops] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const observer = useRef();

  const fetchWorkshops = async () => {
    try {
      const response = await fetchAllSlots();
      const data = await response.data.data.sort((a, b) => a.id - b.id);
      setWorkshops(data);
      setDisplayedWorkshops(data.slice(0, 6));
      setPage(1);
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

  const handleEditClick = (workshop) => {
    setSelectedWorkshop(workshop);
    setShowEditModal(true);
  };

  const handleCreateClick = () => {
    setShowCreateModal(true);
  };

  const handleDelete = async (workshopId) => {
    try {
      await deleteWorkshop(workshopId);
      setConfirmationMessage('Workshop deleted successfully');
      setShowConfirmationModal(true);
      fetchWorkshops();
    } catch (error) {
      console.error('Error deleting workshop:', error);
      setConfirmationMessage('Failed to delete the workshop');
      setShowConfirmationModal(true);
    }
  };

  const handleCloseEditModal = () => {
    fetchWorkshops();
    setShowEditModal(false);
  };

  const handleCloseCreateModal = () => {
    fetchWorkshops();
    setShowCreateModal(false);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  return (
    <div className="admin-container">
      <div className="admin-search-bar">
        <input
          type="text"
          placeholder="Search by Workshop Title"
          className="admin-search-input"
          value={searchQuery}
          onChange={handleSearch}
        />
        <button className="create-button" onClick={handleCreateClick}>Create New Workshop</button>
      </div>
      <div className="admin-workshops-grid">
        {displayedWorkshops.map((workshop, index) => (
          <div
            key={workshop.id}
            ref={index === displayedWorkshops.length - 1 ? lastWorkshopElementRef : null}
            className="admin-workshop-card"
          >
            <WorkshopGrid
              key={workshop.id}
              title={workshop.title}
              description={workshop.description}
              date={new Date(workshop.date).toLocaleDateString('en-GB')}
              time={new Date(workshop.date).toLocaleTimeString('en-US')}
              duration={workshop.duration}
              noOfRatings={workshop.noOfRatings}
              rating={workshop.currRating / workshop.noOfRatings}
              availableSlots={workshop.maxParticipants - workshop.currParticipants}
              imageUrl={workshop.imageUrl}
            />
            <div className="admin-workshop-buttons">
              <button className="edit-button" onClick={() => handleEditClick(workshop)}>Edit</button>
              <img src={deleteIcon} className="delete-icon" onClick={() => handleDelete(workshop.id)} alt="" />
            </div>
          </div>
        ))}
        {searchQuery !== '' && displayedWorkshops.length === 0 && (
          <div className="admin-no-results">
            <p>No workshops found "{searchQuery}"</p>
          </div>
        )}
      </div>
      <EditModal show={showEditModal} handleClose={handleCloseEditModal} workshop={selectedWorkshop} />
      <CreateModal show={showCreateModal} handleClose={handleCloseCreateModal} />
      <ConfirmationModal show={showConfirmationModal} message={confirmationMessage} handleClose={handleCloseConfirmationModal} />
      <div className="footer-space" />
    </div>
  );
}