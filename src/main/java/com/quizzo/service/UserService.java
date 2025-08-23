package com.quizzo.service;

import com.quizzo.dto.AttemptResponse;
import com.quizzo.dto.LoginRequest;
import com.quizzo.dto.QuizSummaryResponse;
import com.quizzo.dto.UserProfileResponse;
import com.quizzo.exception.IncorrectUserDataException;
import com.quizzo.model.Attempt;
import com.quizzo.model.Quiz;
import com.quizzo.model.User;
import com.quizzo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserProfileResponse getUserProfileData(LoginRequest loginRequest) {
        User user = userRepository.findByLogin(loginRequest.login())
                .orElseThrow(() -> new IncorrectUserDataException("User with such login does not exist"));
        return buildUserProfile(user);
    }

    public UserProfileResponse getUserProfileData(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IncorrectUserDataException("User with such login does not exist"));
       return buildUserProfile(user);
    }

    private UserProfileResponse buildUserProfile(User user) {
        List<AttemptResponse> attemptResponses = user.getAttempts().stream()
                .map(this::convertToAttemptResponse)
                .collect(Collectors.toList());

        List<QuizSummaryResponse> quizResponses = user.getCreatedQuizzes().stream()
                .filter(Quiz::getActive)
                .map(this::convertToQuizResponse)
                .collect(Collectors.toList());

        return new UserProfileResponse(
                user.getId(),
                user.getLogin(),
                attemptResponses,
                quizResponses
        );
    }

    private AttemptResponse convertToAttemptResponse(Attempt attempt) {
        return new AttemptResponse(
                attempt.getId(),
                attempt.getQuiz().getTitle(),
                attempt.getScore()
        );
    }

    private QuizSummaryResponse convertToQuizResponse(Quiz quiz) {
        return new QuizSummaryResponse(
                quiz.getTitle(),
                quiz.getCode()
        );
    }
}
