package com.quizzo.dto;


import java.util.List;

public record UserProfileResponse(Integer id,
                                  String login,
                                  List<AttemptResponse> attempts,
                                  List<CreatedQuizDetailsResponse> createdQuizzes) {
}