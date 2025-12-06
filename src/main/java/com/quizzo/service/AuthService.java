package com.quizzo.service;

import com.quizzo.config.JwtService;
import com.quizzo.dto.*;
import com.quizzo.exception.*;
import com.quizzo.model.User;
import com.quizzo.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtService jwtService, AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }

    public Map<String, String> loginUser(LoginRequest request) {
        if(request.login() == null || request.login().isBlank() ||
                request.password() == null || request.password().isBlank())
            throw new IncorrectLoginDataException("Login data cannot be empty or null");

        User user;
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.login(), request.password()));

            user = userRepository.findByLogin(request.login())
                    .orElseThrow(() -> new UserNotFoundException("User with login " + request.login() + " not found"));
        } catch (Exception ex) {
            throw new IncorrectLoginDataException(ex.getMessage());
        }

        String access = jwtService.createAccess(
                user.getId(),
                user.getLogin());
        String refresh = jwtService.createRefresh(
                user.getId(),
                user.getLogin()
        );

        return Map.of("access", access,
                "refresh", refresh);
    }

    public void registerUser(RegisterRequest request) {
        if(request.login() == null || request.login().isBlank() ||
        request.password() == null || request.password().isBlank() ||
        request.email() == null || request.email().isBlank())
            throw new IncorrectUserDataException("Incorrect register data");

        if (userRepository.existsByLogin(request.login()))
            throw new LoginAlreadyTakenException("Login " + request.login() + " already taken");

        if (userRepository.existsByEmail(request.email()))
            throw new EmailAlreadyTakenException("Email " + request.email() + " already taken");

        User user = new User();
        
        user.setLogin(request.login());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setCreateTime(LocalDateTime.now());
        userRepository.save(user);
    }

    public String getAccessTokenByRefresh(String refresh) {
        if (refresh == null || refresh.isBlank())
            throw new UnauthorizedException("Incorrect refresh token");

        Claims claims = jwtService.parseRefresh(refresh);
        User user = userRepository.findByLogin(claims.getSubject())
                .orElseThrow(() -> new UserNotFoundException("User with login " + claims.getSubject() + " not found"));

        return jwtService.createAccess(user.getId(), user.getLogin());
    }
}