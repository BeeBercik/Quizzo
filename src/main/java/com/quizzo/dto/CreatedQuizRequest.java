package com.quizzo.dto;

import java.util.List;

public record CreatedQuizRequest(String title,
                                 String time,
                                 int eliminations,
                                 boolean multipleChoice,
                                 List<QuestionRequest> questionsData) {
}
