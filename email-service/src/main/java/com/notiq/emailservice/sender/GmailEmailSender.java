package com.notiq.emailservice.sender;

import com.notiq.emailservice.kafka.producer.DeliveryStatusProducer;
import com.notiq.eventproducer.dto.DeliveryStatusEvent;
import com.notiq.eventproducer.dto.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class GmailEmailSender implements EmailSender {
    private final JavaMailSender javaMailSender;
    private final DeliveryStatusProducer deliveryStatusProducer;

    @Override
    public void send(NotificationEvent event,String subject,String body){
        DeliveryStatusEvent statusEvent=DeliveryStatusEvent.
                builder()
                .eventId(event.getEventId())
                .correlationId(event.getCorrelationId())
                .recipient(event.getRecipient())
                .channel(event.getChannel())
                .success(true)
                .build();
        deliveryStatusProducer.publishProcessing(statusEvent);
        try{
            SimpleMailMessage message=new SimpleMailMessage();
            message.setFrom("notiq26@gmail.com");
            message.setTo(event.getRecipient());
            message.setSubject(subject);
            message.setText(body);
            javaMailSender.send(message);
            deliveryStatusProducer.publishDelivered(statusEvent);
            log.info("Email sent successfully to {}",event.getRecipient());
        }
        catch(Exception e){
            DeliveryStatusEvent statusEvent2=DeliveryStatusEvent.
                    builder()
                    .eventId(event.getEventId())
                    .correlationId(event.getCorrelationId())
                    .recipient(event.getRecipient())
                    .channel(event.getChannel())
                    .success(false)
                    .failureReason(e.getMessage())
                    .build();
            deliveryStatusProducer.publishFailed(statusEvent2);
            log.error("Failed to send email to {}",event.getRecipient(),e);
        }
    }
}
