package com.quizzo.dto;

import java.util.List;

public record AttemptRequest(Integer quizId,
                             List<SubmittedAnswerRequest> answers) {
}