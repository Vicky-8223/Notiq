package com.notiq.core.repository;

import com.notiq.core.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    boolean existsByEventId(String eventId);
}
