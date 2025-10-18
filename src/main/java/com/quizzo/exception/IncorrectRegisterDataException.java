package com.quizzo.exception;

public class IncorrectRegisterDataException extends RuntimeException {
    public IncorrectRegisterDataException(String message) {
        super(message);
    }
}
