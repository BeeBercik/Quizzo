package com.quizzo.dto;

import java.time.LocalDateTime;

public record AttemptResponse(Integer id,
                              String quizTitle,
                              Integer score,
                              LocalDateTime attemptTime) {
}
