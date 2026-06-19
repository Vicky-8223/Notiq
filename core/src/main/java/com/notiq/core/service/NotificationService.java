    package com.notiq.core.service;

    import com.fasterxml.classmate.AnnotationOverrides;
    import com.fasterxml.jackson.databind.ObjectMapper;
    import com.notiq.core.dto.NotificationResponse;
    import com.notiq.core.dto.NotificationStatusUpdate;
    import com.notiq.core.entity.Notification;
    import com.notiq.core.enums.NotificationStatus;
    import com.notiq.core.exception.DuplicateEventException;
    import com.notiq.core.kafka.producer.DlqProducer;
    import com.notiq.core.kafka.producer.RetryProducer;
    import com.notiq.core.repository.NotificationRepository;
    import com.notiq.eventproducer.dto.NotificationEvent;
    import com.notiq.eventproducer.enums.NotificationEventType;
    import lombok.RequiredArgsConstructor;
    import lombok.extern.slf4j.Slf4j;
    import org.springframework.stereotype.Service;

    import java.time.LocalDateTime;
    import java.util.List;
    import java.util.Map;
    import java.util.UUID;


    @Service
    @RequiredArgsConstructor
    @Slf4j
    public class NotificationService {
        private final NotificationRepository notificationRepository;
        private final ObjectMapper objectMapper;
        private final RetryProducer retryProducer;
        private final DlqProducer dlqProducer;
//        private final NotificationWebSocketPublisher publisher;
        private final NotificationSsePublisher publisher;
        public boolean createNotificationEvent(NotificationEvent event) throws Exception{
            if(notificationRepository.existsByEventId(event.getEventId())){
                log.warn("Duplicate Event received: "+event.getEventId());
                return false;
            }
            Notification notification= Notification
                    .builder().notificationId(UUID.randomUUID().toString())
                    .eventId(event.getEventId())
                    .correlationId(event.getCorrelationId())
                    .recipient(event.getRecipient())
                    .sourceService(event.getSourceService())
                    .channel(event.getChannel())
                    .priority(event.getPriority())
                    .status(NotificationStatus.RECEIVED)
                    .eventType(event.getEventType().name())
                    .payload(objectMapper.writeValueAsString(event.getPayload()))
                    .retryCount(0)
                    .build();

            notificationRepository.save(notification);
            return true;
        }
        public void markProcessing(String eventId){
            Notification notification=notificationRepository.findByEventId(eventId).orElseThrow(()->new RuntimeException("Notification not found"));
            notification.setStatus(NotificationStatus.PROCESSING);
            notificationRepository.save(notification);
            sendStatusToFrontend(notification);
            log.info("Notification {} marked as Processing",eventId);
        }
        public void markDelivered(String eventId){
            Notification notification=notificationRepository.findByEventId(eventId).orElseThrow(()->new RuntimeException("Notification not found for eventId: "+eventId));
            notification.setStatus(NotificationStatus.DELIVERED);
            notificationRepository.save(notification);
            sendStatusToFrontend(notification);
            log.info("Notification {} marked as delivered",eventId);
        }
        public void markFailed(String eventId){
           Notification notification=notificationRepository.findByEventId(eventId).orElseThrow(()->new RuntimeException("Notification not found for eventId: "+eventId));
           notification.setStatus(NotificationStatus.FAILED);
           notificationRepository.save(notification);
           sendStatusToFrontend(notification);
           log.info("Notification {} marked as failed",eventId);
        }
        public void markDispatched(String eventId){
            Notification notification=notificationRepository.findByEventId(eventId).orElseThrow(()->new RuntimeException("Notification not found for eventId: "+eventId));
            notification.setStatus(NotificationStatus.DISPATCHED);
            notificationRepository.save(notification);
            sendStatusToFrontend(notification);
            log.info("Notification {} marked as Dispatched",eventId);
        }
        //retry Logic
        public void processFailure(String eventId)throws Exception{
            Notification notification=notificationRepository.findByEventId(eventId).orElseThrow();
            if(notification.getRetryCount()>=3){
                notification.setStatus(NotificationStatus.DLQ);
                notificationRepository.save(notification);
                NotificationEvent dlqEvent=buildNotificationEvent(notification);
                dlqProducer.publish(dlqEvent);
                sendStatusToFrontend(notification);
                log.info("Notification {} marked as DLQ after all the 3 attempts",eventId);
                return;
            }
            else{
                notification.setRetryCount(notification.getRetryCount()+1);
                notification.setStatus(NotificationStatus.PROCESSING);
                notificationRepository.save(notification);
                NotificationEvent retryEvent=buildNotificationEvent(notification);
                retryProducer.republish(retryEvent);
                log.info("Processing Notification {} (Failure {})",eventId,notification.getRetryCount());
            }
        }
        private NotificationEvent buildNotificationEvent(Notification notification)throws Exception{
            return NotificationEvent.builder()
                    .eventId(notification.getEventId())
                    .recipient(notification.getRecipient())
                    .channel(notification.getChannel())
                    .priority(notification.getPriority())
                    .correlationId(notification.getCorrelationId())
                    .sourceService(notification.getSourceService())
                    .eventType(NotificationEventType.valueOf(notification.getEventType()))
                    .payload(notification.getPayload()==null?null:objectMapper.readValue(notification.getPayload(),Map.class))
                    .build();
        }
        public Notification getByEventId(String eventId){
            return notificationRepository.findByEventId(eventId).orElseThrow(()->new RuntimeException("Notification not found"));
        }
        public List<Notification>getAllNotifications(){
                return notificationRepository.findAll();
        }
        public NotificationResponse map(Notification notification){
            return NotificationResponse.builder()
                    .eventId(notification.getEventId())
                    .recipient(notification.getRecipient())
                    .correlationId(notification.getCorrelationId())
                    .sourceService(notification.getSourceService())
                    .channel(notification.getChannel().name())
                    .priority(notification.getPriority().name())
                    .status(notification.getStatus().name())
                    .retryCount(notification.getRetryCount())
                    .eventType(notification.getEventType())
                    .build();
        }
        public void sendStatusToFrontend(Notification notification){
            publisher.publishStatusUpdate(
                    NotificationStatusUpdate.builder()
                            .eventId(notification.getEventId())
                            .status(notification.getStatus())
                            .timestamp(LocalDateTime.now())
                            .build()
            );
        }
    }

