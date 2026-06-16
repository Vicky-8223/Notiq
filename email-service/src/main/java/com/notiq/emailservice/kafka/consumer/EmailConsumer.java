    package com.notiq.emailservice.kafka.consumer;

    import com.notiq.emailservice.service.EmailService;
    import com.notiq.eventproducer.constants.KafkaTopics;
    import com.notiq.eventproducer.dto.NotificationEvent;
    import lombok.RequiredArgsConstructor;
    import lombok.extern.slf4j.Slf4j;
    import org.springframework.kafka.annotation.KafkaListener;
    import org.springframework.stereotype.Service;

    @Service
    @RequiredArgsConstructor
    @Slf4j
    public class EmailConsumer {
        private final EmailService emailService;
        @KafkaListener(
                topics= KafkaTopics.EMAIL_NOTIFICATION,
                groupId="email-service-group"
        )
        public void consume(NotificationEvent event){
            log.info("Received email notification eventId={}",event.getEventId());

            emailService.process(event);
        }
    }
