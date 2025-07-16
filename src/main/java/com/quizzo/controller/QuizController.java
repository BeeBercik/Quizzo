package com.quizzo.controller;

import com.quizzo.model.Quiz;
import com.quizzo.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizRepository quizRepository;

    @GetMapping
    ResponseEntity<Quiz> getQuizzes() {
        return ResponseEntity.
                status(HttpStatus.OK)
                .body(quizRepository.findAll().get(0));
    }
}
