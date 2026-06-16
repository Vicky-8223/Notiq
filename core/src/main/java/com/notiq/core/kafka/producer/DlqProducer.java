package com.notiq.core.kafka.producer;

import com.notiq.eventproducer.constants.KafkaTopics;
import com.notiq.eventproducer.dto.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class DlqProducer {

    private final KafkaTemplate<String,NotificationEvent> kafkaTemplate;
    public void publish(NotificationEvent notificationEvent){
        kafkaTemplate.send(KafkaTopics.NOTIFICATION_DLQ,notificationEvent);
        log.info("Event {} Added to the Dead Letter Queue",notificationEvent.getEventId());
    }
}
