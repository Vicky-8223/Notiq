package com.notiq.eventproducer.dto;

import com.notiq.eventproducer.enums.NotificationChannel;
import com.notiq.eventproducer.enums.NotificationEventType;
import com.notiq.eventproducer.enums.NotificationPriority;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class NotificationEvent {
    private String eventId;
    private NotificationEventType eventType;
    private String recipient;
    private NotificationChannel channel;
    private NotificationPriority priority;
    private Map<String,Object> payload;
    private LocalDateTime createdAt;
    private String correlationId;
    private String sourceService;
}
