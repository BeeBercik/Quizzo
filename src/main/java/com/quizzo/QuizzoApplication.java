package com.quizzo;

import com.quizzo.model.Answer;
import com.quizzo.model.Question;
import com.quizzo.model.Quiz;
import com.quizzo.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.LocalDateTime;

@SpringBootApplication
public class QuizzoApplication implements CommandLineRunner {

    @Autowired
    private QuizRepository quizRepository;

    public static void main(String[] args) {
        SpringApplication.run(QuizzoApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        Quiz quiz = new Quiz();
        quiz.setTitle("Quiz about animals");
        quiz.setCreateTime(LocalDateTime.now());
        quiz.setDurationTime(20.5f);
        quiz.setEliminationsCount(3);

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
