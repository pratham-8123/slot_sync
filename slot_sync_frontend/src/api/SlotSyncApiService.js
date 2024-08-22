import { apiClient } from "./ApiClient";

export const signin
                = (signinRequest) => apiClient.post(`/api/auth/signin`, signinRequest);

export const signup
                = (signupRequest) => apiClient.post(`/api/auth/signup`, signupRequest);
                
export const fetchUserByUsername
                = (username) => apiClient.get(`/api/users/username/${username}`);

export const fetchUsersCount
                = () => apiClient.get(`/api/users/count`);

export const fetchSlotsCount
                = () => apiClient.get(`/api/slots/count`); 

export const fetchBookingsCount
                = () => apiClient.get(`/api/bookings/count`); 

export const fetchMostLikedSlot
                = () => apiClient.get(`/api/slots/most-liked`);

export const fetchMostRatedSlot
                = () => apiClient.get(`/api/slots/most-rated`); 

export const fetchMostBookedSlot
                = () => apiClient.get(`/api/bookings/most-booked`); 

export const verifyUsername
                = (username) => apiClient.get(`/api/users/verify/username/${username}`);
                
export const fetchAllSlots
                = () => apiClient.get(`/api/slots`); 

export const rateSlotById
                = (slotId, ratingRequest) => apiClient.put(`/api/slots/rating/${slotId}`, ratingRequest); 

export const bookSlot
                = (bookingRequest) => apiClient.post(`/api/bookings`, bookingRequest);

export const getBookedSlotsByUser
                = (userId) => apiClient.get(`/api/bookings/users/${userId}`);

export const getBookedSlots
                = (userId) => apiClient.get(`/api/bookings`);

export const addToFavourites
                = (userId, favouriteRequest) => apiClient.put(`/api/users/id/${userId}/favourites`, favouriteRequest);

export const showFavorites
                = (userId) => apiClient.get(`/api/users/id/${userId}/favourites`);

export const deleteFromFavorites
                = (userId, favouriteRequest) => apiClient.put(`/api/users/id/${userId}/favourites/remove`, favouriteRequest);

export const getSlotImage
                = (imageName) => apiClient.get(`/api/slots/view/images/${imageName}`, {
                    responseType: 'arraybuffer',
                });

export const getSlotImageById
                = (slotId) => apiClient.get(`/api/slots/view/images/id/${slotId}`, {
                    responseType: 'arraybuffer',
                });

export const changeBookingStatus
                = (bookingId, statusRequest) => apiClient.put(`/api/bookings/${bookingId}`, statusRequest);

export const updateWorkshop
                = (slotId, updateRequest) => apiClient.put(`/api/slots/${slotId}`, updateRequest);

export const deleteWorkshop
                = (slotId) => apiClient.delete(`/api/slots/${slotId}`);

                export const createWorkshop = async (title, description, dateTime, duration, maxParticipants, image) => {
                    const formData = new FormData();
                    formData.append('title', title);
                    formData.append('description', description);
                    formData.append('date', dateTime);
                    formData.append('duration', duration);
                    formData.append('maxParticipants', maxParticipants);
                    formData.append('image', image);
                  
                    try {
                      const response = await apiClient.post('/api/slots', formData, {
                        headers: {
                          'Content-Type': 'multipart/form-data',
                        },
                      });
                      return response.data;
                    } catch (error) {
                      throw error;
                    }
                  };

