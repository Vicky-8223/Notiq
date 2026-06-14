package com.notiq.core.dto;

import com.notiq.core.enums.NotificationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationStatusUpdate {
    private String eventId;
    private NotificationStatus status;
    private LocalDateTime timestamp;
}
