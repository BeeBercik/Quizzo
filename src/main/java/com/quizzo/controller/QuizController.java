package com.quizzo.controller;

import com.quizzo.dto.QuizAttemptDetailsDto;
import com.quizzo.model.Quiz;
import com.quizzo.service.QuizService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/{code}")
    ResponseEntity<Quiz> getQuiz(@PathVariable(name = "code") String code) {
        return ResponseEntity.
                status(HttpStatus.OK)
                .body(quizService.getQuizByCode(code));
    }

    @GetMapping("/attempt/{code}")
    ResponseEntity<QuizAttemptDetailsDto> getQuizAttemptDetails(@PathVariable(name = "code") String code) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(quizService.getQuizAttemptDetails(code));
    }
}
