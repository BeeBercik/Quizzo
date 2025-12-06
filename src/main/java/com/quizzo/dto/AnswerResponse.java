package com.quizzo.dto;

public record AnswerResponse(Integer id,
                             String value,
                             Boolean correct) {
}