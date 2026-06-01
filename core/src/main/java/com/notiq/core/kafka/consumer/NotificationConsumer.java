package com.notiq.core.kafka.consumer;

import com.notiq.core.entity.Notification;
import com.notiq.core.enums.NotificationStatus;
import com.notiq.core.exception.InvalidNotificationException;
import com.notiq.core.service.NotificationService;
import com.notiq.eventproducer.constants.KafkaTopics;
import com.notiq.eventproducer.dto.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {
    private final NotificationService notificationService;
    @KafkaListener(
            topics= KafkaTopics.NOTIFICATION_REQUEST,
            groupId = "notification-core-group"
    )
    public void consume(NotificationEvent event){
        log.info(
                "eventId={} correlationId={} status={}",
                event.getEventId(),
                event.getCorrelationId(),
                NotificationStatus.RECEIVED
        );
        validate(event);
        notificationService.createNotificationEvent(event);
        log.info("Notification persisted successfully {}",event.getEventId());
    }
    private void validate(NotificationEvent event){

        if(event.getEventId() == null){
            throw new InvalidNotificationException(
                    "EventId cannot be null"
            );
        }

        if(event.getRecipient() == null){
            throw new InvalidNotificationException(
                    "Recipient cannot be null"
            );
        }

        if(event.getChannel() == null){
            throw new InvalidNotificationException(
                    "Channel cannot be null"
            );
        }
    }

}
