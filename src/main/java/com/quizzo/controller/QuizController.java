package com.quizzo.controller;

import com.quizzo.dto.*;
import com.quizzo.service.QuizService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/{code}")
    ResponseEntity<QuizDetailsResponse> getQuiz(@PathVariable(name = "code") String code) {
        return ResponseEntity.
                status(HttpStatus.OK)
                .body(quizService.getQuizByCode(code));
    }

    @GetMapping("/attempt/{code}")
    ResponseEntity<QuizAttemptDetailsResponse> getQuizAttemptDetails(@PathVariable(name = "code") String code) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(quizService.getQuizAttemptDetails(code));
    }

    @PostMapping("/create")
    ResponseEntity<?> createQuiz(@RequestBody CreatedQuizRequest createdQuiz, HttpSession session) {
        quizService.saveQuiz(createdQuiz, session);
        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @PostMapping("/submit")
    ResponseEntity<?> submitQuiz(@RequestBody AttemptRequest attemptRequest, HttpSession session) {
        quizService.submitQuizAttempt(attemptRequest, session);
        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @DeleteMapping("/{code}")
    ResponseEntity<?> removeQuiz(@PathVariable(name = "code") String code, HttpSession session) {
        quizService.deleteQuiz(code, session);
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }

    @GetMapping("/summary/{code}")
    ResponseEntity<QuizSummaryResponse> summaryQuiz(@PathVariable(name = "code") String code, HttpSession session) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(quizService.getQuizSummary(code, session));
    }
}
