package com.quizzo.dto;


import java.util.List;

public record UserProfileResponse(Integer id,
                                  String login,
                                  String role,
                                  List<AttemptResponse> attempts,
                                  List<CreatedQuizDetailsResponse> createdQuizzes) {
}