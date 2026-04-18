package com.quizzo.dto;

import java.util.List;

public record SubmittedAnswerRequest(Integer questionId,
                                     List<Integer> selectedAnswerIds) {
}