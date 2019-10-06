package com.traders.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class AppException extends RuntimeException {
    public AppException(String errorMessage) {
        super(errorMessage);
    }

    public AppException(String errorMessage, Throwable errorCause) {
        super(errorMessage, errorCause);
    }
}
