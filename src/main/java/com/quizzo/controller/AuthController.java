package com.quizzo.controller;

import com.quizzo.dto.LoginRequest;
import com.quizzo.dto.RegisterRequest;
import com.quizzo.dto.UserProfileResponse;
import com.quizzo.service.AuthService;
import com.quizzo.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

import static org.springframework.http.HttpHeaders.SET_COOKIE;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthService authService;

    public AuthController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse res) {
        Map<String, String> result = authService.loginUser(request);

        ResponseCookie cookie = ResponseCookie.from("refresh", result.get("refresh"))
                .httpOnly(true)
                .secure(false)
                .sameSite("Strict")
                .path("/api/auth")
                .maxAge(Duration.ofDays(14))
                .build();
        res.addHeader(SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(Map.of(
                "access", result.get("access"),
                "profile", userService.getUserProfileData(request)));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        authService.registerUser(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/logged")
    public ResponseEntity<UserProfileResponse> logged(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(authService.getLoggedUserProfileData(userDetails));
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refresh(@CookieValue(value = "refresh", required = false) String refresh) {
        return ResponseEntity.ok(Map.of("access",
                authService.getAccessTokenByRefresh(refresh)));
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