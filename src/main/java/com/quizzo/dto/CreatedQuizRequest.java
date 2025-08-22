package com.quizzo.dto;

import java.util.List;

public record CreatedQuizRequest(String time,
                                 int eliminations,
                                 List<QuestionRequest> questionsData) {
}
