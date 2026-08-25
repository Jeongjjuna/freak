---
date: "2026-08-24T21:00:00+09:00"
tags: ["Backend", "Logging", "Logback", "Filebeat", "ELK", "Grafana"]
---

## 로그 — Logback → Filebeat → Logstash → Elasticsearch → Grafana

메트릭만으로는 "에러가 발생했다", "응답 시간이 증가했다" 정도의 상황은 알 수 있지만, **왜 그런 문제가 발생했는지에 대한 상세한 정보는 로그를 확인해야 하는 경우가 많습니다.**

Spring Boot에서는 Logback으로 애플리케이션의 로그를 파일에 기록하고, Filebeat를 통해 중앙으로 수집하는 구조를 구성할 수 있습니다.

### 포인트1 — Logback이 애플리케이션의 로그를 기록한다

Spring Boot 애플리케이션에서 발생한 로그는 Logback 등을 통해 파일로 기록할 수 있습니다.

```text
Spring Boot
     │
     │ Logback
     ▼
/var/log/application.log
```

예를 들어 다음과 같은 정보가 로그에 기록될 수 있습니다.

```text
2026-08-25 20:10:23 ERROR
requestId=abc123
userId=1004
message="Payment API request failed"
exception="TimeoutException"
```

메트릭이 `요청 수 = 10,000`과 같은 **집계된 수치**를 보여준다면, 로그는 특정 요청에서 **무슨 일이 발생했는지에 대한 상세한 맥락**을 남길 수 있습니다.

### 포인트2 — Filebeat가 로그 파일을 읽어서 전달한다

Filebeat는 애플리케이션이 실행되는 환경에 설치되어 로그 파일을 읽고, 새로운 로그가 발생하면 이를 지정된 목적지로 전달합니다.

```text
[Spring Boot]
     │
     │ Logback
     ▼
[application.log]
     │
     │ Filebeat
     ▼
[Logstash]
```

즉, Filebeat는 애플리케이션이 로그를 직접 전송하는 것이 아니라 **기록된 로그 파일을 읽어서 전달하는 역할**을 합니다.

### 포인트3 — Logstash가 로그를 가공하고 저장소로 전달한다

Logstash를 사용하는 경우 Filebeat에서 전달받은 로그를 파싱하거나 필요한 필드를 추가한 뒤 Elasticsearch와 같은 저장소로 전달할 수 있습니다.
이때 Filebeat와 Logstash 는 TCP 방식으로 통신하여 데이터를 전달합니다.

```text
Spring Boot
    │
    │ Logback
    ▼
Log File
    │
    │ Filebeat
    ▼
Logstash
    │
    │ Parse / Transform
    ▼
Elasticsearch
    │
    │ Query
    ▼
Grafana
```

다만 Logstash는 **필수가 아닙니다.**

로그 형식이 이미 JSON으로 잘 구조화되어 있고 별도의 가공이 필요하지 않다면 Filebeat에서 Elasticsearch 등으로 직접 전달하는 구성도 가능합니다.
이때 Filebeat 와 Elasticsearch는 HTTP 방식으로 통신하여 데이터를 전달합니다.(Filebeat 가 Elasticsearch 목적지를 HTTP 로 호출) 

### 포인트4 — Grafana에서 로그를 검색하고 확인한다

Grafana에서는 Elasticsearch 등의 로그 저장소를 데이터 소스로 연결해 로그를 검색하고 시각화할 수 있습니다.

```text
메트릭
→ "5xx 응답이 갑자기 증가했다."

로그
→ "어떤 요청에서 어떤 예외가 발생했는가?"
```

이처럼 메트릭과 로그는 서로 대체하기보다는 **서로 다른 정보를 제공하면서 함께 사용하는 경우가 많습니다.**

<br>

> `핵심` — 로그는 "애플리케이션에서 무슨 일이 발생했는가?"를 상세하게 확인하기 위한 데이터이며, 대표적으로 **Logback → Filebeat → Logstash → Elasticsearch → Grafana**와 같은 파이프라인으로 수집하고 조회할 수 있습니다.