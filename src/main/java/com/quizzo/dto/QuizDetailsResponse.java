package com.quizzo.dto;


import java.time.LocalDateTime;
import java.util.List;

public record QuizDetailsResponse(Integer id,
                                  String title,
                                  String code,
                                  LocalDateTime createTime,
                                  Float durationTime,
                                  Integer eliminationsCount,
                                  List<QuestionResponse> questions) {
}
