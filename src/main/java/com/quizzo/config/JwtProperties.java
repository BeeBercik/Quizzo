package com.quizzo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(String accessSecret, String refreshSecret, Long accessMs, Long refreshMs) {
}