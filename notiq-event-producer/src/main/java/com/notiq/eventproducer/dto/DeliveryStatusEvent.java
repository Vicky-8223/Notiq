package com.notiq.eventproducer.dto;

import com.notiq.eventproducer.enums.NotificationChannel;
import com.notiq.eventproducer.enums.NotificationStatus;
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
    private NotificationStatus status;
    private int retryCount;
    private boolean success;
    private String failureReason;
}
