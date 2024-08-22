package com.project.slotsync.model;

import com.project.slotsync.constants.BookingStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long slotId;

    private Long userId;

    private LocalDateTime date;

    private BookingStatus status;

    private String username;

    private String slotTitle;

    private String slotDescription;

    public String getSlotDescription() {
        return slotDescription;
    }

    public void setSlotDescription(String slotDescription) {
        this.slotDescription = slotDescription;
    }

    public String getSlotTitle() {
        return slotTitle;
    }

    public void setSlotTitle(String slotTitle) {
        this.slotTitle = slotTitle;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Booking() {

    }

    public Booking(LocalDateTime date, Long slotId, BookingStatus status, Long userId, String username, String slotTitle, String slotDescription) {
        this.date = date;
        this.slotId = slotId;
        this.status = status;
        this.userId = userId;
        this.username = username;
        this.slotTitle = slotTitle;
        this.slotDescription = slotDescription;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Long getSlotId() {
        return slotId;
    }

    public void setSlotId(Long slotId) {
        this.slotId = slotId;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "Booking{" +
                "date=" + date +
                ", id=" + id +
                ", slotId=" + slotId +
                ", userId=" + userId +
                ", status=" + status +
                ", username='" + username + '\'' +
                ", slotTitle='" + slotTitle + '\'' +
                ", slotDescription='" + slotDescription + '\'' +
                '}';
    }
}
