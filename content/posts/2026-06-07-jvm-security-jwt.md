---
title: "이론 & 실습 : 초간단 JWT 직접 구현해보기"
date: "2026-06-07"
category: "Security"
tags: [ "Security", "JWT", "SHA256", "Kotlin" ]
excerpt: "암호화·서명의 차이를 알아봤으니, 이제 표준 라이브러리만으로 JWT를 직접 만들어봅니다."
---

JWT 구성요소를 이해했다면, 직접 구현하는것도 무리없이 가능할 것 같습니다.
인코딩, 암호화, 해시, 서명... 알고리즘이 너무 많죠. 이걸 직접 구현하는 건 무리고, 다행히 검증된 JVM 표준 라이브러리가 있습니다. 이번엔 그걸 활용해서 HS256 JWT를 의존성 없이 직접 만들어 봅니다.

### JVM이 지원하는 Security 알고리즘 둘러보기

`java.security.Security`로 내 JVM이 어떤 알고리즘을 지원하는지 쏙 뽑아볼 수 있습니다.

```kotlin
// 해시 알고리즘 - MessageDigest
Security.getAlgorithms("MessageDigest").sorted().forEach(::println)

// MAC(Message Authentication Code) - 대칭키
Security.getAlgorithms("Mac").sorted().forEach(::println)

// 서명 알고리즘 - 비대칭키
Security.getAlgorithms("Signature").sorted().forEach(::println)

// 암호화 알고리즘 - Cipher
Security.getAlgorithms("Cipher").sorted().forEach(::println)
```

여기서 확인한 이름을 `getInstance("...")`에 넘겨 인스턴스를 꺼내 쓰는 방식이에요. 지원하지 않는 이름을 넣으면 `NoSuchAlgorithmException`이 납니다. 우리는 HS256에 필요한 `HmacSHA256`만 쓸 거예요.

### JWT는 어떻게 생겼나

JWT는 점(`.`)으로 이어진 세 덩어리입니다.

```
base64url(헤더) . base64url(페이로드) . base64url(서명)
```

- 헤더: 타입과 서명 알고리즘 (`{"typ":"JWT","alg":"HS256"}`)
- 페이로드: 담고 싶은 클레임 (`sub`, `exp`, `role` 등)
- 서명: 헤더·페이로드가 위변조되지 않았음을 보장하는 값

### 1) 헤더와 페이로드 만들기

JSON일 뿐이라 간단합니다. 객체로 만들어 직렬화해도 되지만, 여기선 초간단하게 문자열로 적습니다.

```kotlin
val header = """{"typ":"JWT","alg":"HS256"}"""
val payload = """{"sub":"999","iss":"ISSUER","iat":1893456000,"exp":1893456000,"email":"test@test.com","role":"ADMIN"}"""
```

### 2) Base64URL로 인코딩하기

그럼 `header + "." + payload + "." + 서명` 으로 바로 합치면 될까요? 아니요. JWT 규칙상 헤더와 페이로드는 먼저 `Base64URL`로 인코딩해야 합니다.

```kotlin
// Kotlin 표준 라이브러리의 Base64. (Java도 java.util.Base64로 동일하게 제공)
val urlSafeBase64 = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT_OPTIONAL)

val encodedHeader = urlSafeBase64.encode(header.toByteArray())
val encodedPayload = urlSafeBase64.encode(payload.toByteArray())

// 서명의 대상이 되는 "인코딩된 헤더.페이로드"
val unsignedToken = "$encodedHeader.$encodedPayload"
```

포인트는 서명 대상이 원본 JSON이 아니라 인코딩된 `encodedHeader.encodedPayload`라는 점입니다.

### 3) 서명하기

이제 `unsignedToken`에 HMAC-SHA256으로 서명하고, 그 결과를 다시 Base64URL로 인코딩합니다.

```kotlin
const val HMAC_ALGORITHM = "HmacSHA256"                          // 서명에 쓸 해시 알고리즘
val signingKey = SecretKeySpec(secret.toByteArray(), HMAC_ALGORITHM) // 서명에 쓸 비밀 키

fun signatureOf(data: String): ByteArray {
    // Mac은 스레드 안전하지 않으니 호출마다 새로 만든다
    val mac = Mac.getInstance(HMAC_ALGORITHM)
    mac.init(signingKey)
    return mac.doFinal(data.toByteArray())
}

val signature = signatureOf(unsignedToken)            // 1. 서명
val encodedSignature = urlSafeBase64.encode(signature) // 2. 인코딩
```

### 4) 조합하기

서명까지 했으니 점으로 이어 붙이면 끝입니다.

```kotlin
val jwt = "$encodedHeader.$encodedPayload.$encodedSignature"
```

### 5) 검증하기

서명은 단방향이라 시크릿 키로 "복호화"하는 게 아닙니다. 대신 전달받은 헤더·페이로드로 내가 직접 다시 서명해 보고, 그 값이 토큰에 담겨 온 서명과 같은지 비교합니다.

```kotlin
val token = ... // 검증할 JWT

val segments = token.split(".")
require(segments.size == 3) { "Invalid JWT format" }

val (encodedHeader, encodedPayload, encodedSignature) = segments
val unsignedToken = "$encodedHeader.$encodedPayload"

val expectedSignature = signatureOf(unsignedToken)        // 같은 키로 직접 서명
val providedSignature = urlSafeBase64.decode(encodedSignature)

// 두 서명이 같은지 비교 (아래 설명 참고)
val valid = MessageDigest.isEqual(expectedSignature, providedSignature)
```

