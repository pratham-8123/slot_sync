package com.project.slotsync.service;

import com.project.slotsync.constants.ApiResponse;
import com.project.slotsync.constants.BookingStatus;
import com.project.slotsync.model.Booking;
import com.project.slotsync.model.Slot;
import com.project.slotsync.model.User;
import com.project.slotsync.repository.BookingRepository;
import com.project.slotsync.repository.SlotRepository;
import com.project.slotsync.repository.UserRepository;
import com.project.slotsync.request.CreateBookingRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private UserRepository userRepository;

    public ApiResponse<Booking> bookSlot(CreateBookingRequest request) {
        User user = userRepository.findById(request.getUserId()).orElse(null);
        Slot slot = slotRepository.findById(request.getSlotId()).orElse(null);

        if (user != null && slot != null) {
            if (slot.getMaxParticipants() - slot.getCurrParticipants() > 0) {
                Booking booking = bookingRepository.save(new Booking(LocalDateTime.now(), request.getSlotId(), BookingStatus.CONFIRMED, request.getUserId(), request.getUsername(), request.getSlotTitle(), request.getSlotDescription()));
                slot.setCurrParticipants(slot.getCurrParticipants() + 1);
                slotRepository.save(slot);
                return new ApiResponse<>("Booked slot successfully", booking);
            } else {
                return new ApiResponse<>("No more bookings allowed", null);
            }
        } else {
            return new ApiResponse<>("Invalid slot or user", null);
        }
    }

    public ApiResponse<Booking> changeStatusOfBooking(Long id, String status) {
        Optional<Booking> existingBooking = bookingRepository.findById(id);
        if (existingBooking.isPresent()) {
            Booking newBooking = existingBooking.get();
            if (status != null) {
                if (status.equalsIgnoreCase("completed")) {
                    newBooking.setStatus(BookingStatus.COMPLETED);
                    bookingRepository.save(newBooking);
                    return new ApiResponse<>("Status changed successfully", newBooking);
                } else if (status.equalsIgnoreCase("cancelled")) {
                    newBooking.setStatus(BookingStatus.CANCELLED);
                    bookingRepository.save(newBooking);
                    return new ApiResponse<>("Status changed successfully", newBooking);
                } else {
                    return new ApiResponse<>("Invalid status (Cancelled/Completed)", null);
                }
            } else {
                return new ApiResponse<>("Provide status to change", null);
            }
        } else {
            return new ApiResponse<>("No booking found to update", null);
        }
    }

    public ApiResponse<List<Booking>> showAllBookingsForSlot(Long id) {
        List<Booking> allBookings = bookingRepository.findBySlotId(id);
        if (allBookings.isEmpty()) {
            return new ApiResponse<>("No bookings found", null);
        } else {
            return new ApiResponse<>("Bookings' details fetched successfully", allBookings);
        }
    }

    public ApiResponse<List<Booking>> showAllBookingsByUser(Long id) {
        List<Booking> allBookings = bookingRepository.findByUserId(id);
        if (allBookings.isEmpty()) {
            return new ApiResponse<>("No bookings found", null);
        } else {
            return new ApiResponse<>("Bookings' details fetched successfully", allBookings);
        }
    }

    public ApiResponse<List<Booking>> showAllBookings() {
        List<Booking> allBookings = bookingRepository.findAll();
        if (allBookings.isEmpty()) {
            return new ApiResponse<>("No bookings found", null);
        } else {
            return new ApiResponse<>("Bookings' details fetched successfully", allBookings);
        }
    }

    public ApiResponse<Long> showAllBookingsCount() {
        Long count = bookingRepository.count();
        return new ApiResponse<>("Bookings' count successful", count);
    }

    public ApiResponse<String> deleteExistingBooking(Long id) {
        if (bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
            return new ApiResponse<>("Booking deleted successfully", "Deleted Booking Id: " + id);
        } else {
            return new ApiResponse<>("No booking found to delete", null);
        }
    }

    public ApiResponse<Long> getMostBookedSlotId() {
        List<Booking> bookings = bookingRepository.findAll();
        Map<Long, Integer> slotBookingCount = new HashMap<>();

        for (Booking booking : bookings) {
            Long slotId = booking.getSlotId();
            slotBookingCount.put(slotId, slotBookingCount.getOrDefault(slotId, 0) + 1);
        }

        Long mostBookedSlotId = null;
        int maxBookings = 0;

        for (Map.Entry<Long, Integer> entry : slotBookingCount.entrySet()) {
            if (entry.getValue() > maxBookings) {
                mostBookedSlotId = entry.getKey();
                maxBookings = entry.getValue();
            }
        }

        return new ApiResponse<>("Most booked slot found successfully", mostBookedSlotId);
    }
}
