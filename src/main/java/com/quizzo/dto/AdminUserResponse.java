package com.quizzo.dto;

import java.time.LocalDateTime;

public record AdminUserResponse(Integer id,
                                String login,
                                String email,
                                String role,
                                Boolean active,
                                LocalDateTime createTime,
                                Integer attemptsCount,
                                Integer createdQuizzesCount) {
}
