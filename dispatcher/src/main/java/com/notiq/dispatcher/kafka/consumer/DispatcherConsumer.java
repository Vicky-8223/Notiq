package com.notiq.dispatcher.kafka.consumer;

import com.notiq.dispatcher.service.RoutingService;
import com.notiq.eventproducer.constants.KafkaTopics;
import com.notiq.eventproducer.dto.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DispatcherConsumer {
    private final RoutingService routingService;
    @KafkaListener(
            topics= KafkaTopics.NOTIFICATION_REQUEST,
            groupId="dispatcher-group"
    )
    public void consume(NotificationEvent event){
        log.info("Dispatcher received notification eventId={}",event.getEventId());
        routingService.route(event);
    }
}
