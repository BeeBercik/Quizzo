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

    private final SecretKey key;
    private final Long accessMs;
    private final Long refreshMs;

    public JwtService(JwtProperties jwtProperties) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtProperties.secret()));
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
                .signWith(key)
                .compact();
    }

    public String createRefresh(Integer userId, String login, String jti) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + refreshMs);

        return Jwts.builder()
                .subject(login)
                .claim("userId", userId)
                .id(jti)
                .issuedAt(now)
                .expiration(exp)
                .signWith(key)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
