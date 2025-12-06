package com.quizzo.controller;

import com.quizzo.config.AppUserPrincipal;
import com.quizzo.dto.*;
import com.quizzo.service.QuizService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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

    @GetMapping("/{code}/edit")
    ResponseEntity<QuizDetailsResponse> getQuizToEdit(@PathVariable(name = "code") String code,
                                                      @AuthenticationPrincipal AppUserPrincipal user) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(quizService.getQuizDetailsForOwner(code, user.getId()));
    }

    @GetMapping("/attempt/{code}")
    ResponseEntity<QuizAttemptDetailsResponse> getQuizAttemptDetails(@PathVariable(name = "code") String code) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(quizService.getQuizAttemptDetails(code));
    }

    @PostMapping
    ResponseEntity<?> createQuiz(@RequestBody CreatedQuizRequest createdQuiz, @AuthenticationPrincipal AppUserPrincipal user) {
        quizService.saveQuiz(createdQuiz, user.getId());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    @PutMapping("/{code}")
    ResponseEntity<?> updateQuiz(@PathVariable(name = "code") String code,
                                 @RequestBody CreatedQuizRequest updatedQuiz,
                                 @AuthenticationPrincipal AppUserPrincipal user) {
        quizService.updateQuiz(code, updatedQuiz, user.getId());
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }

    @PostMapping("/submit")
    ResponseEntity<?> submitQuiz(@RequestBody AttemptRequest attemptRequest, @AuthenticationPrincipal AppUserPrincipal user) {
        quizService.submitQuizAttempt(attemptRequest, user.getId());
        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @DeleteMapping("/{code}")
    ResponseEntity<?> removeQuiz(@PathVariable(name = "code") String code, @AuthenticationPrincipal AppUserPrincipal user) {
        quizService.deleteQuiz(code, user.getId());
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }

    @GetMapping("/{code}/summary")
    ResponseEntity<QuizSummaryResponse> summaryQuiz(@PathVariable(name = "code") String code, @AuthenticationPrincipal AppUserPrincipal user) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(quizService.getQuizSummary(code, user.getId()));
    }

    @GetMapping("/option/{id}/can-eliminate")
    ResponseEntity<Map<String, Boolean>> checkToEliminate(@PathVariable(name = "id") int optionId) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of("correct", quizService.checkIfAbleToEliminate(optionId)));
    }
}