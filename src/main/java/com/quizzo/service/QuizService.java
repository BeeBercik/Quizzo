package com.quizzo.service;

import com.quizzo.dto.QuizAttemptDetailsDto;
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

    public Quiz getQuizByCode(String code) {
        return quizRepository.findByCode(code).orElseThrow(
                () -> new QuizNotFoundException("Quiz " + code + " not found"));
    }

    public QuizAttemptDetailsDto getQuizAttemptDetails(String code) {
        Quiz q = quizRepository.findByCode(code).orElseThrow(
                () -> new QuizNotFoundException("Quiz " + code + " not found"));

        return new QuizAttemptDetailsDto(
                q.getTitle(),
                q.getDurationTime(),
                q.getQuestions().size(),
                q.getEliminationsCount()
        );
    }
}
