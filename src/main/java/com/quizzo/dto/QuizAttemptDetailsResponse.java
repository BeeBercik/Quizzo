package com.quizzo.dto;

public record QuizAttemptDetailsResponse(String name,
                                         Float durationTime,
                                         Integer questions,
                                         Integer eliminationsCount) {
}