package com.project.slotsync.controller;

import com.project.slotsync.constants.ApiResponse;
import com.project.slotsync.model.Booking;
import com.project.slotsync.model.Slot;
import com.project.slotsync.request.CreateBookingRequest;
import com.project.slotsync.request.StatusRequest;
import com.project.slotsync.service.BookingService;
import com.project.slotsync.service.SlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    public BookingService bookingService;

    @Autowired
    private SlotService slotService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Booking>> bookSlot(@RequestBody CreateBookingRequest request) {
        ApiResponse<Booking> booking = bookingService.bookSlot(request);
        if (booking.getData() != null) {
            return ResponseEntity.ok(booking);
        } else {
            if (booking.getMessage().equals("No more bookings allowed")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(booking);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(booking);
            }
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Booking>> changeStatusOfBooking(@PathVariable Long id, @RequestBody StatusRequest request) {
        ApiResponse<Booking> booking = bookingService.changeStatusOfBooking(id, request.getStatus());
        if (booking.getData() != null) {
            return ResponseEntity.ok(booking);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(booking);
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Booking>>> showAllBookings() {
        ApiResponse<List<Booking>> bookings = bookingService.showAllBookings();
        if (bookings.getData() != null) {
            return ResponseEntity.ok(bookings);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(bookings);
        }
    }

    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Long>> showAllBookingsCount() {
        ApiResponse<Long> count = bookingService.showAllBookingsCount();
        if (count.getData() != null) {
            return ResponseEntity.ok(count);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(count);
        }
    }

    @GetMapping("/slots/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Booking>>> showAllBookingsForSlot(@PathVariable Long id) {
        ApiResponse<List<Booking>> bookings = bookingService.showAllBookingsForSlot(id);
        if (bookings.getData() != null) {
            return ResponseEntity.ok(bookings);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(bookings);
        }
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<Booking>>> showAllBookingsByUser(@PathVariable Long id) {
        ApiResponse<List<Booking>> bookings = bookingService.showAllBookingsByUser(id);
        if (bookings.getData() != null) {
            return ResponseEntity.ok(bookings);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(bookings);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteExistingBooking(@PathVariable Long id) {
        ApiResponse<String> booking = bookingService.deleteExistingBooking(id);
        if (booking.getData() != null) {
            return ResponseEntity.ok(booking);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(booking);
        }
    }

    @GetMapping("/most-booked")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getMostLikedSlot() {
        ApiResponse<Long> slotId = bookingService.getMostBookedSlotId();
        if (slotId.getData() != null) {
            ApiResponse<Slot> slot = slotService.showExistingSlot(slotId.getData());
            return ResponseEntity.ok(slot.getData().getTitle());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
