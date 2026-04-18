package com.quizzo.dto;

import java.time.LocalDateTime;

public record AdminQuizResponse(Integer id,
                                String title,
                                String code,
                                String ownerLogin,
                                Boolean active,
                                Boolean multipleChoice,
                                Integer questionsCount,
                                Integer attemptsCount,
                                LocalDateTime createTime) {
}
