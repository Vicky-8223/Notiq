package com.notiq.core.kafka.consumer;


import com.notiq.core.service.NotificationService;
import com.notiq.eventproducer.constants.KafkaTopics;
import com.notiq.eventproducer.dto.DeliveryStatusEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class DeliveryStatusConsumer {
       private final NotificationService notificationService;
      @KafkaListener(
            topics=KafkaTopics.NOTIFICATION_DISPATCHED,
            groupId="dispatched-marker"
      )
      public void consumeDispatched(DeliveryStatusEvent event){
        log.info(
                "Received DISPATCHED eventId={}",event.getEventId()
        );
        notificationService.markDispatched(event.getEventId());
      }
       @KafkaListener(
               topics= KafkaTopics.NOTIFICATION_DELIVERED,
               groupId="delivered-marker"
       )
       public void consumeDelivered(DeliveryStatusEvent event){
           log.info(
                   "Received DELIVERED eventId={}",
                   event.getEventId()
           );
           notificationService.markDelivered(event.getEventId());
       }
       @KafkaListener(
               topics=KafkaTopics.NOTIFICATION_FAILED,
               groupId="failed-marker"
       )
       public void consumeFailed(DeliveryStatusEvent event){
           log.info(
                   "Received FAILED eventId={}",
                   event.getEventId()
           );
           notificationService.markFailed(event.getEventId());
           notificationService.processFailure(event.getEventId());

       }

}
