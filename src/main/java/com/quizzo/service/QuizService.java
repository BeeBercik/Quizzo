package com.quizzo.service;

import com.quizzo.dto.*;
import com.quizzo.exception.*;
import com.quizzo.model.*;
import com.quizzo.repository.*;
import com.quizzo.validators.QuizDataValidator;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class QuizService {

    private final Integer MAX_QUIZ_CODE_LENGTH = 5;

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
        return mapQuizToDetailsResponse(getQuiz(code), true);
    }

    public QuizDetailsResponse getQuizDetailsForOwner(String code, Integer userId) {
        Quiz quiz = getSpecificUserQuiz(code, userId);
        return mapQuizToDetailsResponse(quiz, false);
    }

    public QuizAttemptDetailsResponse getQuizAttemptDetails(String code) {
        Quiz q = getQuiz(code);
        return new QuizAttemptDetailsResponse(
                q.getTitle(),
                q.getDurationTime(),
                q.getQuestions().size(),
                q.getEliminationsCount(),
                q.getMultipleChoice()
        );
    }

    public void saveQuiz(CreatedQuizRequest createdQuiz, Integer userId) {
        QuizDataValidator.validateQuizData(createdQuiz);
        Quiz quiz = new Quiz();

        quiz.setTitle(capitalizeFirstLetter(createdQuiz.title()));
        quiz.setCode(generateCode());
        quiz.setCreateTime(LocalDateTime.now());
        quiz.setActive(true);

        quiz.setDurationTime(Float.parseFloat(createdQuiz.time()));
        quiz.setEliminationsCount(createdQuiz.eliminations());
        quiz.setMultipleChoice(createdQuiz.multipleChoice());
        quiz.setQuestions(buildQuestions(createdQuiz.questionsData(), quiz));

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

        List<SubmittedAnswerRequest> submittedAnswers = attempt.answers();
        if (submittedAnswers == null || submittedAnswers.isEmpty()) {
            attemptEntity.setScore(0);
            attemptRepository.save(attemptEntity);
            return;
        }

        int goodAnswers = 0;
        for (SubmittedAnswerRequest submittedAnswer : submittedAnswers) {
            Integer questionId = submittedAnswer.questionId();

            List<Answer> answers = questionRepository.findById(questionId).orElseThrow().getAnswers();
            Set<Integer> selectedAnswerIds = submittedAnswer.selectedAnswerIds() == null
                    ? Set.of()
                    : new HashSet<>(submittedAnswer.selectedAnswerIds());
            Set<Integer> correctAnswerIds = answers.stream()
                    .filter(Answer::getCorrect)
                    .map(Answer::getId)
                    .collect(Collectors.toSet());

            if (selectedAnswerIds.equals(correctAnswerIds))
                goodAnswers++;
        }
        attemptEntity.setScore(Math.round(goodAnswers * 100f / submittedAnswers.size()));

        attemptRepository.save(attemptEntity);
    }

    public void deleteQuiz(String code, Integer userId) {
        Quiz quiz = getSpecificUserQuiz(code, userId);
        quiz.setActive(false);

        quizRepository.save(quiz);
    }

    public void updateQuiz(String code, CreatedQuizRequest updatedQuiz, Integer userId) {
        QuizDataValidator.validateQuizData(updatedQuiz);
        Quiz quiz = getSpecificUserQuiz(code, userId);

        quiz.setTitle(capitalizeFirstLetter(updatedQuiz.title()));
        quiz.setDurationTime(Float.parseFloat(updatedQuiz.time()));
        quiz.setEliminationsCount(updatedQuiz.eliminations());
        quiz.setMultipleChoice(updatedQuiz.multipleChoice());

        List<Question> questions = buildQuestions(updatedQuiz.questionsData(), quiz);

        quiz.getQuestions().clear();
        quiz.getQuestions().addAll(questions);

        quizRepository.save(quiz);
    }

    public QuizSummaryResponse getQuizSummary(String code, Integer userId) {
        Quiz quiz = getSpecificUserQuiz(code, userId);

        List<User> users = userRepository.findDistinctByAttemptsOfQuiz(quiz.getId());

        List<UserAttemptsSummaryResponse> userSummaries = users.stream()
                .map(u -> {
                    List<UserResultSummaryResponse> attemptResponses = u.getAttempts().stream()
                            .filter(attempt -> attempt.getQuiz() != null && attempt.getQuiz().getId().equals(quiz.getId()))
                            .sorted(Comparator.comparing(Attempt::getAttemptTime).reversed())
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

    public Boolean checkIfAbleToEliminate(int id) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new AnswerNotFoundException("Answer with such id does not exist"));
        return answer.getCorrect();
    }

    private List<Question> buildQuestions(List<QuestionRequest> questionRequests, Quiz quiz) {
        return questionRequests.stream()
                .map(qDto -> {
                    Question question = new Question();
                    question.setValue(capitalizeFirstLetter(qDto.question()));
                    question.setQuiz(quiz);

                    List<Answer> answers = qDto.answers().stream()
                            .map(aDto -> {
                                Answer answer = new Answer();
                                answer.setValue(aDto.value());
                                answer.setCorrect(aDto.correct());
                                answer.setQuestion(question);
                                return answer;
                            }).collect(Collectors.toList());

                    question.setAnswers(answers);
                    return question;
                }).collect(Collectors.toList());
    }

    private QuizDetailsResponse mapQuizToDetailsResponse(Quiz quiz, boolean shuffle) {
        List<Question> questionsCopy = new ArrayList<>(quiz.getQuestions());
        if (shuffle)
            Collections.shuffle(questionsCopy);
        else
            questionsCopy.sort(Comparator.comparing(Question::getId));

        List<QuestionResponse> questionResponses = new ArrayList<>();

        for (Question q : questionsCopy) {
            List<Answer> answersCopy = new ArrayList<>(q.getAnswers());
            if (shuffle)
                Collections.shuffle(answersCopy);
            else
                answersCopy.sort(Comparator.comparing(Answer::getId));

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
                quiz.getMultipleChoice(),
                questionResponses
        );
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
        String positions = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder(MAX_QUIZ_CODE_LENGTH);

        for (int i = 0; i < MAX_QUIZ_CODE_LENGTH; i++) {
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
                .orElseThrow(() -> new QuizNotFoundException("Quiz " + code.toUpperCase() + " not found"));

        if (!quiz.getActive())
            throw new QuizNotActiveException("Quz not active");

        return quiz;
    }
}
