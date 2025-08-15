package com.quizzo.service;

import com.quizzo.dto.AnswerResponse;
import com.quizzo.dto.QuestionResponse;
import com.quizzo.dto.QuizAttemptDetailsResponse;
import com.quizzo.dto.QuizDetailsResponse;
import com.quizzo.exception.QuizNotFoundException;
import com.quizzo.model.Answer;
import com.quizzo.model.Question;
import com.quizzo.model.Quiz;
import com.quizzo.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class QuizService {

    private final QuizRepository quizRepository;

    public QuizService(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    public QuizDetailsResponse getQuizByCode(String code) {
        Quiz quiz = getQuiz(code);

        List<Question> questionsCopy = new ArrayList<>(quiz.getQuestions());
        Collections.shuffle(questionsCopy);

        List<QuestionResponse> questionResponses = new ArrayList<>();

        for (Question q : questionsCopy) {
            List<Answer> answersCopy = new ArrayList<>(q.getAnswers());
            Collections.shuffle(answersCopy);

            List<AnswerResponse> answerDtos = answersCopy.stream()
                            .map(adto -> new AnswerResponse(
                                    adto.getId(),
                                    adto.getValue(),
                                    adto.getCorrect()
                            )).toList();

            questionResponses.add(new QuestionResponse(
                    q.getId(),
                    q.getValue(),
                    answerDtos
            ));
        }

        return new QuizDetailsResponse(
                quiz.getId(),
                quiz.getTitle(),
                quiz.getCode(),
                quiz.getCreateTime(),
                quiz.getDurationTime(),
                quiz.getEliminationsCount(),
                questionResponses
        );
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

    private float calculateScore(int correct, int total) {
        return Math.round(100f * correct / total);
    }
}
