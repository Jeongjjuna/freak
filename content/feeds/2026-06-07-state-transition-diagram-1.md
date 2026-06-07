---
date: "2026-06-07T15:40:00+09:00"
tags: ["독서", "읽기 쉽고 코드리뷰하기 좋은 코드작성 가이드", "상태 관리", "Kotlin", "불변성"]
---

## 불변성 (Immutability)

상태 설계 1번. 핵심은 `읽기 전용` ≠ `불변`.

### 읽기 전용인데 불변이 아니다?
`List` 타입은 수정 메서드만 없을 뿐, 같은 객체를 가리키는 가변 참조가 바꾸면 값도 같이 바뀐다.
```kotlin
val list1 = mutableListOf<Int>()
val list2: List<Int> = list1   // 읽기 전용 타입
list1.add(1)
println(list2)   // [1] ← 같이 바뀜
```

### 불변성 보장 2가지
1. 반환 시 `List` 타입으로 (가변 참조를 밖에 안 넘김). 내부 리스트면 복사본:
```kotlin
fun getList(): List<Int> = mutableList.toList()
```
2. 받은 인수는 복사해서 저장 (방어적 복사). 안 그러면 호출한 쪽이 내부 값 변경 가능:
```kotlin
fun setList(newList: List<Int>) { list = newList.toList() }
```
- 원칙: `가변 객체 참조를 외부에 직접 내놓지 말 것`. 어떤 영향 줄지 예측 불가.

### 부분적 불변성
함께 바뀌는 변수끼리 묶어서, "필드를 하나씩 고치기" 대신 "묶음을 통째로 새 객체로 교체"하게 만든다.

```kotlin
// x  가변 필드 5개가 흩어져 있음 → 하나씩 따로 바꿈
class UserDetailScreen {
    private var userName: String = ...
    private var userEmail: String = ...
    private var timeZone: TimeZone = ...
    private var onlineStatus: OnlineStatus = ...
    private var statusMessage: String = ...

    fun updateUserProfile() {
        userName = ...      // 여기서 이름만 바뀌고
        userEmail = ...     // 이메일은 아직 옛날 값인 "중간 상태"가 생김
        timeZone = ...
    }
}
```

```kotlin
// o  같이 바뀌는 것끼리 불변 묶음으로. 갱신 = 새 객체로 통째 교체
class UserDetailScreen {
    private var userProfile: UserProfile = ...   // 참조만 var
    private var userStatus: UserStatus = ...

    fun updateUserProfile() {
        userProfile = UserProfile(newName, newEmail, newTz)  // 한 번에 교체
    }
    fun updateUserOnlineStatus() {
        userStatus = UserStatus(newStatus, newMessage)
    }

    // 묶음 내부는 전부 val → 불변
    private class UserProfile(val userName: String, val userEmail: String, val timeZone: TimeZone)
    private class UserStatus(val onlineStatus: OnlineStatus, val statusMessage: String)
}
```

왜 좋냐:
- 따로 관리할 가변 필드 5개 → 참조 2개로 줄어 관리 포인트 감소.
- 함께 바뀔 값들이 항상 한 덩어리로 교체됨 → `이름만 바뀌고 이메일은 옛날 값`인 어중간한 상태가 안 생김.
- 묶음 내부는 `val`(불변)이라 한 번 만든 `UserProfile`은 절대 안 변함. 바뀌는 건 "어떤 묶음을 가리키냐"(참조)뿐.

> `핵심` — 읽기 전용 타입이라도 가변 참조가 살아있으면 불변 보장 X. 반환·저장은 복사로, 가변 참조는 밖에 내놓지 말 것.