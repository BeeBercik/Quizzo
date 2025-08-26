package com.quizzo.dto;

import java.time.LocalDateTime;
import java.util.List;

public record QuizSummaryResponse(
        String title,
        String code,
        List<UserAttemptsSummaryResponse> users,
        LocalDateTime creationDate) {
}
