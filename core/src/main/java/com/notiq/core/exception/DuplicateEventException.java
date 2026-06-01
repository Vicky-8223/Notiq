package com.notiq.core.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateEventException extends RuntimeException {
     public DuplicateEventException(String eventId){
         super("Duplicate Event received: "+eventId);
     }
}
