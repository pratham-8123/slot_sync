package com.project.slotsync.controller;

import com.project.slotsync.constants.ApiResponse;
import com.project.slotsync.model.User;
import com.project.slotsync.model.Slot;
import com.project.slotsync.request.FavouriteRequest;
import com.project.slotsync.request.UpdateUserRequest;
import com.project.slotsync.service.SlotService;
import com.project.slotsync.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private SlotService slotService;

    @GetMapping("/id/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> showUserDetailsById(@PathVariable Long id) {
        ApiResponse<User> user = userService.showUserDetailsById(id);
        if (user.getData() != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(user);
        }
    }

    @GetMapping("/username/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> showUserDetailsByUsername(@PathVariable String username) {
        ApiResponse<User> user = userService.showUserDetailsByUsername(username);
        if (user.getData() != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(user);
        }
    }

    @GetMapping("/verify/username/{username}")
    public ResponseEntity<ApiResponse<String>> verifyUsername(@PathVariable String username) {
        ApiResponse<String> user = userService.verifyUsername(username);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<User>>> showAllUserDetails() {
        ApiResponse<List<User>> users = userService.showAllUserDetails();
        if (users.getData() != null) {
            return ResponseEntity.ok(users);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(users);
        }
    }

    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Long>> showAllUsersCount() {
        ApiResponse<Long> count = userService.showAllUsersCount();
        if (count.getData() != null) {
            return ResponseEntity.ok(count);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(count);
        }
    }

    @PutMapping("/{username}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<User>> updateExistingUserDetails(@PathVariable String username, @RequestBody UpdateUserRequest request) {
        ApiResponse<User> user = userService.updateExistingUserDetails(username, request);
        if (user.getData() != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(user);
        }
    }

    @PutMapping("/id/{id}/favourites")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<User>> updateFavouriteSlots(@PathVariable Long id, @RequestBody FavouriteRequest request) {
        ApiResponse<User> user = userService.updateFavouriteSlots(id, request);
        if (user.getData() != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(user);
        }
    }

    @PutMapping("/id/{id}/favourites/remove")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<User>> deleteFromFavouriteSlots(@PathVariable Long id, @RequestBody FavouriteRequest request) {
        ApiResponse<User> user = userService.deleteFromFavouriteSlots(id, request);
        if (user.getData() != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(user);
        }
    }

    @GetMapping("/id/{id}/favourites")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<Slot>>> showAllFavouriteSlots(@PathVariable Long id) {
        ApiResponse<User> user = userService.showUserDetailsById(id);
        if (user.getData() != null) {
            Set<Long> favouriteSlotIds = user.getData().getFavouriteSlotIds();
            ApiResponse<List<Slot>> favouriteSlots = slotService.showAllMatchingSlots(favouriteSlotIds);
            if (favouriteSlots.getData() != null) {
                return ResponseEntity.ok(favouriteSlots);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/id/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUserById(@PathVariable Long id) {
        ApiResponse<Void> response = userService.deleteUserById(id);
        if (response.getMessage().equals("User deleted successfully")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
