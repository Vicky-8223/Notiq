package com.notiq.core.kafka.producer;

import com.notiq.eventproducer.constants.KafkaTopics;
import com.notiq.eventproducer.dto.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class RetryProducer {
    private final KafkaTemplate<String,Object> kafkaTemplate;
    public void republish(NotificationEvent event){
        kafkaTemplate.send(KafkaTopics.NOTIFICATION_RETRY,event);
        log.info("Published RETRY eventId={}",event.getEventId());
    }
}
