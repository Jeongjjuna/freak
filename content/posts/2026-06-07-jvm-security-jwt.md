---
title: "이론 & 실습 : 초간단 JWT 직접 구현해보기"
date: "2026-06-07"
category: "Security"
tags: [ "Security", "JWT", "SHA256", "Kotlin" ]
excerpt: "암호화·서명의 차이를 알아봤으니, 이제 표준 라이브러리만으로 JWT를 직접 만들어봅니다."
---

JWT의 구조와 서명 원리를 이해했으니 간단하게 직접 구현해 보면서 개념정리를 해보겠습니다.

JWT 를 구성하는데 사용되는 인코딩, 해시, 서명 알고리즘 등 모든걸 직접 구현하는건 너무 많으니까,
검증된 JVM 표준 라이브러리를 사용하고 핵심 JWT 를 구성하는것에만 집중하겠습니다.

### JVM이 지원하는 표준 Security 알고리즘 살펴보기

JVM 에서는 `java.security.Security`를 이용해 JVM이 어떤 알고리즘을 제공하는지 확인할 수 있습니다.

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

여기서 확인한 이름을 `getInstance("...")`에 넘겨 알고리즘이 구현된 클래스 인스턴스를 가져올 수 있습니다.
참고로 지원하지 않는 이름을 넣으면 `NoSuchAlgorithmException`예외가 발생합니다.
저는 서명 알고리즘으로 HS256을 사용할 것이므로 `HmacSHA256`라는 이름을 통해 알고리즘 인스턴스를 가져오겠습니다.(하단에 전체 코드 참고)

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

이제 `헤더`, `페이로드`, `서명` 을 각각 `Base64URL`로 인코딩해야 합니다.
간단하게 Base64URL 인코딩 클래스를 만들어보겠습니다.

```kotlin
class BaseUrlEncoder() {
   // Kotlin 표준 라이브러리의 Base64. (Java도 java.util.Base64로 동일하게 제공)
    val urlSafeBase64 = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT_OPTIONAL)

    fun encode(bytes: ByteArray): String {
        return urlSafeBase64.encode(bytes)
    }
    
    fun decode(str: String): ByteArray {
        return urlSafeBase64.decode(str)
    }
}

val encoder = BaseUrlEncoder()
val encodedHeader = encoder.encode(header.toByteArray())
val encodedPayload = encoder.encode(payload.toByteArray())

// 서명의 대상이 되는 "인코딩헤더.인코딩페이로드"
val unsignedToken = "$encodedHeader.$encodedPayload"
```

### 3) 서명하기

이제 `unsignedToken`에 HMAC-SHA256으로 서명하고, 그 결과를 다시 Base64URL로 인코딩합니다.

```kotlin
const val HMAC_ALGORITHM = "HmacSHA256"                              // 서명에 쓸 해시 알고리즘
val signingKey = SecretKeySpec(secret.toByteArray(), HMAC_ALGORITHM) // 서명에 쓸 비밀 키

fun signatureOf(data: String): ByteArray {
    // Mac은 스레드 안전하지 않으니 호출마다 새로 만든다
    val mac = Mac.getInstance(HMAC_ALGORITHM)
    mac.init(signingKey)
    return mac.doFinal(data.toByteArray())
}

val signature = signatureOf(unsignedToken)             // 1. 서명
val encodedSignature = encoder.encode(signature) // 2. 인코딩
```

### 4) 조합하기

서명까지 했으니 점으로 이어 붙이면 끝입니다.

```kotlin
val jwt = "$encodedHeader.$encodedPayload.$encodedSignature"
```

### 5) 검증하기

서명은 단방향이라 시크릿 키로 "복호화"하는 게 아닙니다.
로그인할 때 해시된 비밀번호와 비교하는것처럼, 전달받은 JWT 의 헤더·페이로드를 통해
직접 다시 서명해 보고, 서명된 값이 JWT 에 담겨진 서명과 같은지 비교합니다.

```kotlin
val token = ... // 검증할 JWT

val segments = token.split(".")
require(segments.size == 3) { "Invalid JWT format" }

val (encodedHeader, encodedPayload, encodedSignature) = segments
val unsignedToken = "$encodedHeader.$encodedPayload"

val expectedSignature = signatureOf(unsignedToken)        // 같은 키로 직접 서명
val providedSignature = encoder.decode(encodedSignature)

// 두 서명이 같은지 비교 (아래 설명 참고)
val valid = MessageDigest.isEqual(expectedSignature, providedSignature)
```

