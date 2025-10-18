package com.quizzo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(QuizNotFoundException.class)
    ResponseEntity<Map<String, String>> handleQuizNotFoundException(QuizNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(IncorrectUserDataException.class)
    ResponseEntity<Map<String, String>> handleUserNotFoundException(IncorrectUserDataException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    ResponseEntity<Map<String, String>> handleUsernameNotFoundException(UsernameNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(UnauthorizedException.class)
    ResponseEntity<Map<String, String>> handleUnauthorizedException(UnauthorizedException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(QuizNotActiveException.class)
    ResponseEntity<Map<String, String>> handleQuizNotActiveException(QuizNotActiveException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(AnswerNotFoundException.class)
    ResponseEntity<Map<String, String>> handleAnswerNotFoundException(AnswerNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(UserNotFoundException.class)
    ResponseEntity<Map<String, String>> handleUserNotFoundExceptionException(UserNotFoundException ex) {
        return ResponseEntity.
                status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(LoginAlreadyTakenException.class)
    ResponseEntity<Map<String, String>> handleLoginAlreadyTakenException(LoginAlreadyTakenException ex) {
        return ResponseEntity.
                status(HttpStatus.CONFLICT)
                .body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(EmailAlreadyTakenException.class)
    ResponseEntity<Map<String, String>> handleEmailAlreadyTakenException(EmailAlreadyTakenException ex) {
        return ResponseEntity.
                status(HttpStatus.CONFLICT)
                .body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(IncorrectLoginDataException.class)
    ResponseEntity<Map<String, String>> handleIncorrectLoginDataException(IncorrectLoginDataException ex) {
        return ResponseEntity.
                status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(IncorrectRegisterDataException.class)
    ResponseEntity<Map<String, String>> handleIncorrectRegisterDataException(IncorrectRegisterDataException ex) {
        return ResponseEntity.
                status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", ex.getMessage()));
    }

}
