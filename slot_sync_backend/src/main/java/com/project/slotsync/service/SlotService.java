package com.project.slotsync.service;

import com.project.slotsync.constants.ApiResponse;
import com.project.slotsync.model.Slot;
import com.project.slotsync.model.User;
import com.project.slotsync.repository.SlotRepository;
import com.project.slotsync.repository.UserRepository;
import com.project.slotsync.request.UpdateSlotRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class SlotService {

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ImageFileService imageFileService;

    public ApiResponse<Slot> createNewSlot(String title, String description, LocalDateTime date, Long duration, Long maxParticipants, MultipartFile image) {
        try {
            String originalFilename = image.getOriginalFilename();
            String imageName = UUID.randomUUID().toString() + "_" + originalFilename;
            imageFileService.uploadFile(imageName, image);
            Slot slot = slotRepository.save(new Slot(0L, 0.0, 0L, date, description, duration, maxParticipants, title, imageName));
            return new ApiResponse<>("Slot created successfully", slot);
        } catch (IOException e) {
            return new ApiResponse<>("Slot not created", null);
        }
    }

    public ResponseEntity<InputStreamResource> viewSlotImage(@PathVariable String imageName) {
        var s3Object = imageFileService.getFile(imageName);
        var content = s3Object.getObjectContent();

        String contentType = "application/octet-stream";
        if (imageName.endsWith(".png")) {
            contentType = MediaType.IMAGE_PNG_VALUE;
        } else if (imageName.endsWith(".jpg") || imageName.endsWith(".jpeg")) {
            contentType = MediaType.IMAGE_JPEG_VALUE;
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + imageName + "\"")
                .body(new InputStreamResource(content));
    }

    public ApiResponse<Slot> updateExistingSlot(Long id, UpdateSlotRequest request) {
        Optional<Slot> existingSlot = slotRepository.findById(id);
        if (existingSlot.isPresent()) {
            Slot newSlot = existingSlot.get();
            if (request.getTitle() != null) newSlot.setTitle(request.getTitle());
            if (request.getDescription() != null) newSlot.setDescription(request.getDescription());
            if (request.getMaxParticipants() != null) newSlot.setMaxParticipants(request.getMaxParticipants());
            if (request.getDuration() != null) newSlot.setDuration(request.getDuration());
            slotRepository.save(newSlot);
            return new ApiResponse<>("Slot's details updated successfully", newSlot);
        } else {
            return new ApiResponse<>("No slot found to update", null);
        }
    }

    public ApiResponse<String> deleteExistingSlot(Long id) {
        if (slotRepository.existsById(id)) {
            slotRepository.deleteById(id);
            return new ApiResponse<>("Slot deleted successfully", "Deleted Slot Id: " + id);
        } else {
            return new ApiResponse<>("No slot found to delete", null);
        }
    }

    public ApiResponse<List<Slot>> showAllExistingSlots() {
        List<Slot> allSlots = slotRepository.findAll();
        if (allSlots.isEmpty()) {
            return new ApiResponse<>("No slots found", null);
        } else {
            return new ApiResponse<>("Slots' details fetched successfully", allSlots);
        }
    }

    public ApiResponse<Long> showAllSlotsCount() {
        Long count = slotRepository.count();
        return new ApiResponse<>("Slots' count successful", count);
    }

    public ApiResponse<Slot> showExistingSlot(Long id) {
        Optional<Slot> slot = slotRepository.findById(id);
        if (slot.isPresent()) {
            return new ApiResponse<>("Slot's details fetched successfully", slot.get());
        }
        else {
            return new ApiResponse<>("No slot found", null);
        }
    }

    public ApiResponse<List<Slot>> showAllMatchingSlots(Set<Long> ids) {
        List<Slot> slots = slotRepository.findAllById(ids);
        if (slots.isEmpty()) {
            return new ApiResponse<>("No slots found", null);
        } else {
            return new ApiResponse<>("Slots' details fetched successfully", slots);
        }
    }

    public ApiResponse<String> rateExistingSlot(Long id, Double rating) {
        Optional<Slot> slot = slotRepository.findById(id);
        if (slot.isPresent()) {
            Slot newSlot = slot.get();
            newSlot.setNoOfRatings(newSlot.getNoOfRatings() + 1);
            newSlot.setCurrRating(newSlot.getCurrRating() + rating);
            slotRepository.save(newSlot);
            Double updatedRating = (newSlot.getCurrRating() / newSlot.getNoOfRatings());
            return new ApiResponse<>("Slot's rating updated successfully", "Updated Rating: " + updatedRating);
        }
        else {
            return new ApiResponse<>("No slot found", null);
        }
    }

    public ApiResponse<Long> getMostFrequentSlotId() {
        List<User> users = userRepository.findAll();
        Map<Long, Integer> slotFrequencyMap = new HashMap<>();

        for (User user : users) {
            Set<Long> favouriteSlotIds = user.getFavouriteSlotIds();
            for (Long slotId : favouriteSlotIds) {
                slotFrequencyMap.put(slotId, slotFrequencyMap.getOrDefault(slotId, 0) + 1);
            }
        }

        Long mostFrequentSlotId = null;
        int maxFrequency = 0;

        for (Map.Entry<Long, Integer> entry : slotFrequencyMap.entrySet()) {
            if (entry.getValue() > maxFrequency) {
                mostFrequentSlotId = entry.getKey();
                maxFrequency = entry.getValue();
            }
        }

        return new ApiResponse<>("Most liked slot found successfully", mostFrequentSlotId);
    }

    public ApiResponse<Slot> getHighestRatedSlot() {
        List<Slot> slots = slotRepository.findAll();
        Slot highestRatedSlot = null;
        double highestRating = 0.0;

        for (Slot slot : slots) {
            double rating = slot.getNoOfRatings() > 0 ? slot.getCurrRating() / slot.getNoOfRatings() : 0.0;
            if (highestRatedSlot == null || rating > highestRating ||
                    (rating == highestRating && slot.getNoOfRatings() > highestRatedSlot.getNoOfRatings())) {
                highestRatedSlot = slot;
                highestRating = rating;
            }
        }

        return new ApiResponse<>("Most rated slot found successfully", highestRatedSlot);
    }
}
