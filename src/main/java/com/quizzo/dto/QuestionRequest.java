package com.quizzo.dto;

import java.util.List;

public record QuestionRequest(
        String question,
        List<AnswerRequest> answers) {
}
