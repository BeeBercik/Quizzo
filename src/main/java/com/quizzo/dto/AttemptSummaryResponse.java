package com.quizzo.dto;

import java.time.LocalDateTime;

public record AttemptSummaryResponse(Integer score,
                                     LocalDateTime attemptTime) {
}
