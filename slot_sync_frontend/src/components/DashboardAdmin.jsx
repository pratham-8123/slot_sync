import React, { useEffect, useState } from 'react';
import './DashboardAdmin.css';
import { fetchUsersCount, fetchBookingsCount, fetchSlotsCount, fetchMostLikedSlot, fetchMostBookedSlot, fetchMostRatedSlot } from '../api/SlotSyncApiService';

const DashboardAdmin = () => {
  const [noOfSlots, setNoOfSlots] = useState(0);
  const [noOfUsers, setNoOfUsers] = useState(0);
  const [noOfBookings, setNoOfBookings] = useState(0);

  const [mostLikedSlot, setMostLikedSlot] = useState('N/A');
  const [mostBookedSlot, setMostBookedSlot] = useState('N/A');
  const [mostRatedSlot, setMostRatedSlot] = useState('N/A');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersCountResponse = await fetchUsersCount();
        setNoOfUsers(usersCountResponse.data.data);

        const slotsCountResponse = await fetchSlotsCount();
        setNoOfSlots(slotsCountResponse.data.data);

        const bookingsCountResponse = await fetchBookingsCount();
        setNoOfBookings(bookingsCountResponse.data.data);

        const mostBookedSlotResponse = await fetchMostBookedSlot();
        setMostBookedSlot(mostBookedSlotResponse.data);

        const mostRatedSlotResponse = await fetchMostRatedSlot();
        setMostRatedSlot(mostRatedSlotResponse.data);

        const mostLikedSlotResponse = await fetchMostLikedSlot();
        setMostLikedSlot(mostLikedSlotResponse.data.data);

      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-admin">
      <div className="row">
        <div className="counter">
          <h3>Number of Slots</h3>
          <p>{noOfSlots}</p>
        </div>
        <div className="counter">
          <h3>Number of Users</h3>
          <p>{noOfUsers}</p>
        </div>
        <div className="counter">
          <h3>Number of Bookings</h3>
          <p>{noOfBookings}</p>
        </div>
      </div>
      <div className="row">
        <div className="counter">
          <h3>Most Liked Slot</h3>
          <p className='string-response'>{mostLikedSlot}</p>
        </div>
        <div className="counter">
          <h3>Most Booked Slot</h3>
          <p className='string-response'>{mostBookedSlot}</p>
        </div>
        <div className="counter">
          <h3>Highest Rated Slot</h3>
          <p className='string-response'>{mostRatedSlot}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
