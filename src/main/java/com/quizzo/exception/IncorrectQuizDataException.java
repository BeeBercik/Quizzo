package com.quizzo.exception;

public class IncorrectQuizDataException extends RuntimeException {
    public IncorrectQuizDataException(String message) {
        super(message);
    }
}
