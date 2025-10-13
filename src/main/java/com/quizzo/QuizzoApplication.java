package com.quizzo;

import com.quizzo.model.*;
import com.quizzo.repository.AttemptRepository;
import com.quizzo.repository.QuizRepository;
import com.quizzo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.LocalDateTime;
import java.util.Random;

@SpringBootApplication
public class QuizzoApplication implements CommandLineRunner {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AttemptRepository attemptRepository;

    public static void main(String[] args) {
        SpringApplication.run(QuizzoApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        User user = new User("rokan", "$2a$12$xfVtryzg3YSW3fezzEb/YOjZT1WKXs0Px92sLeRSxgF/k9WBRAKf6", "robert.kania@onet.pl", LocalDateTime.now());

        Quiz quiz = new Quiz();
        quiz.setTitle("Quiz about animals");
        quiz.setCreateTime(LocalDateTime.now());
        quiz.setDurationTime(20.5f);
        quiz.setEliminationsCount(3);
        quiz.setActive(true);

        quiz.setOwner(user);
        user.getCreatedQuizzes().add(quiz);

        String code = generateCode();
        while (quizRepository.existsByCode(code)) {
            code = generateCode();
        }
        quiz.setCode(code.toUpperCase());

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

        userRepository.save(user);

        Attempt attempt = new Attempt(
                user,
                quiz,
                60,
                LocalDateTime.now()
        );

        user.getAttempts().add(attempt);
        quiz.getUserAttempts().add(attempt);
        attemptRepository.save(attempt);
    }

    private String generateCode() {
        int length = 5;
        String positions = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder(length);

        for (int i = 0; i < 5; i++) {
            char r = positions.charAt(new Random().nextInt(positions.length()));
            code.append(r);
        }
        return code.toString();
    }
}
