package com.notiq.core.enums;

public enum NotificationStatus {
    RECEIVED,//stored by Core
    PROCESSING,//Retry Underway
    DISPATCHED,//Routed by Dispatcher
    DELIVERED,//Successfully sent
    FAILED,//Last attempt failed
    DLQ    //Exhausted retires
}
