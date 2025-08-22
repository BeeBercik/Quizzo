package com.quizzo.service;

import com.quizzo.dto.*;
import com.quizzo.exception.QuizNotFoundException;
import com.quizzo.exception.UserNotLoggedException;
import com.quizzo.model.*;
import com.quizzo.repository.*;
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
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final AttemptRepository attemptRepository;

    public QuizService(QuizRepository quizRepository, UserRepository userRepository, QuestionRepository questionRepository, AnswerRepository answerRepository, AttemptRepository attemptRepository) {
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.attemptRepository = attemptRepository;
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

        quiz.setTitle(capitalizeFirstLetter(createdQuiz.title()));
        quiz.setCode(generateCode());
        quiz.setCreateTime(LocalDateTime.now());

        quiz.setDurationTime(Float.parseFloat(createdQuiz.time()));
        quiz.setEliminationsCount(createdQuiz.eliminations());

        List<Question> questions = createdQuiz.questionsData().stream()
                .map(qDto -> {
                    Question q = new Question();
                    q.setValue(capitalizeFirstLetter(qDto.question()));
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

    public void submitQuizAttempt(AttemptRequest attempt, HttpSession session) {
        Integer quizId = attempt.quizId();
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(() -> new QuizNotFoundException("Quiz not found"));

        Attempt attemptEntity = new Attempt();
        attemptEntity.setQuiz(quiz);
        attemptEntity.setAttemptTime(LocalDateTime.now());

        UserIdentityDto userIdentityDto = (UserIdentityDto) session.getAttribute("user");
        User user = userRepository.findById(userIdentityDto.id()).orElseThrow(() -> new UserNotLoggedException("User not logged in"));
        attemptEntity.setUser(user);

        int goodAnswers = 0;
        for (SubmittedAnswerRequest submittedAnswer : attempt.answers()) {
            Integer submittedAnswerId = submittedAnswer.selectedAnswerId();
            Integer questionId = submittedAnswer.questionId();

            List<Answer> answers = questionRepository.findById(questionId).orElseThrow().getAnswers();
            for(Answer a : answers) {
                if(a.getId().equals(submittedAnswerId) && a.getCorrect())
                    goodAnswers++;
            }
        }
        attemptEntity.setScore(Math.round(goodAnswers * 100f / attempt.answers().size()));

        attemptRepository.save(attemptEntity);
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

    private String capitalizeFirstLetter(String text) {
        if (text == null || text.isBlank()) {
            return text;
        }
        return text.substring(0, 1).toUpperCase() + text.substring(1);
    }

    private Quiz getQuiz(String code) {
        return quizRepository.findByCode(code.trim().toUpperCase())
                .orElseThrow(() -> new QuizNotFoundException("Quiz " + code + " not found"));
    }

    private float calculateScore(int correct, int total) {
        return Math.round(100f * correct / total);
    }
}
