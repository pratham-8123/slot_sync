package com.project.slotsync.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
public class Slot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    private LocalDateTime date;

    private Long duration;

    private Long maxParticipants;

    private Long currParticipants;

    private Double currRating;

    private Long noOfRatings;

    private String imageUrl;

    public Slot() {

    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Slot(Long noOfRatings, Double currRating, Long currParticipants, LocalDateTime date, String description, Long duration, Long maxParticipants, String title, String imageUrl) {
        this.noOfRatings = noOfRatings;
        this.currRating = currRating;
        this.currParticipants = currParticipants;
        this.date = date;
        this.description = description;
        this.duration = duration;
        this.maxParticipants = maxParticipants;
        this.title = title;
        this.imageUrl = imageUrl;
    }

    public Long getCurrParticipants() {
        return currParticipants;
    }

    public void setCurrParticipants(Long currParticipants) {
        this.currParticipants = currParticipants;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getDuration() {
        return duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMaxParticipants() {
        return maxParticipants;
    }

    public void setMaxParticipants(Long maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Double getCurrRating() {
        return currRating;
    }

    public void setCurrRating(Double currRating) {
        this.currRating = currRating;
    }

    public Long getNoOfRatings() {
        return noOfRatings;
    }

    public void setNoOfRatings(Long noOfRatings) {
        this.noOfRatings = noOfRatings;
    }

    @Override
    public String toString() {
        return "Slot{" +
                "currParticipants=" + currParticipants +
                ", id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", date=" + date +
                ", duration=" + duration +
                ", maxParticipants=" + maxParticipants +
                ", currRating=" + currRating +
                ", noOfRatings=" + noOfRatings +
                '}';
    }
}
