---
date: "2026-08-25T20:00:00+09:00"
tags: ["Backend", "Monitoring", "SpringBoot", "Prometheus", "Grafana"]
---

## 메트릭 — Spring Actuator → Prometheus → Grafana

JVM 애플리케이션의 상태를 확인할 때 로그만 보는 것보다 메트릭(Metric)을 활용하면 현재 애플리케이션이 어떤 상태인지 수치로 확인할 수 있습니다.

Spring Boot에서는 **Actuator → Prometheus → Grafana** 조합을 통해 애플리케이션의 메트릭을 수집하고 시각화할 수 있습니다.

![img_1.png](/images/posts/spring-actuator-prometheus-grafana/img_1.png)

### 포인트1 — Actuator가 메트릭을 노출한다

Spring Boot Actuator를 사용하면 애플리케이션의 다양한 상태 정보를 확인할 수 있습니다.

```text
Spring Boot
    │
    └── Actuator
          │
          └── /actuator/prometheus
```

예를 들어 요청 수, 응답 시간, JVM 메모리 등의 정보를 Prometheus가 이해할 수 있는 형태로 노출할 수 있습니다.

```text
GET /actuator/prometheus

http_server_requests_seconds_count{...} 1234
jvm_memory_used_bytes{...} 524288000
```

### 포인트2 — Prometheus가 주기적으로 가져간다

Prometheus는 애플리케이션이 메트릭을 직접 보내는 방식이 아니라, **각 애플리케이션의 메트릭 엔드포인트를 주기적으로 호출해서 가져오는(Pull) 방식**으로 수집합니다.

```text
[Spring Boot]
     │
     │ GET /actuator/prometheus
     ▼
[Prometheus]
     │
     │ 메트릭 저장
     ▼
[Prometheus Storage]
```

즉, 애플리케이션은 메트릭을 계속 전송할 필요 없이 Prometheus가 접근할 수 있는 엔드포인트만 제공하면 됩니다.

### 포인트3 — Grafana는 Prometheus의 데이터를 시각화한다

Prometheus가 수집하고 저장한 메트릭은 Grafana를 통해 대시보드로 확인할 수 있습니다.

```text
Spring Boot
    │
    │ Actuator
    ▼
Prometheus
    │
    │ Query
    ▼
Grafana
    │
    └── 요청 수 / 응답 시간 / JVM 메모리 ...
```

Grafana는 데이터를 직접 수집하고 저장하는 역할보다는 **Prometheus와 같은 데이터 소스에서 데이터를 조회해 시각화하는 역할**을 담당합니다.

### 포인트4 — Actuator로 무엇을 확인할 수 있을까?

Spring Boot Actuator를 사용하면 별도의 메트릭을 직접 만들지 않아도 다양한 애플리케이션 상태를 확인할 수 있습니다.

대표적으로 다음과 같은 정보를 확인할 수 있습니다.

```text
HTTP
→ 요청 수, 응답 시간, 상태 코드

JVM
→ Heap / Non-Heap 메모리, GC, 스레드

CPU
→ CPU 사용량, 시스템 부하

DB / Connection Pool
→ DB 커넥션 풀 사용량

Cache
→ 캐시 요청 수, Hit / Miss 등
```

### 포인트5 — 필요한 메트릭은 직접 만들 수도 있다

기본적으로 제공되는 메트릭만으로 부족하다면 Micrometer(spring actuator 라이브러리가 가지고있는 라이브러리)를 이용해 애플리케이션에 필요한 커스텀 메트릭을 직접 정의할 수도 있습니다.

예를 들어 쿠폰 발급 성공 건수를 측정하고 싶다면 다음과 같이 Counter를 등록할 수 있습니다.

```kotlin
@Component
class CouponMetrics(
    meterRegistry: MeterRegistry
) {
    private val issuedCounter = Counter.builder("coupon.issued")
        .description("발급된 쿠폰 수")
        .register(meterRegistry)

    fun recordIssued() {
        issuedCounter.increment()
    }
}
```

쿠폰이 발급될 때 recordIssued()를 호출하면 다음과 같은 메트릭을 수집할 수 있습니다.

이처럼 Actuator가 기본적으로 제공하는 메트릭뿐만 아니라, 서비스에서 중요하게 생각하는 비즈니스 지표를 직접 메트릭으로 만들어 모니터링할 수도 있습니다.

<br>

> `핵심` — Actuator는 JVM, HTTP 요청, DB 커넥션 등 애플리케이션의 다양한 상태를 메트릭으로 노출하고, Micrometer를 이용하면 서비스에 필요한 커스텀 메트릭까지 직접 정의할 수 있습니다.