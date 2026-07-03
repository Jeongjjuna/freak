---
date: "2026-06-06T09:00:00+09:00"
tags: ["Kotlin", "캡슐화"]
---

## 상태 — 결합도 높은 변수 자제

핵심은 `서로 의존하는 값을 따로 저장하지 말 것`입니다. 한쪽이 다른 쪽을 정해준다면, 따로 들고 있을수록 정합성이 깨집니다.

제거하는 방법은 두 가지입니다. ① 함수(계산)로 대체하거나, ② 합 타입(enum/sealed)으로 대체하는 것입니다.

### ① 함수로 대체 (파생값은 저장하지 않기)
재생 시간 텍스트는 초(sec)에서 정해지므로, 따로 받지 않아야 합니다.
```kotlin
// ❌ 둘 다 받음 → 어긋남
Song(225, "2:05")   // 실제 3:45인데 텍스트는 2:05

// ✔️ A. 파생 프로퍼티 (매번 계산)
val durationText get() = "${durationSec / 60}:${durationSec % 60}"

// ✔️ B. 팩토리 (한 번 계산·저장, 생성 강제)
private constructor(...) { companion object { fun of(sec: Int) = ... } }
```
A는 단순하고 항상 값이 일치하는 방식이고, B는 직접 생성을 막거나 계산이 비쌀 때 적합합니다.

### ② 합 타입으로 대체 (유효한 상태만 표현)
플레이어 상태가 재생 / 일시정지 / 정지 세 가지라고 해보겠습니다.
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

> `핵심` — 파생값은 함수로, 배타적 상태는 합 타입으로 표현합니다. 목표는 `잘못된 상태를 아예 만들 수 없게` 하는 것입니다.
