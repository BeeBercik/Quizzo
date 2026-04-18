package com.quizzo.controller;

import com.quizzo.config.AppUserPrincipal;
import com.quizzo.dto.AdminQuizResponse;
import com.quizzo.dto.AdminUserResponse;
import com.quizzo.dto.RoleUpdateRequest;
import com.quizzo.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    ResponseEntity<List<AdminUserResponse>> getUsers() {
        return ResponseEntity.ok(adminService.getUsers());
    }

    @PatchMapping("/users/{id}/role")
    ResponseEntity<?> updateUserRole(@PathVariable(name = "id") Integer userId,
                                     @AuthenticationPrincipal AppUserPrincipal user,
                                     @RequestBody RoleUpdateRequest request) {
        adminService.updateUserRole(userId, user.getId(), request.role());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/users/{id}")
    ResponseEntity<?> deactivateUser(@PathVariable(name = "id") Integer userId,
                                     @AuthenticationPrincipal AppUserPrincipal user) {
        adminService.deactivateUser(userId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/users/{id}/activate")
    ResponseEntity<?> activateUser(@PathVariable(name = "id") Integer userId,
                                   @AuthenticationPrincipal AppUserPrincipal user) {
        adminService.activateUser(userId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/quizzes")
    ResponseEntity<List<AdminQuizResponse>> getQuizzes() {
        return ResponseEntity.ok(adminService.getQuizzes());
    }

    @DeleteMapping("/quizzes/{code}")
    ResponseEntity<?> deactivateQuiz(@PathVariable(name = "code") String code) {
        adminService.deactivateQuiz(code);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/quizzes/{code}/activate")
    ResponseEntity<?> activateQuiz(@PathVariable(name = "code") String code) {
        adminService.activateQuiz(code);
        return ResponseEntity.noContent().build();
    }
}
