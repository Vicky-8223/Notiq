package com.notiq.dispatcher.service;

import com.notiq.dispatcher.kafka.producer.DispatcherProducer;
import com.notiq.eventproducer.constants.KafkaTopics;
import com.notiq.eventproducer.dto.DeliveryStatusEvent;
import com.notiq.eventproducer.dto.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoutingService {
    private final DispatcherProducer producer;
    public void route(NotificationEvent event){
        switch(event.getChannel()){
            case EMAIL -> {
                producer.publish(KafkaTopics.EMAIL_NOTIFICATION,event);
                log.info("Routed eventId={} to EMAIL Topic",event.getEventId());
            }
            case SMS -> {
                producer.publish(KafkaTopics.SMS_NOTIFICATION,event);
                log.info("Routed eventId={} to SMS Topic",event.getEventId());
            }
            case PUSH -> {
                producer.publish(KafkaTopics.PUSH_NOTIFICATION, event);
                log.info("Routed eventId={} to PUSH_Topic", event.getEventId());
            }
        }
        DeliveryStatusEvent dispatchedEvent=DeliveryStatusEvent.builder()
                .eventId(event.getEventId())
                .correlationId(event.getCorrelationId())
                .recipient(event.getRecipient())
                .channel(event.getChannel())
                .success(true)
                .build();
        producer.publishDispatched(dispatchedEvent);
    }
}
