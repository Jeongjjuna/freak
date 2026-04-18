---
title: "[Example] Spring AOP를 private 메서드에 적용할 수 없는 이유 (feat. @Transactional)"
date: "2026-02-07"
category: "SpringBoot"
tags: ["Spring", "AOP", "Java", "Transactional"]
excerpt: "사내에서 Spring AOP를 활용한 FeatureFlag 도입을 맡게 되었다. 커스텀 어노테이션과 Spring AOP를 조합해 메서드 단위로 기능을 ON/OFF하거나 분기 처리할 수 있는 구조를 설계했다."
---

## 1. 개요

사내에서 Spring AOP를 활용한 FeatureFlag 도입을 맡게 되었다. 커스텀 어노테이션과 Spring AOP를 조합해 메서드 단위로 기능을 ON/OFF하거나 분기 처리할 수 있는 구조를 설계했다.

사용 방식은 간단하다. `@FeatureFlag` 어노테이션이 붙은 메서드가 호출될 때 AOP가 개입하여, 설정값에 따라 해당 메서드를 실행할지, 아니면 대체 메서드로 분기할지를 결정한다.

그런데 사용 중 한 가지 문제를 발견했다. **private 메서드에는 AOP가 동작하지 않는 것이다.** 처음엔 구현 실수인가 싶었지만, 조사해보니 이건 Spring AOP의 근본적인 동작 방식에서 비롯된 제약이었다.

## 2. Proxy 란?

Spring AOP는 **프록시(Proxy) 패턴**을 기반으로 동작한다. 스프링 빈을 생성할 때, AOP가 적용된 클래스는 원본 객체 대신 **프록시 객체**가 빈으로 등록된다.

프록시는 대리인 역할을 하는 객체로, 원본 객체의 앞단에서 요청을 가로채 부가 로직을 실행한 뒤, 원본 메서드를 호출한다.

```java
// 원본 클래스
public class MyService {
    public void doSomething() {
        // 실제 로직
    }
}

// 프록시 클래스 (스프링이 자동 생성)
public class MyServiceProxy extends MyService {
    @Override
    public void doSomething() {
        // AOP 부가 로직 (Before)
        super.doSomething();
        // AOP 부가 로직 (After)
    }
}
```

## 3. Spring AOP에서 private 메서드를 가로챌 수 없는 이유

Spring AOP는 기본적으로 **JDK 동적 프록시** 또는 **CGLIB 프록시** 방식을 사용한다.

- **JDK 동적 프록시**: 인터페이스 기반 프록시 생성
- **CGLIB**: 클래스 상속 기반 프록시 생성

두 방식 모두 `private` 메서드를 오버라이딩하거나 가로챌 수 없다.

Java에서 `private` 메서드는 **상속되지 않으며**, 외부에서 접근이 불가능하다. 따라서 프록시 객체가 이 메서드를 오버라이딩하는 것 자체가 언어 스펙상 불가능하다.

## 4. @Transactional 도?

`@Transactional`도 Spring AOP 기반이기 때문에 동일한 제약이 있다.

```java
@Service
public class OrderService {

    public void placeOrder() {
        saveOrder(); // @Transactional이 동작하지 않음
    }

    @Transactional
    private void saveOrder() {
        // 트랜잭션이 적용되지 않는다
    }
}
```

이 경우 `saveOrder()`를 `public`으로 변경하거나, 별도 빈으로 분리해야 한다.
