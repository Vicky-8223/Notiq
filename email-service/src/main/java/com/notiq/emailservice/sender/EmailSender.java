package com.notiq.emailservice.sender;

import com.notiq.eventproducer.dto.NotificationEvent;

public interface EmailSender {
    void send(NotificationEvent event,String subject,String body);
}
