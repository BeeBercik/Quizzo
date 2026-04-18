package com.quizzo.service;

import com.quizzo.config.JwtService;
import com.quizzo.dto.*;
import com.quizzo.exception.*;
import com.quizzo.model.Role;
import com.quizzo.model.User;
import com.quizzo.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class AuthService {

    private final static Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9]+([.#+_-][a-zA-Z0-9]+)*@([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\\.)+[a-zA-Z]{2,}$");

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
        } catch (DisabledException ex) {
            throw new IncorrectLoginDataException("User account not activated");
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
        checkRegisterData(request);
        User user = new User();
        
        user.setLogin(request.login());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setCreateTime(LocalDateTime.now());
        user.setActive(true);
        user.setRole(userRepository.count() == 0 ? Role.ADMIN : Role.USER);
        userRepository.save(user);
    }

    public String getAccessTokenByRefresh(String refresh) {
        if (refresh == null || refresh.isBlank())
            throw new UnauthorizedException("Incorrect refresh token");

        Claims claims = jwtService.parseRefresh(refresh);
        User user = userRepository.findByLogin(claims.getSubject())
                .orElseThrow(() -> new UserNotFoundException("User with login " + claims.getSubject() + " not found"));

        if (Boolean.FALSE.equals(user.getActive()))
            throw new UnauthorizedException("User account not activated");

        return jwtService.createAccess(user.getId(), user.getLogin());
    }

    private void checkRegisterData(RegisterRequest request) {
        if (request.login() == null || request.login().isBlank() ||
                request.password() == null || request.password().isBlank() ||
                request.email() == null || request.email().isBlank())
            throw new IncorrectUserDataException("Incorrect register data");

        if (request.login().length() < 8 ||
                request.password().length() < 10)
            throw new IncorrectUserDataException("Login must be at least 8 and password at least 10 characters long");

        if(!EMAIL_PATTERN.matcher(request.email()).matches())
            throw new IncorrectUserDataException("Invalid email format");
        if (userRepository.existsByLogin(request.login()))
            throw new LoginAlreadyTakenException("Login " + request.login() + " already taken");
        if (userRepository.existsByEmail(request.email()))
            throw new EmailAlreadyTakenException("Email " + request.email() + " already taken");
    }
}