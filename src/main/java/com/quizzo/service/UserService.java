package com.quizzo.service;

import com.quizzo.dto.AttemptResponse;
import com.quizzo.dto.LoginRequest;
import com.quizzo.dto.CreatedQuizDetailsResponse;
import com.quizzo.dto.UserProfileResponse;
import com.quizzo.exception.IncorrectUserDataException;
import com.quizzo.exception.UnauthorizedException;
import com.quizzo.exception.UserNotFoundException;
import com.quizzo.model.Attempt;
import com.quizzo.model.Quiz;
import com.quizzo.model.User;
import com.quizzo.repository.AttemptRepository;
import com.quizzo.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AttemptRepository attemptRepository;

    public UserService(UserRepository userRepository, AttemptRepository attemptRepository) {
        this.userRepository = userRepository;
        this.attemptRepository = attemptRepository;
    }

    public UserProfileResponse getLoggedUserProfileData(UserDetails userDetails) {
        if (userDetails == null)
            throw new UnauthorizedException("User not logged in");

        User user = userRepository.findByLogin(userDetails.getUsername())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return buildUserProfile(user);
    }

    public UserProfileResponse getUserProfileData(LoginRequest loginRequest) {
        User user = userRepository.findByLogin(loginRequest.login())
                .orElseThrow(() -> new UserNotFoundException("User with such login not found"));
        return buildUserProfile(user);
    }

    private UserProfileResponse buildUserProfile(User user) {
        List<AttemptResponse> attemptResponses = attemptRepository.findAllByUserOrderByAttemptTimeDesc(user).stream()
                .map(this::convertToAttemptResponse)
                .collect(Collectors.toList());

        List<CreatedQuizDetailsResponse> createdQuizzes = user.getCreatedQuizzes().stream()
                .filter(Quiz::getActive)
                .map(this::convertToQuizResponse)
                .collect(Collectors.toList());

        return new UserProfileResponse(
                user.getId(),
                user.getLogin(),
                attemptResponses,
                createdQuizzes
        );
    }

    private AttemptResponse convertToAttemptResponse(Attempt attempt) {
        return new AttemptResponse(
                attempt.getId(),
                attempt.getQuiz().getTitle(),
                attempt.getScore()
        );
    }

    private CreatedQuizDetailsResponse convertToQuizResponse(Quiz quiz) {
        return new CreatedQuizDetailsResponse(
                quiz.getTitle(),
                quiz.getCode()
        );
    }
}