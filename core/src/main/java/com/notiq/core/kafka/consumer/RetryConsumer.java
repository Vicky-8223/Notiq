package com.notiq.core.kafka.consumer;

import com.notiq.eventproducer.constants.KafkaTopics;
import com.notiq.eventproducer.dto.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class RetryConsumer {
    private final KafkaTemplate<String,Object>kafkaTemplate;
    @KafkaListener(
            topics= KafkaTopics.NOTIFICATION_RETRY,
            groupId="retry-group"
    )
    public void consume(NotificationEvent event){
        kafkaTemplate.send(KafkaTopics.NOTIFICATION_REQUEST,event);
        log.info("Republished eventId={} as requests",event.getEventId());
    }
}
