package com.quizzo.service;

import com.quizzo.dto.*;
import com.quizzo.exception.AnswerNotFoundException;
import com.quizzo.exception.QuizNotActiveException;
import com.quizzo.exception.QuizNotFoundException;
import com.quizzo.exception.UnauthorizedException;
import com.quizzo.model.*;
import com.quizzo.repository.*;
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
    private final AttemptRepository attemptRepository;
    private final AnswerRepository answerRepository;

    public QuizService(QuizRepository quizRepository, UserRepository userRepository, QuestionRepository questionRepository, AttemptRepository attemptRepository, AnswerRepository answerRepository) {
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
        this.answerRepository = answerRepository;
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

    public void saveQuiz(CreatedQuizRequest createdQuiz, Integer userId) {
        Quiz quiz = new Quiz();

        quiz.setTitle(capitalizeFirstLetter(createdQuiz.title()));
        quiz.setCode(generateCode());
        quiz.setCreateTime(LocalDateTime.now());
        quiz.setActive(true);

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

        User user = userRepository.findById(userId).orElseThrow(() -> new UnauthorizedException("User not logged in"));

        quiz.setOwner(user);
        quizRepository.save(quiz);
    }

    public void submitQuizAttempt(AttemptRequest attempt, Integer userId) {
        Integer quizId = attempt.quizId();
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(() -> new QuizNotFoundException("Quiz not found"));

        Attempt attemptEntity = new Attempt();
        attemptEntity.setQuiz(quiz);
        attemptEntity.setAttemptTime(LocalDateTime.now());

        User user = userRepository.findById(userId).orElseThrow(() -> new UnauthorizedException("User not logged in"));
        attemptEntity.setUser(user);

        int goodAnswers = 0;
        for (SubmittedAnswerRequest submittedAnswer : attempt.answers()) {
            Integer submittedAnswerId = submittedAnswer.selectedAnswerId();
            Integer questionId = submittedAnswer.questionId();

            List<Answer> answers = questionRepository.findById(questionId).orElseThrow().getAnswers();
            for (Answer a : answers) {
                if (a.getId().equals(submittedAnswerId) && a.getCorrect())
                    goodAnswers++;
            }
        }
        attemptEntity.setScore(Math.round(goodAnswers * 100f / attempt.answers().size()));

        attemptRepository.save(attemptEntity);
    }

    public void deleteQuiz(String code, Integer userId) {
        Quiz quiz = getSpecificUserQuiz(code, userId);
        quiz.setActive(false);

        quizRepository.save(quiz);
    }

    public QuizSummaryResponse getQuizSummary(String code, Integer userId) {
        Quiz quiz = getSpecificUserQuiz(code, userId);

        List<User> users = userRepository.findDistinctByAttemptsOfQuiz(quiz.getId());

        List<UserAttemptsSummaryResponse> userSummaries = users.stream()
                .map(u -> {
                    List<UserResultSummaryResponse> attemptResponses = u.getAttempts().stream()
                            .map(attempt -> new UserResultSummaryResponse(
                                    attempt.getScore(),
                                    attempt.getAttemptTime()
                            )).toList();

                    return new UserAttemptsSummaryResponse(
                            u.getLogin(),
                            u.getEmail(),
                            attemptResponses);
                })
                .toList();

        return new QuizSummaryResponse(
                quiz.getTitle(),
                quiz.getCode(),
                userSummaries,
                quiz.getCreateTime());
    }

    private Quiz getSpecificUserQuiz(String code, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User not logged in"));

        Quiz quiz = getQuiz(code);
        if (!user.getCreatedQuizzes().contains(quiz))
            throw new IllegalArgumentException("Quiz does not belong to the user");

        return quiz;
    }

    private String generateCode() {
        int length = 5;
        String positions = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder(length);

        for (int i = 0; i < 5; i++) {
            char r = positions.charAt(new Random().nextInt(positions.length()));
            code.append(r);
        }
        return code.toString().toUpperCase();
    }

    private String capitalizeFirstLetter(String text) {
        if (text == null || text.isBlank()) {
            return text;
        }
        return text.substring(0, 1).toUpperCase() + text.substring(1);
    }

    private Quiz getQuiz(String code) {
        Quiz quiz = quizRepository.findByCode(code.trim().toUpperCase())
                .orElseThrow(() -> new QuizNotFoundException("Quiz " + code + " not found"));

        if (!quiz.getActive())
            throw new QuizNotActiveException("Quz not active");

        return quiz;
    }

    public Boolean checkIfAbleToEliminate(int id) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new AnswerNotFoundException("Answer with such id does not exist"));
        return answer.getCorrect();
    }
}
