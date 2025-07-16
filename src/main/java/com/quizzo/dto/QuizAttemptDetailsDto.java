package com.quizzo.dto;

public record QuizAttemptDetailsDto(String name,
                                    Float durationTime,
                                    Integer questions,
                                    Integer eliminationsCount) {
}
