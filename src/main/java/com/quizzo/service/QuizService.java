package com.quizzo.service;

import com.quizzo.dto.QuizAttemptDetailsResponse;
import com.quizzo.dto.QuizResponse;
import com.quizzo.exception.QuizNotFoundException;
import com.quizzo.model.Quiz;
import com.quizzo.repository.QuizRepository;
import org.springframework.stereotype.Service;

@Service
public class QuizService {

    private final QuizRepository quizRepository;

    public QuizService(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    public QuizResponse getQuizByCode(String code) {
        Quiz q = getQuiz(code);
        return new QuizResponse(
                q.getId(),
                q.getTitle(),
                q.getCode(),
                q.getCreateTime(),
                q.getDurationTime(),
                q.getEliminationsCount(),
                q.getQuestions());
    }

    public QuizAttemptDetailsResponse getQuizAttemptDetails(String code) {
        Quiz q = getQuiz(code);
        return new QuizAttemptDetailsResponse(
                q.getTitle(),
                q.getDurationTime(),
                q.getQuestions().size(),
                q.getEliminationsCount()
        );
    }

    private Quiz getQuiz(String code) {
        return quizRepository.findByCode(code.trim().toUpperCase())
                .orElseThrow(() -> new QuizNotFoundException("Quiz " + code + " not found"));
    }
}
