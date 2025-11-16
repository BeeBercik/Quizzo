package com.quizzo.dto;

public record RegisterRequest(String login,
                              String email,
                              String password) {
}