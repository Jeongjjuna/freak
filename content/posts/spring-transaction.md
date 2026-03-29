---
title: "Spring @Transactional 동작 원리와 흔한 실수들"
date: "2025-10-10"
category: "Spring"
tags: ["Spring", "Transaction", "JPA", "Backend"]
excerpt: "@Transactional만 붙이면 다 되는 줄 알았다. 트랜잭션이 동작하지 않는 상황들을 실제 사례와 함께 정리한다."
---

## 1. 기본 동작 원리

Spring은 AOP 프록시로 트랜잭션을 관리한다.

```
클라이언트 → 프록시 (트랜잭션 시작) → 실제 빈 → 프록시 (커밋/롤백)
```

그래서 **프록시를 거치지 않으면 트랜잭션이 동작하지 않는다**.

## 2. Self-invocation 문제

같은 클래스 내에서 메서드를 호출하면 프록시를 거치지 않는다.

```java
@Service
public class OrderService {

    public void placeOrder(OrderRequest req) {
        // this.processPayment()는 프록시를 거치지 않는다
        // → @Transactional이 무시됨
        processPayment(req);
    }

    @Transactional
    public void processPayment(OrderRequest req) {
        // ...
    }
}
```

**해결책**: 별도 클래스로 분리하거나, ApplicationContext에서 직접 빈을 가져온다.

```java
@Service
@RequiredArgsConstructor
public class OrderService {
    private final PaymentService paymentService;

    public void placeOrder(OrderRequest req) {
        paymentService.processPayment(req);  // 프록시 통과
    }
}
```

## 3. private 메서드 문제

```java
@Transactional  // 동작 안 함
private void saveLog(String message) {
    // ...
}
```

프록시는 상속을 통해 만들어지기 때문에 private 메서드는 오버라이드할 수 없다. `public` 또는 `protected`로 바꿔야 한다.

## 4. readOnly = true

```java
@Transactional(readOnly = true)
public List<Post> getPosts() {
    return postRepository.findAll();
}
```

- Hibernate flush 모드가 `MANUAL`로 설정됨 → dirty checking 생략
- DB 커넥션 최적화 (read replica 라우팅 가능)
- 조회 전용 메서드에는 반드시 붙이자

## 5. 전파 옵션 (Propagation)

```java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void sendNotification(Long userId) {
    // 부모 트랜잭션과 독립적으로 동작
    // 부모가 롤백되어도 이 메서드는 커밋됨
    notificationRepository.save(...);
}
```

| 옵션 | 설명 |
|------|------|
| REQUIRED (기본) | 기존 트랜잭션 있으면 참여, 없으면 생성 |
| REQUIRES_NEW | 무조건 새 트랜잭션 생성 |
| NESTED | 중첩 트랜잭션 (savepoint) |
| NOT_SUPPORTED | 트랜잭션 없이 실행 |

## 6. 롤백 규칙

기본적으로 `RuntimeException`과 `Error`만 롤백된다.

```java
// IOException은 롤백 안 됨
@Transactional
public void upload(MultipartFile file) throws IOException {
    fileRepository.save(...);
    fileStorage.upload(file);  // IOException 발생 → 롤백 안 됨!
}

// 명시적으로 지정
@Transactional(rollbackFor = Exception.class)
public void upload(MultipartFile file) throws IOException {
    // ...
}
```
