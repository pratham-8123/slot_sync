package com.project.slotsync.repository;

import com.project.slotsync.model.Booking;
import com.project.slotsync.model.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findBySlotId(Long slotId);
    List<Booking> findByUserId(Long userId);
}
