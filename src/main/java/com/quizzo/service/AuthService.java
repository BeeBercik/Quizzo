package com.quizzo.service;

import com.quizzo.dto.*;
import com.quizzo.exception.IncorrectUserDataException;
import com.quizzo.exception.UserNotLoggedException;
import com.quizzo.model.User;
import com.quizzo.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserIdentityDto login(LoginRequest loginRequest) {
        User user = userRepository.findByLogin(loginRequest.login())
                .orElseThrow(() -> new IncorrectUserDataException("User with such login does not exist"));

        if(!user.getPassword().equals(loginRequest.password()))
            throw new IncorrectUserDataException("Incorrect password");

        return new UserIdentityDto(user.getId(), user.getLogin());
    }

    public UserIdentityDto getLoggedUser(HttpSession session) {
        UserIdentityDto user = (UserIdentityDto) session.getAttribute("user");
        if(user == null) throw new UserNotLoggedException("User not logged in");

        return user;
    }
}
