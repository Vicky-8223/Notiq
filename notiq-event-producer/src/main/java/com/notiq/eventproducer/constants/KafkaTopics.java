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
    public static final String NOTIFICATION_DELIVERED=
            "notification-delivered";
    public static final String NOTIFICATION_FAILED=
            "notification-failed";
    public static final String NOTIFICATION_DISPATCHED="notification-dispatched";
    public static final String NOTIFICATION_PROCESSING="notification-processing";

}