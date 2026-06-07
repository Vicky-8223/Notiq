package com.notiq.core.controller;

import com.notiq.core.kafka.producer.NotificationProducer;
import com.notiq.eventproducer.dto.NotificationEvent;
import com.notiq.eventproducer.enums.NotificationChannel;
import com.notiq.eventproducer.enums.NotificationEventType;
import com.notiq.eventproducer.enums.NotificationPriority;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/test")
public class TestController {
    private final NotificationProducer producer;
    @PostMapping("/publish")
    public String publish(){
        NotificationEvent event=NotificationEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .recipient("velvignesh2405@gmail.com")
                .channel(NotificationChannel.EMAIL)
                .priority(NotificationPriority.HIGH)
                .eventType(NotificationEventType.USER_REGISTERED)
                .correlationId(UUID.randomUUID().toString())
                .sourceService("test-service")
                .schemaVersion(1)
                .createdAt(LocalDateTime.now())
                .build();
        producer.publish(event);
        return "Published";
    }
}
