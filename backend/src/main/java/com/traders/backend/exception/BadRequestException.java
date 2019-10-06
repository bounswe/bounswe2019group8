package com.traders.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequestException extends RuntimeException {
    public BadRequestException(String errorMessage) {
        super(errorMessage);
    }

    public BadRequestException(String errorMessage, Throwable errorCause) {
        super(errorMessage, errorCause);
    }
}
