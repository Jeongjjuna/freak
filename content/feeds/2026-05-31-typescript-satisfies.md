---
date: "2026-05-31T22:15:00+09:00"
tags: ["TypeScript", "메모"]
---

`satisfies` 연산자는 *타입 추론은 유지하면서* 호환성 검증만 해 주는 신박한 도구다.

```ts
const config = {
  host: 'localhost',
  port: 6379,
  tls: false,
} satisfies Record<string, string | number | boolean>

// config.host 는 여전히 'localhost' 리터럴 타입
// 단, port: '6379' 같은 잘못된 값이면 컴파일 에러
```

`as` 와 달리 over-narrowing 위험이 없고, 객체 리터럴의 좁은 타입을 그대로 살릴 수 있어서 좋다.
