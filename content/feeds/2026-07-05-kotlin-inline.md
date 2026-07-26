---
date: "2026-07-05T21:00:00+09:00"
tags: ["Kotlin", "inline", "performance"]
---


## Kotlin inline — inline을 써야 하는 기준

inline은 “성능을 빠르게 만드는 키워드”가 아닙니다. 기준은 **함수의 파라미터로 람다를 받고, 그 람다 호출 비용을 줄이고 싶은가**입니다.

### 포인트1 — 람다를 받는 작은 함수면 inline

```kotlin
inline fun measure(block: () -> Unit) {
    val start = System.currentTimeMillis()
    block()
    println(System.currentTimeMillis() - start)
}
```

`inline`을 붙이면 함수 호출부에 함수 본문이 복사됩니다.

```kotlin
measure {
    println("hello")
}
```

대략 이런 식으로 펼쳐진다고 볼 수 있습니다.

```kotlin
val start = System.currentTimeMillis()
println("hello")
println(System.currentTimeMillis() - start)
```

즉, 람다 객체 생성과 함수 호출 비용을 줄일 수 있습니다.

### 포인트2 — 고차 함수에서 유용하다

```kotlin
inline fun <T> transaction(block: () -> T): T {
    begin()
    return try {
        val result = block()
        commit()
        result
    } catch (e: Exception) {
        rollback()
        throw e
    }
}
```

이런 함수는 호출하는 곳에서 람다를 넘깁니다.

```kotlin
val user = transaction {
    userRepository.save(user)
}
```

`inline`을 사용하면 람다 호출 비용을 줄이면서도 코드 표현은 깔끔하게 유지할 수 있습니다.

### 포인트3 — reified를 쓰려면 inline이 필요하다

Kotlin의 제네릭 타입은 런타임에 지워집니다.

```kotlin
fun <T> parse(json: String): T {
    // T::class 사용 불가
}
```

하지만 `inline`과 `reified`를 같이 쓰면 런타임에 타입 정보를 사용할 수 있습니다.

```kotlin
inline fun <reified T> parse(json: String): T {
    return objectMapper.readValue(json, T::class.java)
}
```

사용할 때는 타입을 간단하게 넘길 수 있습니다.

```kotlin
val user = parse<UserResponse>(json)
```

`reified`가 필요한 유틸 함수라면 `inline`은 선택이 아니라 필수입니다.

### 포인트4 — 무조건 붙이면 안 된다

```kotlin
inline fun calculate(a: Int, b: Int): Int {
    return a + b
}
```

이런 함수에는 `inline`을 붙일 이유가 거의 없습니다.

람다도 없고, `reified`도 없고, 특별히 호출 비용을 줄일 이유도 없습니다.

오히려 큰 함수에 `inline`을 남발하면 호출부마다 코드가 복사되어 바이트코드가 커질 수 있습니다.

<br>

inline이 잘 맞는 것: 작은 고차 함수, 유틸성 람다 함수, reified 제네릭 함수

inline이 별로인 것: 일반 함수, 큰 함수, 람다를 받지 않는 함수

> `핵심` — 람다 호출 비용을 줄이거나 reified 타입이 필요하면 inline, 그 외에는 굳이 쓰지 않는다.
