package com.quizzo.dto;

import java.util.List;

public record QuestionResponse(Integer id,
                               String value,
                               List<AnswerResponse> answers) {
}
