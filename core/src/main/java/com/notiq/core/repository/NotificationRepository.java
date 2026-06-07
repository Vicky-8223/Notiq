package com.notiq.core.repository;

import com.notiq.core.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    boolean existsByEventId(String eventId);
    Optional<Notification> findByEventId(String eventId);
}