#### 잠깐, 왜 `equals`가 아니라 `MessageDigest.isEqual`일까?

여기서 공격자는 토큰을 직접 만들어 보내는 쪽이라, `providedSignature`를 마음대로 바꿀 수 있습니다. 비밀 키는 몰라도 "검증에 걸린 시간"을 잴 수 있다면 진짜 서명을 한 바이트씩 알아낼 수 있어요. 이게 타이밍 공격입니다.

일반 비교는 보통 앞에서부터 보다가 다른 바이트를 만나는 순간 바로 멈춥니다.

```kotlin
for (i in a.indices) {
    if (a[i] != b[i]) return false  // ← 첫 불일치에서 즉시 멈춤
}
```

그러면 "앞쪽이 많이 맞을수록 더 오래 걸린다"는 단서가 새어 나가, 응답 시간만 재면서 서명을 복원할 수 있게 됩니다. `MessageDigest.isEqual`은 중간에 멈추지 않고 끝까지 비교한 뒤 결과를 내도록 구현돼 있어서, 걸린 시간이 "몇 바이트가 맞았는지"를 흘리지 않습니다. 그래서 서명·MAC처럼 비밀과 관련된 바이트 비교에는 이 메서드를 씁니다.

### 실제 서비스라면 더 필요합니다

학습용으로 서명 발급·검증까지 만들어 봤지만, 실제 서비스라면 최소한 이것들이 더 필요합니다.

- `exp`(만료), `iss`(발급자), `aud`(대상) 같은 클레임 검증. 지금 코드는 서명만 봅니다.
- 헤더의 `alg`를 그대로 믿지 않기. 토큰이 들고 온 `alg`를 따르면 `alg: none`이나 알고리즘 혼동 공격에 뚫립니다. 서버가 기대하는 알고리즘을 고정해 검증해야 합니다.
- 지금은 `HmacSHA256` 하나만 구현했고, 여러 알고리즘은 지원하지 않습니다.

### 마무리

JCA에서 알고리즘 이름을 확인하고 `getInstance`로 꺼내 쓰는 흐름만 알면, HS256 JWT 발급 정도는 표준 라이브러리만으로 몇 줄이면 됩니다. 라이브러리의 잦은 CVE 대응이 부담이라면, "내가 진짜 쓰는 기능이 이 정도인가?"를 가늠해 보는 연습으로도 괜찮을 것 같아요. 핵심은 "발급은 쉽고, 안전한 검증이 어렵다"는 것!

### 전체 코드

```kotlin
import java.security.MessageDigest
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec
import kotlin.io.encoding.Base64

class SimpleJwtHs256(secret: String) {

    // JWT는 패딩 없는 base64url 인코딩을 쓴다
    private val urlSafeBase64 = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT_OPTIONAL)

    // HMAC 서명에 사용할 비밀 키
    private val signingKey = SecretKeySpec(secret.toByteArray(), HMAC_ALGORITHM)

    /** header/payload(JSON 문자열)를 받아 JWT 토큰을 발급한다 */
    fun sign(headerJson: String, payloadJson: String): String {
        val encodedHeader = urlSafeBase64.encode(headerJson.toByteArray())
        val encodedPayload = urlSafeBase64.encode(payloadJson.toByteArray())

        val unsignedToken = "$encodedHeader.$encodedPayload"
        val encodedSignature = urlSafeBase64.encode(signatureOf(unsignedToken))

        return "$unsignedToken.$encodedSignature"
    }

    /** 토큰의 서명이 내 키로 만든 서명과 일치하는지 검증한다 */
    fun verify(token: String): Boolean {
        val segments = token.split(".")
        if (segments.size != 3) return false

        val (encodedHeader, encodedPayload, encodedSignature) = segments
        val unsignedToken = "$encodedHeader.$encodedPayload"

        val expectedSignature = signatureOf(unsignedToken)
        val providedSignature = urlSafeBase64.decode(encodedSignature)

        // 타이밍 공격 방지를 위한 상수시간 비교 (java.security 제공)
        return MessageDigest.isEqual(expectedSignature, providedSignature)
    }

    /** 입력 문자열에 대한 HMAC-SHA256 서명을 계산한다 */
    private fun signatureOf(data: String): ByteArray {
        // Mac은 스레드 안전하지 않으니 호출마다 새로 만든다
        val mac = Mac.getInstance(HMAC_ALGORITHM)
        mac.init(signingKey)
        return mac.doFinal(data.toByteArray())
    }

    companion object {
        private const val HMAC_ALGORITHM = "HmacSHA256"
    }
}
```

사용 예시:

```kotlin
fun main() {
    val jwt = SimpleJwtHs256(secret = "ZmFrZS1zZWNyZXQta2V5LWZvci1kZW1vLXVzZ")

    val header = """{"typ":"JWT","alg":"HS256"}"""
    val payload = """{"sub":"999","iss":"ISSUER","iat":1893456000,"exp":1893456000,"email":"test@test.com","role":"ADMIN"}"""

    // 1) 발급
    val token = jwt.sign(header, payload)
    println(token)

    // 2) 정상 토큰 검증
    println(jwt.verify(token)) // true

    // 3) 위조 토큰 검증 (마지막 글자 하나만 변경)
    val tampered = token.dropLast(1) + if (token.last() == 'A') 'B' else 'A'
    println(jwt.verify(tampered)) // false — 서명 불일치
}
```