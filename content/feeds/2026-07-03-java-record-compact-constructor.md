---
date: "2026-07-03T15:30:00+09:00"
tags: ["Java", "record", "컴팩트생성자"]
---

## Java record — 컴팩트 생성자

record 생성자에 검증 로직을 끼워 넣는 문법입니다.

### 포인트1 — 파라미터 없이 쓴다

```java
public record Range(int min, int max) {
    public Range {  // 괄호 없음
        if (min > max) {
            throw new IllegalArgumentException("min > max");
        }
    }
}
```

`this.min = min`은 안 씁니다. 컴파일러가 마지막에 자동으로 넣어줍니다.

### 포인트2 — 파라미터를 재할당하면 그 값이 저장된다

```java
public record Team(String name, List<String> members) {
    public Team {
        name = name.trim();
        members = List.copyOf(members);  // 방어적 복사
    }
}
```

record의 불변성은 필드 재할당만 막습니다.
리스트 내부까지 지키려면 `List.copyOf()`가 필요합니다.

<br>

주의: 값 자체로 판단 가능한 검증만. DB 조회가 필요한 규칙은 서비스 계층으로.

> `핵심` — 검증하고, 다듬어서, 저장한다.
