---
date: "2026-06-06T09:00:00+09:00"
tags: ["Kotlin", "상태", "캡슐화"]
---

## 상태 — 결합도 높은 변수 자제

`서로 의존하는 값을 따로 저장하지 말 것.` 한쪽이 다른 쪽을 정해준다면 따로 들고 있을수록 정합성이 깨진다.

제거법 2가지: ① 함수(계산) ② 합 타입(enum/sealed)

### ① 함수로 대체 (파생값은 저장 X)
재생 시간 텍스트는 초(sec)에서 정해진다 → 따로 받지 말 것.
```kotlin
// ❌ 둘 다 받음 → 어긋남
Song(225, "2:05")   // 실제 3:45인데 텍스트는 2:05

// ✔️ A. 파생 프로퍼티 (매번 계산)
val durationText get() = "${durationSec / 60}:${durationSec % 60}"

// ✔️ B. 팩토리 (한 번 계산·저장, 생성 강제)
private constructor(...) { companion object { fun of(sec: Int) = ... } }
```
A = 단순/항상 일치 · B = 생성 막거나 계산 비쌀 때

### ② 합 타입으로 대체 (유효한 상태만)
플레이어 상태: 재생 / 일시정지 / 정지.
```kotlin
// ❌ Boolean 여러 개 → 불가능한 조합도 표현됨 (둘 다 true?)
class PlayerState(isPlaying: Boolean, isPaused: Boolean)

// ✔️ 재생/일시정지/정지만 표현 가능
sealed class PlayerState {
    object Playing : PlayerState()
    object Paused : PlayerState()
    object Stopped : PlayerState()
}
```

> `핵심` — 파생값은 함수로, 배타적 상태는 합 타입으로. 목표: `잘못된 상태를 못 만들게.`