#### 왜 `equals`가 아니라 `MessageDigest.isEqual` 를 사용할까?

일반적인 비교는 앞에서부터 값을 확인하다가 다른 부분이 나오면 바로 종료할 수 있습니다.
이때 비교에 걸리는 시간으로 서명 값에 대한 단서가 노출될 수 있는데, 이를 타이밍 공격이라고 합니다.

MessageDigest.isEqual은 이런 시간 차이를 이용한 공격을 줄이기 위한 메서드입니다.
서명처럼 보안과 관련된 값을 비교할 때는 일반적인 비교 대신 이 메서드를 사용한다고 합니다.

```kotlin
for (i in a.indices) {
    if (a[i] != b[i]) return false  // ← 첫 불일치에서 즉시 멈춤
}
```

### 실제 서비스라면 더 필요합니다

이렇게 간단하게 JWT 를 발급하고, 서명 검증하는것까지만 구현해봤습니다.
하지만 실제 인증에 사용하려면 클레임안의 iss, exp 등도 검증해야하고 예외처리도 더욱 고도화 해야할 것입니다.
(JWT 에 사용할 수 있는 다양한 알고리즘도 제공을해야 실제 사용할만한 라이브러리가 될 것입니다.)

심심할때 아래까지 고려해서 직접 구현해보면, 평소 헷갈렸던 JWT 동작 원리도 더 잘 이해하는데 도움이 될 것 같습니다.

- `exp`(만료), `iss`(발급자), `aud`(대상) 같은 클레임 검증.
- 헤더의 `alg`를 그대로 신뢰하지 않고 서버에서 허용한 알고리즘으로 검증하기. 토큰이 들고 온 `alg`를 따르면 `alg: none`이나 알고리즘 혼동 공격에 뚫릴 수 있다.
- HmacSHA256 외에 다른 서명 알고리즘도 적용해 보기

### 마무리

직접 구현해 보니 JWT가 어떤 과정을 거쳐 만들어지고 검증되는지 조금 더 명확하게 이해할 수 있었습니다.
평소 라이브러리로 사용하던 기능도 내부 동작을 직접 따라가 보니 생각보다 단순한 부분도 있었고요.

물론 실제로 안전하게 사용하려면 서명뿐 아니라 클레임 검증 등 챙겨야 할 부분이 더 많습니다.
그래도 개념이 헷갈릴 때 한 번쯤 직접 구현해 보는 것도 좋은 방법인 것 같습니다.

### 전체 코드

```kotlin
import java.security.MessageDigest
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec
import kotlin.io.encoding.Base64

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

class BaseUrlEncoder() {
    // JWT는 패딩 없는 base64url 인코딩을 쓴다
    val urlSafeBase64 = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT_OPTIONAL)

    fun encode(bytes: ByteArray): String {
        return urlSafeBase64.encode(bytes)
    }

    fun decode(str: String): ByteArray {
        return urlSafeBase64.decode(str)
    }
}

class SimpleJwtHs256(secret: String) {

    private val signingKey = SecretKeySpec(secret.toByteArray(), HMAC_ALGORITHM) // HMAC 서명에 사용할 비밀 키
    private val encoder = BaseUrlEncoder()

    /** header/payload(JSON 문자열)를 받아 JWT 토큰을 발급한다 */
    fun sign(headerJson: String, payloadJson: String): String {
        val encodedHeader = encoder.encode(headerJson.toByteArray())
        val encodedPayload = encoder.encode(payloadJson.toByteArray())

        val unsignedToken = "$encodedHeader.$encodedPayload"
        val encodedSignature = encoder.encode(signatureOf(unsignedToken))

        return "$unsignedToken.$encodedSignature"
    }

    /** 토큰의 서명이 내 키로 만든 서명과 일치하는지 검증한다 */
    fun verify(token: String): Boolean {
        val segments = token.split(".")
        if (segments.size != 3) return false

        val (encodedHeader, encodedPayload, encodedSignature) = segments
        val unsignedToken = "$encodedHeader.$encodedPayload"

        val expectedSignature = signatureOf(unsignedToken)
        val providedSignature = encoder.decode(encodedSignature)

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