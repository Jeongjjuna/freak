---
title: "[Example] Spring Security 동작 원리, 프로세스 이해하기"
date: "2026-03-15"
category: "Spring Boot, JAVA"
tags: ["Spring Security", "Authentication", "Filter", "Java"]
excerpt: "Spring Security가 필터 기반으로 동작하는 이유와 주요 필터들의 역할을 파해쳐보자. 위임 필터와 필터 체인 대리자(FilterChainProxy)의 관계를 정리한다."
---

## 1. Spring Security는 필터 기반이다

Spring Security는 서블릿 필터(Servlet Filter)를 기반으로 동작한다. 모든 요청은 서블릿 컨테이너(Tomcat 등)의 필터 체인을 먼저 거치게 되며, Spring Security는 이 필터 체인에 자신의 필터들을 끼워 넣어 보안 처리를 수행한다.

## 2. DelegatingFilterProxy와 FilterChainProxy

Spring Security가 서블릿 필터 체인에 어떻게 참여하는지 이해하는 것이 중요하다.

1. **DelegatingFilterProxy**: 서블릿 필터로 등록되지만 실제 로직은 없다. 스프링 컨텍스트에서 관리되는 `FilterChainProxy` 빈에게 보안 처리를 위임한다.
2. **FilterChainProxy**: 실제 보안 필터들을 순서대로 실행한다. `SecurityFilterChain`을 통해 요청 URL 패턴에 맞는 필터 목록을 결정한다.

```text
Servlet Container
  └── FilterChain
      ├── Filter 1
      ├── Filter 2
      ├── DelegatingFilterProxy (Spring Security의 진입점)
      │      └── FilterChainProxy (Bean)
      │             ├── SecurityContextPersistenceFilter
      │             ├── UsernamePasswordAuthenticationFilter
      │             ├── ExceptionTranslationFilter
      │             └── FilterSecurityInterceptor
      └── Filter 3
```

## 3. 주요 보안 필터의 역할

Spring Security에는 10개 이상의 필터가 기본으로 포함되어 있다.

- **UsernamePasswordAuthenticationFilter**: 폼 로그인을 처리한다. 사용자 이름과 비밀번호를 인증한다.
- **ExceptionTranslationFilter**: 인증 및 인가 예외(AuthenticationException, AccessDeniedException)를 처리한다.
- **FilterSecurityInterceptor**: 인가(Authorization)를 결정하는 마지막 필터다.

## 4. 커스텀 필터 추가하기

필요에 따라 필터 체인에 새로운 필터를 추가할 수 있다.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .addFilterBefore(new CustomFilter(), UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth.anyRequest().authenticated());
        
        return http.build();
    }
}
```

이렇게 하면 기본 인증 필터가 동작하기 전에 우리가 만든 `CustomFilter`가 먼저 실행된다. JWT 처리나 API 키 검증 등을 여기서 처리하곤 한다.
