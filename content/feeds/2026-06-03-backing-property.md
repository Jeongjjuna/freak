---
date: "2026-06-03T23:10:00+09:00"
tags: ["Kotlin", "캡슐화"]
---

## 백킹 프로퍼티 (Backing Property)

핵심은 `안에서는 쓰기, 밖에서는 읽기만`입니다. 비공개 프로퍼티(`_x`)와 공개 프로퍼티(`x`)를 짝으로 둡니다.

```kotlin
private val _tracks = mutableListOf<String>()   // 내부: 수정 O
val tracks: List<String> get() = _tracks        // 외부: 읽기 전용 뷰
```

### 핵심: 타입을 다르게

내부는 `MutableList`, 공개는 `List`로 선언합니다. 그러면 밖에서는 `add`/`clear`가 아예 보이지 않습니다.
```kotlin
playlist.tracks            // ✔️ 읽기
playlist.tracks.add("x")   // ❌ 컴파일 에러 (List엔 add 없음)
playlist.add("곡 추가")      // ✔️ 메서드로만 변경
```
만약 `MutableList`를 그대로 공개하면 누구나 곡 목록을 변경할 수 있어 캡슐화가 깨집니다.

### 장점

캡슐화(읽기/쓰기 분리)가 지켜지고, 잘못된 사용이 컴파일 단계에서 차단되며, 변경은 정해진 메서드로만 가능해집니다.

### 백킹 '필드' vs 백킹 '프로퍼티' (헷갈림 주의)

- 백킹 필드(`field`): 프로퍼티 *하나* 안의 저장공간 키워드입니다. `get()/set()`에서 접근합니다.
- 백킹 프로퍼티(`_x` + `x`): 프로퍼티 *둘*을 짝짓는 패턴입니다. 공개/비공개 타입이 다를 때(List vs MutableList) 사용합니다.

> `참고` — `get() = _tracks`는 같은 객체의 읽기 전용 뷰입니다. 독립 복사본이 필요하면 `get() = _tracks.toList()`를 사용합니다.

> `핵심` — 내부 `_tracks`(Mutable)는 자유롭게 수정하고, 외부 `tracks`(List)는 읽기 전용으로 둡니다. "쓰기는 나만, 읽기는 모두."
