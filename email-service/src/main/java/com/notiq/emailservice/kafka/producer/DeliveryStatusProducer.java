package com.notiq.emailservice.kafka.producer;

import com.notiq.eventproducer.constants.KafkaTopics;
import com.notiq.eventproducer.dto.DeliveryStatusEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class DeliveryStatusProducer {
    private final KafkaTemplate<String,DeliveryStatusEvent> kafkaTemplate;
    public void publishDelivered(DeliveryStatusEvent event){
        kafkaTemplate.send(KafkaTopics.NOTIFICATION_DELIVERED,event);
        log.info("Published DELIVERED eventId={}",event.getEventId());
    }
    public void publishFailed(DeliveryStatusEvent event){
        kafkaTemplate.send(KafkaTopics.NOTIFICATION_FAILED,event);
        log.info("Published FAILED eventId={}",event.getEventId());
    }
}
