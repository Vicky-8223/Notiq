package com.notiq.dispatcher.kafka.producer;

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
public class DispatcherProducer {
      private final KafkaTemplate<String, Object>kafkaTemplate;
      public void publish(String topic,NotificationEvent event){
          kafkaTemplate.send(topic,event);
          log.info("Published eventId={} to topic={}",event.getEventId(),topic);
      }
      public void publishDispatched(DeliveryStatusEvent event){
         kafkaTemplate.send(KafkaTopics.NOTIFICATION_DISPATCHED,event);
         log.info("Dispatched eventId={}",event.getEventId());
      }
}
