package com.quizzo.dto;

public record SubmittedAnswerRequest(Integer questionId,
                                     Integer selectedAnswerId) {
}