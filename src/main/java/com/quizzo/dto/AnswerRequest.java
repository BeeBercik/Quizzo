package com.quizzo.dto;

public record AnswerRequest(
        String value,
        boolean correct
) {}
