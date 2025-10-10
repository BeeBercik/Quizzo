package com.quizzo.controller;

import com.quizzo.config.JwtService;
import com.quizzo.dto.LoginRequest;
import com.quizzo.dto.UserProfileResponse;
import com.quizzo.model.User;
import com.quizzo.repository.UserRepository;
import com.quizzo.service.UserService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

import static org.springframework.http.HttpHeaders.SET_COOKIE;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService, UserRepository userRepository, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletResponse res) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.login(), req.password())
        );

        User user = userRepository.findByLogin(req.login())
                .orElseThrow();
        String access = jwtService.createAccess(
                user.getId(),
                user.getLogin());
        String refresh = jwtService.createRefresh(
                user.getId(),
                user.getLogin()
        );

        ResponseCookie cookie = ResponseCookie.from("refresh", refresh)
                .httpOnly(true)
                .secure(false)
                .sameSite("Strict")
                .path("/api/auth")
                .maxAge(Duration.ofDays(14))
                .build();
        res.addHeader(SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(Map.of(
                "access", access,
                "profile", userService.getUserProfileData(req)
        ));
    }

    @GetMapping("/logged")
    public ResponseEntity<UserProfileResponse> logged(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null)
            return ResponseEntity.status(401).build();

        UserProfileResponse profile = userService.getUserProfileData(userDetails.getUsername());
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(value = "refresh", required = false) String refresh) {
        if (refresh == null || refresh.isBlank())
             return ResponseEntity.status(401).build();

        try {
            Claims claims = jwtService.parseRefresh(refresh);
            User user = userRepository.findByLogin(claims.getSubject())
                    .orElseThrow();
            String access = jwtService.createAccess(user.getId(), user.getLogin());

            return ResponseEntity.ok(Map.of("access", access));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse res) {
        ResponseCookie cleared = ResponseCookie.from("refresh", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Strict")
                .path("/api/auth")
                .maxAge(0)
                .build();

        res.addHeader(SET_COOKIE, cleared.toString());

        return ResponseEntity.noContent().build();
    }
}