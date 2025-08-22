package com.quizzo.service;

import com.quizzo.dto.*;
import com.quizzo.exception.QuizNotFoundException;
import com.quizzo.exception.UserNotLoggedException;
import com.quizzo.model.Answer;
import com.quizzo.model.Question;
import com.quizzo.model.Quiz;
import com.quizzo.model.User;
import com.quizzo.repository.QuizRepository;
import com.quizzo.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final UserRepository userRepository;

    public QuizService(QuizRepository quizRepository, UserRepository userRepository) {
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
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

    public void saveQuiz(CreatedQuizRequest createdQuiz, HttpSession session) {
        Quiz quiz = new Quiz();

        quiz.setTitle("Temporary title");
        quiz.setCode(generateCode());
        quiz.setCreateTime(LocalDateTime.now());

        quiz.setDurationTime(Float.parseFloat(createdQuiz.time()));
        quiz.setEliminationsCount(createdQuiz.eliminations());

        List<Question> questions = createdQuiz.questionsData().stream()
                .map(qDto -> {
                    Question q = new Question();
                    q.setValue(qDto.question());
                    q.setQuiz(quiz);

                    List<Answer> answers = qDto.answers().stream()
                            .map(aDto -> {
                                Answer a = new Answer();
                                a.setValue(aDto.value());
                                a.setCorrect(aDto.correct());
                                a.setQuestion(q);
                                return a;
                    }).collect(Collectors.toList());

                    q.setAnswers(answers);
                    return q;
                }).collect(Collectors.toList());

        quiz.setQuestions(questions);

        UserIdentityDto userIdentityDto = (UserIdentityDto) session.getAttribute("user");
        User user = userRepository.findById(userIdentityDto.id()).orElseThrow(() -> new UserNotLoggedException("User not logged in"));

        quiz.setOwner(user);
        quizRepository.save(quiz);
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

    private Quiz getQuiz(String code) {
        return quizRepository.findByCode(code.trim().toUpperCase())
                .orElseThrow(() -> new QuizNotFoundException("Quiz " + code + " not found"));
    }

    private float calculateScore(int correct, int total) {
        return Math.round(100f * correct / total);
    }
}
