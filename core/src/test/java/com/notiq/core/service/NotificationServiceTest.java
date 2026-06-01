package com.notiq.core.service;

import com.notiq.core.entity.Notification;
import com.notiq.core.enums.NotificationStatus;
import com.notiq.core.repository.NotificationRepository;
import com.notiq.eventproducer.dto.NotificationEvent;
import com.notiq.eventproducer.enums.NotificationChannel;
import com.notiq.eventproducer.enums.NotificationPriority;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    void shouldSaveNotificationForValidEvent() {

        NotificationEvent event = NotificationEvent.builder()
                .eventId("event-1")
                .recipient("vicky@gmail.com")
                .channel(NotificationChannel.EMAIL)
                .priority(NotificationPriority.HIGH)
                .correlationId("corr-1")
                .sourceService("test-service")
                .build();

        when(notificationRepository.existsByEventId("event-1"))
                .thenReturn(false);

        notificationService.createNotificationEvent(event);

        verify(notificationRepository, times(1))
                .save(any(Notification.class));
    }

    @Test
    void shouldIgnoreDuplicateEvent() {

        NotificationEvent event = NotificationEvent.builder()
                .eventId("event-1")
                .recipient("vicky@gmail.com")
                .channel(NotificationChannel.EMAIL)
                .build();

        when(notificationRepository.existsByEventId("event-1"))
                .thenReturn(true);

        notificationService.createNotificationEvent(event);

        verify(notificationRepository, never())
                .save(any(Notification.class));
    }

    @Test
    void shouldMapEventToNotificationCorrectly() {

        NotificationEvent event = NotificationEvent.builder()
                .eventId("event-1")
                .recipient("vicky@gmail.com")
                .channel(NotificationChannel.EMAIL)
                .priority(NotificationPriority.HIGH)
                .correlationId("corr-1")
                .sourceService("test-service")
                .build();

        when(notificationRepository.existsByEventId("event-1"))
                .thenReturn(false);

        notificationService.createNotificationEvent(event);

        ArgumentCaptor<Notification> captor =
                ArgumentCaptor.forClass(Notification.class);

        verify(notificationRepository)
                .save(captor.capture());

        Notification saved = captor.getValue();

        assertEquals("event-1", saved.getEventId());
        assertEquals("vicky@gmail.com", saved.getRecipient());
        assertEquals("corr-1", saved.getCorrelationId());
        assertEquals("test-service", saved.getSourceService());
        assertEquals(NotificationChannel.EMAIL, saved.getChannel());
        assertEquals(NotificationPriority.HIGH, saved.getPriority());
        assertEquals(NotificationStatus.RECEIVED, saved.getStatus());
        assertEquals(0, saved.getRetryCount());
    }

    @Test
    void shouldThrowExceptionWhenRepositoryFails() {

        NotificationEvent event = NotificationEvent.builder()
                .eventId("event-1")
                .recipient("vicky@gmail.com")
                .channel(NotificationChannel.EMAIL)
                .build();

        when(notificationRepository.existsByEventId("event-1"))
                .thenReturn(false);

        when(notificationRepository.save(any(Notification.class)))
                .thenThrow(new RuntimeException("Database Error"));

        assertThrows(
                RuntimeException.class,
                () -> notificationService.createNotificationEvent(event)
        );
    }
}