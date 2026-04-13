---
title: "[Example] JWT 인증 구현과 refresh token 전략"
date: "2025-07-28"
category: "Security"
tags: ["JWT", "Security", "Spring", "인증"]
excerpt: "JWT는 stateless 인증의 대표 방식이다. access token만 쓰면 생기는 문제와 refresh token을 어떻게 관리해야 하는지 정리했다."
---

## 1. JWT 구조

```
Header.Payload.Signature

eyJhbGciOiJIUzI1NiJ9          // Header: 알고리즘
.eyJzdWIiOiIxMjMiLCJleHAiOjE3MDAwMDAwfQ  // Payload: claims
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  // Signature
```

**중요**: Payload는 Base64 인코딩이지 암호화가 아니다. 민감 정보를 넣으면 안 된다.

## 2. Access Token + Refresh Token 전략

Access Token만 사용하면:
- 만료 시간을 짧게 설정 → 자주 재로그인
- 만료 시간을 길게 설정 → 탈취 시 장기간 악용

해결책: 짧은 Access Token + 긴 Refresh Token

```
Access Token: 15분
Refresh Token: 7일 (DB에 저장)
```

## 3. Spring Security 구현

```java
@Component
public class JwtProvider {
    @Value("${jwt.secret}")
    private String secret;

    public String createAccessToken(Long userId, String role) {
        return Jwts.builder()
            .subject(userId.toString())
            .claim("role", role)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000))
            .signWith(getKey())
            .compact();
    }

    public String createRefreshToken(Long userId) {
        String token = Jwts.builder()
            .subject(userId.toString())
            .expiration(new Date(System.currentTimeMillis() + 7L * 24 * 60 * 60 * 1000))
            .signWith(getKey())
            .compact();

        refreshTokenRepository.save(new RefreshToken(userId, token));
        return token;
    }

    public Claims parse(String token) {
        return Jwts.parser()
            .verifyWith(getKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
```

## 4. Refresh Token 재발급 API

```java
@PostMapping("/auth/refresh")
public ResponseEntity<TokenResponse> refresh(
    @CookieValue("refreshToken") String refreshToken
) {
    Claims claims = jwtProvider.parse(refreshToken);
    Long userId = Long.parseLong(claims.getSubject());

    // DB에 저장된 토큰과 비교
    RefreshToken stored = refreshTokenRepository.findByUserId(userId)
        .orElseThrow(() -> new UnauthorizedException("로그인이 필요합니다."));

    if (!stored.getToken().equals(refreshToken)) {
        // 탈취 감지: 모든 토큰 무효화
        refreshTokenRepository.deleteByUserId(userId);
        throw new UnauthorizedException("비정상적인 접근이 감지되었습니다.");
    }

    String newAccessToken = jwtProvider.createAccessToken(userId, stored.getRole());
    String newRefreshToken = jwtProvider.createRefreshToken(userId);

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, createRefreshTokenCookie(newRefreshToken))
        .body(new TokenResponse(newAccessToken));
}
```

## 5. Refresh Token은 httpOnly 쿠키로

```java
private String createRefreshTokenCookie(String token) {
    return ResponseCookie.from("refreshToken", token)
        .httpOnly(true)   // JS 접근 불가
        .secure(true)     // HTTPS만
        .sameSite("Strict")
        .maxAge(Duration.ofDays(7))
        .path("/auth/refresh")
        .build()
        .toString();
}
```

XSS로 탈취 불가, CSRF는 SameSite로 방어.
