package com.quizzo.exception;

public class IncorrectLoginDataException extends RuntimeException {
    public IncorrectLoginDataException(String message) {
        super(message);
    }
}