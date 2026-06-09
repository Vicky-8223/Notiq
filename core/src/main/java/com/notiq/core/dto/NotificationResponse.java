package com.notiq.core.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@Builder

public class NotificationResponse {
    private String eventId;
    private String recipient;
    private String correlationId;
    private String sourceService;
    private String channel;
    private String priority;
    private String status;
    private Integer retryCount;
    private String eventType;
}
