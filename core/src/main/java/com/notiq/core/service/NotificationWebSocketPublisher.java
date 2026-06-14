package com.notiq.core.service;

import com.notiq.core.dto.NotificationStatusUpdate;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationWebSocketPublisher {
    private final SimpMessagingTemplate messagingTemplate;
    public void publishStatusUpdate(NotificationStatusUpdate status){
        messagingTemplate.convertAndSend("/topic/notification/"+status.getEventId(),status);
    }
}
