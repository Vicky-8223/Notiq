package com.notiq.core.kafka.consumer;


import com.notiq.core.service.NotificationService;
import com.notiq.eventproducer.constants.KafkaTopics;
import com.notiq.eventproducer.dto.DeliveryStatusEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
@Slf4j
@RequiredArgsConstructor
public class DeliveryStatusConsumer {
       private final NotificationService notificationService;
      @KafkaListener(
            topics=KafkaTopics.NOTIFICATION_STATUS,
            groupId="core-status-group"
      )
      public void consumeStatus(DeliveryStatusEvent event) throws Exception {
          log.info("Received STATUS eventId={}, status={}", event.getEventId(), event.getStatus());
          if (event.getStatus() == null) {
              log.error("Received STATUS event with null status! eventId={}", event.getEventId());
              return;
          }
          
          switch (event.getStatus()) {
              case DISPATCHED:
                  notificationService.markDispatched(event.getEventId());
                  break;
              case PROCESSING:
                  notificationService.markProcessing(event.getEventId());
                  break;
              case DELIVERED:
                  notificationService.markDelivered(event.getEventId());
                  break;
              case FAILED:
                  notificationService.markFailed(event.getEventId());
                  notificationService.processFailure(event.getEventId());
                  break;
              default:
                  log.warn("Unknown status received: {}", event.getStatus());
          }
      }
}
