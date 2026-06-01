package com.notiq.core.service;

import com.notiq.core.entity.Notification;
import com.notiq.core.enums.NotificationStatus;
import com.notiq.core.exception.DuplicateEventException;
import com.notiq.core.repository.NotificationRepository;
import com.notiq.eventproducer.dto.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final NotificationRepository notificationRepository;
    public void createNotificationEvent(NotificationEvent event){
        if(notificationRepository.existsByEventId(event.getEventId())){
            log.warn("Duplicate Event received: "+event.getEventId());
            return;
        }
        Notification notification= Notification
                .builder().notificationId(UUID.randomUUID().toString())
                .eventId(event.getEventId())
                .correlationId(event.getCorrelationId())
                .recipient(event.getRecipient())
                .sourceService(event.getSourceService())
                .channel(event.getChannel())
                .priority(event.getPriority())
                .status(NotificationStatus.RECEIVED)
                .retryCount(0)
                .build();

        notificationRepository.save(notification);
    }

}

