package com.quizzo.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;

import java.util.Date;

@Component
public class JwtService {

    private final SecretKey accessKey;
    private final SecretKey refreshKey;
    private final Long accessMs;
    private final Long refreshMs;

    public JwtService(JwtProperties jwtProperties) {
        this.accessKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtProperties.accessSecret()));
        this.refreshKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtProperties.refreshSecret()));
        this.accessMs = jwtProperties.accessMs();
        this.refreshMs = jwtProperties.refreshMs();
    }

    public String createAccess(Integer userId, String login) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + accessMs);

        return Jwts.builder()
                .subject(login)
                .claim("userId", userId)
                .issuedAt(now)
                .expiration(exp)
                .signWith(accessKey)
                .compact();
    }

    public String createRefresh(Integer userId, String login) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + refreshMs);

        return Jwts.builder()
                .subject(login)
                .claim("userId", userId)
                .issuedAt(now)
                .expiration(exp)
                .signWith(refreshKey)
                .compact();
    }

    public Claims parseAccess(String token) {
        return Jwts.parser()
                .verifyWith(accessKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Claims parseRefresh(String token) {
        return Jwts.parser()
                .verifyWith(refreshKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
