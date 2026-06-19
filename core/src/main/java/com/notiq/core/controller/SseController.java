package com.notiq.core.controller;

import com.notiq.core.service.NotificationSsePublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.awt.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/sse")
public class SseController {
     private final NotificationSsePublisher publisher;
     @GetMapping(value = "/notification/{eventId}",
     produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable String eventId){
         return publisher.subscribe(eventId);
     }
}
