package com.notiq.eventproducer.dto;

import com.notiq.eventproducer.enums.NotificationChannel;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryStatusEvent {
    private String eventId;
    private String correlationId;
    private String recipient;
    private NotificationChannel channel;
    private int retryCount;
    private boolean success;
    private String failureReason;
}
