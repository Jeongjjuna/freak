---
date: "2026-07-03T16:00:00+09:00"
tags: ["Java", "record", "OOP"]
---

## Java record — record와 class를 가르는 기준

record는 DTO 전용이 아닙니다. 기준은 "불변 값인가, 상태가 변하는 개체인가"입니다.

### 포인트1 — 불변 값이면 record

```java
public record Money(BigDecimal amount, String currency) {}
public record Address(String city, String street) {}
```

DTO, 값 객체(VO), 복합 키처럼 생성 후 안 바뀌는 값의 묶음이면 record.

### 포인트2 — 상태가 변하는 개체면 class

```java
public class Order {
    private OrderStatus status;  // PENDING → PAID → SHIPPED

    public void markAsPaid() {
        this.status = OrderStatus.PAID;
    }
}
```

VO를 여러 개 품고 있어도, 그 자체가 생명주기를 갖는 개체면 class.

<br>

record가 못 하는 것: 가변 상태, 클래스 상속, JPA 엔티티

> `핵심` — 불변 값이면 record, 변하는 개체면 class.
