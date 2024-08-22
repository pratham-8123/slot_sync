import React, { useEffect, useState } from 'react';
import './Bookings.css';
import { getBookedSlotsByUser, getSlotImageById, changeBookingStatus, rateSlotById } from '../api/SlotSyncApiService';
import { useAuth } from '../security/AuthContext.jsx';
import CancelModal from './CancelModal';
import CompleteModal from './CompleteModal';

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [selectedSlotId, setSelectedSlotId] = useState(null);
    const authContext = useAuth();

    async function fetchImageForBookings(bookings) {
        const bookingsWithImages = await Promise.all(
            bookings.map(async booking => {
                try {
                    const response = await getSlotImageById(booking.slotId);
                    const blob = new Blob([response.data], { type: response.headers['content-type'] });
                    const imageName = URL.createObjectURL(blob);
                    return { ...booking, image: imageName };
                } catch (error) {
                    console.error('Error fetching image:', error);
                    return { ...booking, image: '' };
                }
            })
        );
        return bookingsWithImages;
    }

    async function refreshBookings() {
        try {
            const response = await getBookedSlotsByUser(authContext.id);
            const sortedBookings = response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            const bookingsWithImages = await fetchImageForBookings(sortedBookings);
            setBookings(bookingsWithImages);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    }

    useEffect(() => {
        refreshBookings();
    });

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleCancel = (bookingId) => {
        setSelectedBookingId(bookingId);
        setIsCancelModalOpen(true);
    };

    const handleConfirmCancel = async () => {
        try {
            const statusRequest = {
                status: "CANCELLED"
            };
            const response = await changeBookingStatus(selectedBookingId, statusRequest);
            if (response.status === 200) {
                refreshBookings();
                setIsCancelModalOpen(false);
            }
        } catch (error) {
            console.error('Error canceling booking:', error);
        }
    };

    const handleComplete = (bookingId, slotId) => {
        setSelectedBookingId(bookingId);
        setSelectedSlotId(slotId);
        setIsCompleteModalOpen(true);
    };

    const handleSubmitRating = async (givenRating) => {
        try {
            const ratingRequest = {
                rating: givenRating
            };
            const response = await rateSlotById(selectedSlotId, ratingRequest);
            if (response.status === 200) {
                const statusRequest = {
                    status: "COMPLETED"
                };
                await changeBookingStatus(selectedBookingId, statusRequest);
                refreshBookings();
                setIsCompleteModalOpen(false);
            }
        } catch (error) {
            console.error('Error completing booking:', error);
        }
    };

    return (
        <div className="bookings-container">
            {bookings.length > 0 ? (
                <div className="bookings-list">
                    <div className="booking-headers">
                        <span className="booking-header1"></span>
                        <span className="booking-header2">Workshop</span>
                        <span className="booking-header3">Description</span>
                        <span className="booking-header4">Booked Date and Time</span>
                        <span className="booking-header5"></span>
                    </div>
                    {bookings.map((booking) => (
                        <div key={booking.id} className="booking-item">
                            <div className="booking-image-cell">
                                <img src={booking.image} alt={booking.slotTitle} className="booking-image" />
                            </div>
                            <div className="booking-title">{booking.slotTitle}</div>
                            <div className="booking-description">{booking.slotDescription}</div>
                            <div className="booking-date">{formatDate(booking.date)}</div>
                            <div className="booking-status">
                                {booking.status === 'CONFIRMED' && (
                                    <>
                                        <button className="status-button confirmed" onClick={() => handleCancel(booking.id)}>Cancel</button>
                                        <button className="status-button complete" onClick={() => handleComplete(booking.id, booking.slotId)}>Complete</button>
                                    </>
                                )}
                                {booking.status === 'CANCELLED' && (
                                    <button className="status-button cancelled">Cancelled</button>
                                )}
                                {booking.status === 'COMPLETED' && (
                                    <button className="status-button completed">Completed</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No bookings found.</p>
            )}

            <CancelModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
            />

            <CompleteModal
                isOpen={isCompleteModalOpen}
                onClose={() => setIsCompleteModalOpen(false)}
                onSubmit={handleSubmitRating}
            />
            <div className="footer-space" />
        </div>
    );
}