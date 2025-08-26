package com.quizzo.dto;

import java.time.LocalDateTime;

public record UserResultSummaryResponse(Integer score,
                                        LocalDateTime attemptTime) {
}
