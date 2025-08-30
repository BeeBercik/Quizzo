package com.quizzo.controller;

import com.quizzo.dto.LoginRequest;
import com.quizzo.dto.UserIdentityDto;
import com.quizzo.dto.UserProfileResponse;
import com.quizzo.service.AuthService;
import com.quizzo.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    ResponseEntity<UserProfileResponse> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        session.setAttribute("user", authService.login(loginRequest));
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(userService.getUserProfileData(loginRequest));
    }

    @GetMapping
    ResponseEntity<UserProfileResponse> getLoggedUser(HttpSession session) {
        UserIdentityDto user = authService.getLoggedUser(session);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(userService.getUserProfileData(user.id()));
    }

    @PostMapping("/logout")
    ResponseEntity<?> logoutUser(HttpSession session) {
        session.invalidate();
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }
}
