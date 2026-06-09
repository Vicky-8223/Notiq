package com.notiq.core.entity;

import com.notiq.core.enums.NotificationStatus;
import com.notiq.eventproducer.enums.NotificationChannel;
import com.notiq.eventproducer.enums.NotificationPriority;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.management.NotificationListener;
import java.time.LocalDateTime;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name="notifications",
        indexes = {
                @Index(name="idx_notification_status",columnList = "status"),
                @Index(name="idx_notification_event_id",columnList="eventId"),
                @Index(name="idx_notification_created_at",columnList = "createdAt"),
                @Index(name="idx_notification_correlation_id",columnList="correlationId")
        }
)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Notification {
    @Id
    private String notificationId;
    @Column(nullable = false,unique = true)
    private String eventId;
    private String recipient;
    private String correlationId;
    private String sourceService;
    @Enumerated(EnumType.STRING)
    private NotificationChannel channel;
    @Enumerated(EnumType.STRING)
    private NotificationPriority priority;
    @Enumerated(EnumType.STRING)
    private NotificationStatus status;
    private Integer retryCount;
    @CreatedDate
    @Column(nullable = false,updatable = false)
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
    private String eventType;
    @Column(columnDefinition = "TEXT")
    private String payload;

    private Integer schemaVersion;
}
