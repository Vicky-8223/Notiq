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
public class CoreController {
    private final NotificationProducer producer;
    private final NotificationService notificationService;
    @GetMapping("/{eventId}")
    public ResponseEntity<NotificationResponse> getNotification(@PathVariable String eventId){
        return ResponseEntity.ok(notificationService.map(notificationService.getByEventId(eventId)));
    }
    @GetMapping("/all")
    public ResponseEntity<List<NotificationResponse>>getAllNotifications(){
        return ResponseEntity.ok(notificationService.getAllNotifications()
                .stream().map(notificationService::map).toList());
    }
    @PostMapping("/notify")
    public String notify(@RequestBody NotificationEvent event){
        event.setEventId(UUID.randomUUID().toString());
        event.setCorrelationId(UUID.randomUUID().toString());
        event.setCreatedAt(LocalDateTime.now());
        event.setSourceService("play-ground");
        producer.publish(event);
        return event.getEventId();
    }
}
