package com.project.slotsync.service;

import com.project.slotsync.constants.ApiResponse;
import com.project.slotsync.model.User;
import com.project.slotsync.repository.UserRepository;
import com.project.slotsync.request.ChangeUserPasswordRequest;
import com.project.slotsync.request.FavouriteRequest;
import com.project.slotsync.request.UpdateUserRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public ApiResponse<User> showUserDetailsById(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return new ApiResponse<>("User's details fetched successfully", user.get());
        }
        else {
            return new ApiResponse<>("No user found", null);
        }
    }

    public ApiResponse<User> showUserDetailsByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            return new ApiResponse<>("User's details fetched successfully", user.get());
        }
        else {
            return new ApiResponse<>("No user found", null);
        }
    }

    public ApiResponse<String> verifyUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            return new ApiResponse<>("User found", user.get().getUsername());
        }
        else {
            return new ApiResponse<>("No user found", null);
        }
    }

    public ApiResponse<List<User>> showAllUserDetails() {
        List<User> allUsers = userRepository.findAll();
        if (allUsers.isEmpty()) {
            return new ApiResponse<>("No users found", null);
        } else {
            return new ApiResponse<>("Users' details fetched successfully", allUsers);
        }
    }

    public ApiResponse<Long> showAllUsersCount() {
        Long count = userRepository.count();
        return new ApiResponse<>("Users' count successful", count);
    }

    public ApiResponse<User> updateExistingUserDetails(String username, UpdateUserRequest request) {
        Optional<User> existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent()) {
            User newUser = existingUser.get();
            if (request.getName() != null) newUser.setName(request.getName());
            if (request.getEmail() != null) newUser.setEmail(request.getEmail());
            userRepository.save(newUser);
            return new ApiResponse<>("User's details updated successfully", newUser);
        } else {
            return new ApiResponse<>("No user found to update", null);
        }
    }

    public ApiResponse<User> updateFavouriteSlots(Long id, FavouriteRequest request) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            User newUser = existingUser.get();
            Set<Long> newFavouriteSlotIds = newUser.getFavouriteSlotIds();
            newFavouriteSlotIds.add(request.getSlotId());
            newUser.setFavouriteSlotIds(newFavouriteSlotIds);
            userRepository.save(newUser);
            return new ApiResponse<>("User's details updated successfully", newUser);
        } else {
            return new ApiResponse<>("No user found to update", null);
        }
    }

    public ApiResponse<User> deleteFromFavouriteSlots(Long id, FavouriteRequest request) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            User newUser = existingUser.get();
            Set<Long> newFavouriteSlotIds = newUser.getFavouriteSlotIds();
            newFavouriteSlotIds.remove(request.getSlotId());
            newUser.setFavouriteSlotIds(newFavouriteSlotIds);
            userRepository.save(newUser);
            return new ApiResponse<>("User's details updated successfully", newUser);
        } else {
            return new ApiResponse<>("No user found to update", null);
        }
    }

    public ApiResponse<Void> deleteUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.deleteById(id);
            return new ApiResponse<>("User deleted successfully", null);
        } else {
            return new ApiResponse<>("No user found", null);
        }
    }
}
