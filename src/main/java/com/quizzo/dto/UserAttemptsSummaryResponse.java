package com.quizzo.dto;

import java.util.List;

public record UserAttemptsSummaryResponse(String login,
                                          String email,
                                          List<UserResultSummaryResponse> attempts) {
}
