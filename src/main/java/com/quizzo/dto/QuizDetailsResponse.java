package com.quizzo.dto;

import com.quizzo.model.Question;

import java.time.LocalDateTime;
import java.util.List;

public record QuizDetailsResponse(Integer id,
                                  String title,
                                  String code,
                                  LocalDateTime createTime,
                                  Float durationTime,
                                  Integer eliminationsCount,
                                  List<Question> questions) {
}
