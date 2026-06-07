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
    public void markDelivered(String eventId){
        Notification notification=notificationRepository.findByEventId(eventId).orElseThrow(()->new RuntimeException("Notification not found for eventId: "+eventId));
        notification.setStatus(NotificationStatus.DELIVERED);
        notificationRepository.save(notification);
        log.info("Notification {} marked as delivered",eventId);
    }
    public void markFailed(String eventId){
       Notification notification=notificationRepository.findByEventId(eventId).orElseThrow(()->new RuntimeException("Notification not found for eventId: "+eventId));
       notification.setStatus(NotificationStatus.FAILED);
       notificationRepository.save(notification);
       log.info("Notification {} marked as failed",eventId);
    }
    public void markDispatched(String eventId){
        Notification notification=notificationRepository.findByEventId(eventId).orElseThrow(()->new RuntimeException("Notification not found for eventId: "+eventId));
        notification.setStatus(NotificationStatus.DISPATCHED);
        notificationRepository.save(notification);
        log.info("Notification {} marked as Dispatched",eventId);
    }
    //retry Logic
    public void processFailure(String eventId){
        Notification notification=notificationRepository.findByEventId(eventId).orElseThrow();
        if(notification.getRetryCount()>=3){
            notification.setStatus(NotificationStatus.DLQ);
            notificationRepository.save(notification);
            log.info("Notification {} marked as DLQ after all the 3 attempts",eventId);
            return;
        }
        else{
            notification.setRetryCount(notification.getRetryCount()+1);
            notification.setStatus(NotificationStatus.PROCESSING);
            notificationRepository.save(notification);
            log.info("Processing Notification {} (Failure {})",eventId,notification.getRetryCount());
        }
    }
}

