package com.notiq.core.controller;

import com.notiq.core.dto.NotificationResponse;
import com.notiq.core.kafka.producer.NotificationProducer;
import com.notiq.core.service.NotificationService;
import com.notiq.eventproducer.dto.NotificationEvent;
import com.notiq.eventproducer.enums.NotificationChannel;
import com.notiq.eventproducer.enums.NotificationEventType;
import com.notiq.eventproducer.enums.NotificationPriority;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/test")
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {
    private final NotificationProducer producer;
    private final NotificationService notificationService;
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
    @GetMapping("/{eventId}")
    public ResponseEntity<NotificationResponse> getNotification(@PathVariable String eventId){
        return ResponseEntity.ok(notificationService.map(notificationService.getByEventId(eventId)));
    }
    @GetMapping("/all")
    public ResponseEntity<List<NotificationResponse>>getAllNotifications(){
        return ResponseEntity.ok(notificationService.getAllNotifications()
                .stream().map(notificationService::map).toList());
    }
}
