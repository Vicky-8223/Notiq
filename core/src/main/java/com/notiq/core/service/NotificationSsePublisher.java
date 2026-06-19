package com.notiq.core.service;

import com.notiq.core.dto.NotificationStatusUpdate;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class NotificationSsePublisher {
    private final Map<String, SseEmitter> emitters=new ConcurrentHashMap<>();
    public SseEmitter subscribe(String eventId){
       SseEmitter emitter= new SseEmitter();
       emitters.put(eventId,emitter);
       emitter.onCompletion(()->{
           emitters.remove(eventId);
           log.info("SSE connection closed for eventId: {}",eventId);
       });
       emitter.onTimeout(()->{
           emitters.remove(eventId);
           log.info("SSE connection timed out for eventId: {}",eventId);
       });
       emitter.onError((e)->{
           emitters.remove(eventId);
           log.error("SSE connection error for eventId: {}",eventId,e);
       });
       log.info("SSE connection subscribed to eventId: {}",eventId);
       return emitter;
    }
    public void publishStatusUpdate(NotificationStatusUpdate update){
        SseEmitter emitter = emitters.get(update.getEventId());
        if(emitter==null){
            log.warn("No SSE subscriber found for eventId: {}",update.getEventId());
            return;
        }
        try{
            emitter.send(SseEmitter.event()
                    .name("notification-status")
                    .data(update));
            log.info("SSE sent for eventId: {} status: {}",update.getEventId(),update.getStatus());
        }
        catch (IOException e){
            log.error("SSE sending failed for eventId: {}",update.getEventId(),e);
            emitters.remove(update.getEventId());
        }
    }
}
