package com.notiq.core.kafka.producer;

import com.notiq.eventproducer.constants.KafkaTopics;
import com.notiq.eventproducer.dto.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationProducer {
    private final KafkaTemplate<String, NotificationEvent> kafkaTemplate;
    public void publish(NotificationEvent notificationEvent){
        kafkaTemplate.send(KafkaTopics.NOTIFICATION_REQUEST,notificationEvent);
        log.info("Published notification event {}",notificationEvent.getEventId());

    }
}
