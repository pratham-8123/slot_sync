package com.project.slotsync.repository;

import com.project.slotsync.model.Slot;
import com.project.slotsync.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Long> {

}
