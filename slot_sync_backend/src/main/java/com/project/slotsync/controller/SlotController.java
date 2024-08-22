package com.project.slotsync.controller;

import com.project.slotsync.constants.ApiResponse;
import com.project.slotsync.model.Slot;
import com.project.slotsync.model.User;
import com.project.slotsync.request.CreateSlotRequest;
import com.project.slotsync.request.RatingRequest;
import com.project.slotsync.request.UpdateSlotRequest;
import com.project.slotsync.service.SlotService;
import com.project.slotsync.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/slots")
public class SlotController {

    @Autowired
    private SlotService slotService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Slot>> createNewSlot(@RequestParam String title, @RequestParam String description, @RequestParam LocalDateTime date, @RequestParam Long duration, @RequestParam Long maxParticipants, @RequestParam("image") MultipartFile image) {
        ApiResponse<Slot> slot = slotService.createNewSlot(title, description, date, duration, maxParticipants, image);
        if (slot.getData() != null) {
            return ResponseEntity.ok(slot);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(slot);
        }
    }

    @GetMapping("/view/images/{imageName}")
    public ResponseEntity<InputStreamResource> viewSlotImage(@PathVariable String imageName) {
        return slotService.viewSlotImage(imageName);
    }

    @GetMapping("/view/images/id/{id}")
    public ResponseEntity<InputStreamResource> viewSlotImageById(@PathVariable Long id) {
        ApiResponse<Slot> slot = slotService.showExistingSlot(id);
        return slotService.viewSlotImage(slot.getData().getImageUrl());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Slot>> updateExistingSlot(@PathVariable Long id, @RequestBody UpdateSlotRequest request) {
        ApiResponse<Slot> slot =  slotService.updateExistingSlot(id, request);
        if (slot.getData() != null) {
            return ResponseEntity.ok(slot);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(slot);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteExistingSlot(@PathVariable Long id) {
        ApiResponse<String> slot = slotService.deleteExistingSlot(id);
        if (slot.getData() != null) {
            return ResponseEntity.ok(slot);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(slot);
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Slot>>> showAllExistingSlots() {
        ApiResponse<List<Slot>> slots = slotService.showAllExistingSlots();
        if (slots.getData() != null) {
            return ResponseEntity.ok(slots);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(slots);
        }
    }

    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Long>> showAllSlotsCount() {
        ApiResponse<Long> count = slotService.showAllSlotsCount();
        if (count.getData() != null) {
            return ResponseEntity.ok(count);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(count);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Slot>> showExistingSlot(@PathVariable Long id) {
        ApiResponse<Slot> slot = slotService.showExistingSlot(id);
        if (slot.getData() != null) {
            return ResponseEntity.ok(slot);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(slot);
        }
    }

    @PutMapping("/rating/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<String>> rateExistingSlot(@PathVariable Long id, @RequestBody RatingRequest request) {
        ApiResponse<String> slot = slotService.rateExistingSlot(id, Double.valueOf(request.getRating()));
        if (slot.getData() != null) {
            return ResponseEntity.ok(slot);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(slot);
        }
    }

    @GetMapping("/most-liked")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getMostLikedSlot() {
        ApiResponse<Long> slotId = slotService.getMostFrequentSlotId();
        if (slotId.getData() != null) {
            ApiResponse<Slot> slot = slotService.showExistingSlot(slotId.getData());
            return ResponseEntity.ok(slot.getData().getTitle());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/most-rated")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getMostRatedSlot() {
        ApiResponse<Slot> slot = slotService.getHighestRatedSlot();
        if (slot.getData() != null) {
            return ResponseEntity.ok(slot.getData().getTitle());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
