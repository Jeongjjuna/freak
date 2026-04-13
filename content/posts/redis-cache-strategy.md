---
title: "[Example] Redis 캐시 전략 - Cache Aside부터 Write Through까지"
date: "2025-11-20"
category: "Redis"
tags: ["Redis", "Cache", "Backend", "성능최적화"]
excerpt: "캐시를 도입하면 성능이 좋아진다는 건 알지만, 어떤 전략을 써야 할지 막막하다. 대표적인 캐시 전략 네 가지를 코드와 함께 정리해본다."
---

## 1. Cache Aside (Lazy Loading)

가장 널리 쓰이는 패턴이다. 애플리케이션이 직접 캐시와 DB를 모두 관리한다.

```java
public User getUser(Long id) {
    String key = "user:" + id;
    User cached = redisTemplate.opsForValue().get(key);

    if (cached != null) {
        return cached;
    }

    User user = userRepository.findById(id).orElseThrow();
    redisTemplate.opsForValue().set(key, user, Duration.ofMinutes(30));
    return user;
}
```

**장점**: 실제로 읽힌 데이터만 캐싱된다. DB 장애 시 캐시로 fallback 가능.
**단점**: 첫 요청은 항상 DB 조회 (Cache Miss). 데이터 정합성 문제 발생 가능.

## 2. Write Through

쓰기 시 캐시와 DB를 동시에 업데이트한다.

```java
public User updateUser(Long id, UserUpdateRequest req) {
    User user = userRepository.findById(id).orElseThrow();
    user.update(req);
    userRepository.save(user);

    // DB 저장과 동시에 캐시도 갱신
    String key = "user:" + id;
    redisTemplate.opsForValue().set(key, user, Duration.ofMinutes(30));
    return user;
}
```

**장점**: 캐시와 DB가 항상 동기화된다.
**단점**: 쓰기 레이턴시 증가. 읽히지 않는 데이터도 캐싱된다.

## 3. Write Behind (Write Back)

쓰기를 캐시에만 하고 DB 반영은 비동기로 처리한다.

```java
public void updateViewCount(Long postId) {
    String key = "post:views:" + postId;
    redisTemplate.opsForValue().increment(key);
    // 실제 DB 반영은 스케줄러가 배치로 처리
}

@Scheduled(fixedDelay = 60000)
public void flushViewCounts() {
    Set<String> keys = redisTemplate.keys("post:views:*");
    for (String key : keys) {
        Long count = redisTemplate.opsForValue().get(key);
        Long postId = parsePostId(key);
        postRepository.updateViewCount(postId, count);
        redisTemplate.delete(key);
    }
}
```

**장점**: 쓰기 성능이 매우 빠르다.
**단점**: Redis 장애 시 데이터 유실 위험.

## 4. Cache Eviction 전략

| 정책 | 설명 | 적합한 상황 |
|------|------|-----------|
| LRU | 가장 오래 전에 사용된 것 제거 | 일반적인 캐시 |
| LFU | 가장 적게 사용된 것 제거 | 인기 데이터 유지 |
| TTL | 만료 시간 기반 제거 | 시간 민감 데이터 |

```bash
# redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru
```
