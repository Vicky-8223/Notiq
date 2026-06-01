package com.notiq.eventproducer.constants;

public class KafkaTopics {

    private KafkaTopics(){}

    public static final String NOTIFICATION_REQUEST =
            "notification-request";

    public static final String NOTIFICATION_RETRY =
            "notification-retry";

    public static final String NOTIFICATION_DLQ =
            "notification-dlq";

    public static final String EMAIL_NOTIFICATION =
            "email-notifications";
}