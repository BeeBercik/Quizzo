package com.quizzo.dto;

import java.util.List;

public record QuizSummaryUserResponse(String login,
                                      String email,
                                      List<AttemptSummaryResponse> attempts) {
}
