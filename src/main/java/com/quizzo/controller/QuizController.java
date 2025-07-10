package com.quizzo.controller;

import com.quizzo.model.Answer;
import com.quizzo.model.Question;
import com.quizzo.model.Quiz;
import com.quizzo.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizRepository quizRepository;

    @GetMapping
    ResponseEntity<List<Quiz>> getQuizzes() {
        return ResponseEntity.
                status(HttpStatus.OK)
                .body(quizRepository.findAll());
    }

    @PostMapping("/init")
    void init() {
        Quiz quiz = new Quiz();
        quiz.setTitle("Quiz about animals");
        quiz.setDateTime(LocalDateTime.now());

        Question q1 = new Question();
        q1.setValue("What color is elephant?");
        q1.setQuiz(quiz);

        Answer q1a1 = new Answer();
        q1a1.setValue("red");
        q1a1.setCorrect(Boolean.valueOf("false"));
        q1a1.setQuestion(q1);

        Answer q1a2 = new Answer();
        q1a2.setValue("blue");
        q1a2.setCorrect(Boolean.valueOf("true"));
        q1a2.setQuestion(q1);

        q1.getAnswers().add(q1a1);
        q1.getAnswers().add(q1a2);

        quiz.getQuestions().add(q1);

        quizRepository.save(quiz);
    }
}
