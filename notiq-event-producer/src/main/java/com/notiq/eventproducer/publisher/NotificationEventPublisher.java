package com.notiq.eventproducer.publisher;

import com.notiq.eventproducer.dto.NotificationEvent;

public interface NotificationEventPublisher {
    void publish(NotificationEvent notificationEvent);
}
