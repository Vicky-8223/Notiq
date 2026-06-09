package com.notiq.core.kafka.consumer;

import com.notiq.eventproducer.constants.KafkaTopics;
import com.notiq.eventproducer.dto.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class DlqConsumer {
    @KafkaListener(
            topics= KafkaTopics.NOTIFICATION_DLQ,
            groupId="DLQ-listener"
    )
    public void listen(NotificationEvent notificationEvent){
        log.info("Received DLQ event: {}",notificationEvent);
    }
}
