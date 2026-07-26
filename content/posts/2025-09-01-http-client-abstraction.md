---
title: "HTTP Client 추상화와 예외·장애 알림 공통화"
date: "2025-09-01"
thumbnail: "review.png"
category: "Review"
tags: ["SpringBoot", "HttpClient", "BeanPostProcessor", "Proxy"]
excerpt: "HttpClient 공통 라이브러리를 개선하고 예외 알림 처리를 공통화한 후기를 적어봅니다."
---

## 배경

서버 애플리케이션을 개발하다 보면 외부 시스템과 HTTP로 통신하는 일은 매우 흔합니다. 결제, 인증, 회원, 알림 등 다양한 시스템과 연동하기 위해 HTTP Client를 사용하게 되고, Spring에서는 RestTemplate, WebClient, RestClient와 같은 여러 구현체를 제공합니다.

저희 서비스 역시 다양한 외부 API를 호출하고 있었고, 인터페이스 기반의 공통 HTTP Client 라이브러리를 통해 이를 일관된 방식으로 사용할 수 있도록 구성되어 있었습니다. 덕분에 서비스에서는 HTTP 구현체를 직접 다루지 않고도 외부 API를 손쉽게 연동할 수 있었습니다.

하지만 운영을 이어가면서 개선이 필요한 부분이 보였습니다. Kubernetes 환경에서 간헐적인 네트워크 이슈가 발생했고, 이를 계기로 특정 HTTP Client 구현체에 의존하지 않는 구조의 필요성을 느끼게 되었습니다. 또한 프로젝트마다 WebClient, RestTemplate, RestClient를 혼용하면서 예외 처리 방식과 장애 알림 방식도 조금씩 달라지고 있었습니다.

이번 글에서는 이러한 문제를 해결하기 위해 HTTP Client를 추상화하고, 외부 API 호출의 예외 처리와 장애 알림을 공통화한 과정을 소개해 보겠습니다.


## 기존 구조와 문제점

기존 공통 라이브러리는 인터페이스 기반으로 외부 API를 선언하면, 애플리케이션 시작 시 Proxy Bean을 생성하여 HTTP 요청을 수행하는 구조였습니다.
```java
@HttpClient("/reward")
public interface RewardApi {

    @PostExchange("/send")
    RewardResponse send(RewardRequest request);
}
```

구조는 단순했고 사용하기도 편리했지만, 내부 구현은 WebClient에 직접 의존하고 있었습니다.

```text
Service
│
▼
RewardApi (Proxy)
│
▼
WebClient
```

이 구조에는 두 가지 아쉬운 점이 있었습니다.

첫 번째는 특정 HTTP Client 구현체에 강하게 의존하고 있었다는 점입니다.

운영 중 Kubernetes 환경에서 간헐적인 네트워크 이슈가 발생하면서 다른 HTTP Client를 검토할 필요가 있었지만, 공통 라이브러리가 WebClient에 직접 의존하고 있었기 때문에 구현체를 교체하려면 공통 라이브러리 수정이 필요했습니다. 이를 사용하는 여러 서비스에도 영향이 발생할 수 있어 쉽게 변경하기 어려웠습니다.

두 번째는 외부 API 호출에 대한 운영 정책이 프로젝트마다 달라지고 있었다는 점입니다.

프로젝트마다 사용하는 HTTP Client가 달랐고, 예외 처리 방식과 장애 알림 방식도 조금씩 달랐습니다.
시간이 지나면서 동일한 목적의 코드가 여러 형태로 중복되기 시작했고, 운영 정책을 변경할 때도 여러 프로젝트를 함께 수정해야 하는 문제가 있었습니다.

또한 장애 발생 시 단순히 HTTP 호출 실패라는 정보만 확인할 수 있었고,
어떤 목적지로 요청을 보냈는지, 어떤 과정에서 실패했는지,
어떤 예외가 발생했는지 등의 정보가 일관된 형태로 제공되지 않아
장애 원인을 파악하고 대응하는 데 시간이 필요했습니다.

서비스마다 Slack 알림 포맷과 포함되는 정보도 달랐기 때문에,
운영자가 장애 상황을 빠르게 판단하기 어려운 문제도 있었습니다.

## 개선 목표

이번 개선의 목표는 단순히 WebClient를 RestClient로 교체하는 것이 아니었습니다.

핵심 목표는 다음 네 가지였습니다.

- HTTP Client 구현체에 대한 의존성 제거
- 외부 API 호출 정책의 표준화
- 서비스 코드 변경 없이 구현체 교체 가능
- 장애 발생 시 추적 가능한 정보와 알림 포맷 표준화


HttpClient 공통 라이브러리 개선
1. BeanPostProcessor를 이용한 Proxy Bean 생성

기존 인터페이스 기반 사용 방식은 그대로 유지하면서 내부 구조를 개선했습니다.

애플리케이션 시작 시 BeanPostProcessor가 @HttpClient가 선언된 인터페이스를 스캔하고, 해당 인터페이스를 구현하는 JDK Dynamic Proxy를 생성하여 Spring Bean으로 등록하도록 구성했습니다.


TODO : 그림 추가 예정
--- 

그림처럼 BeanPostProcessor는 @HttpClient 인터페이스를
스캔한 뒤 JDK Dynamic Proxy를 생성하여 Spring Bean으로 등록합니다.
실제 HTTP 호출은 Proxy 내부에서 처리되며, 이 과정에서 공통 로깅,
예외 변환, 장애 알림도 함께 수행합니다.

```java
InvocationHandler handler = (proxy, method, args) -> {
    try {
        // 공통 로깅
        log.info("Call API : {}", method.getName());

        // 실제 HTTP 호출
        return httpClient.execute(method, args);

    } catch (Exception e) {

        // 구현체별 예외를 공통 예외로 변환
        HttpException exception = exceptionMapper.convert(e);
        
        // 장애 알림
        slackNotifier.send(exception);

        throw exception;
    }
};

return Proxy.newProxyInstance(
        apiType.getClassLoader(),
        new Class<?>[]{apiType},
        handler
);
```


덕분에 서비스에서는 기존과 동일하게 Bean을 주입받아 사용할 수 있었고, HTTP 호출 구현은 모두 공통 라이브러리 내부에서 처리할 수 있었습니다.

```text
Application Start

        │
        ▼

BeanPostProcessor

        │
        ▼

@HttpClient 인터페이스 스캔

        │
        ▼

JDK Dynamic Proxy 생성

        │
        ▼

Spring Bean 등록

        │
        ▼

@Service 에서 주입받아 사용
```

인터페이스 사용 방식은 기존과 동일합니다.

```java
@HttpClient("/reward")
public interface RewardApi {

    @PostExchange("/send")
    RewardResponse send(RewardRequest request);
}
```

또한 Proxy 생성 시 @PostExchange, @GetExchange 등의 메타데이터를 한 번만 분석하여 캐싱하도록 구성했습니다. URL, HTTP Method 등의 정보를 초기화 시점에 미리 저장하여 런타임마다 Reflection을 반복하지 않도록 했습니다.


### HTTP Client 구현체 추상화

공통 라이브러리는 HTTP Client의 추상화 계층만 제공하고, 실제 구현체는 각 서비스가 선택하도록 변경했습니다.
Spring Boot의 @ConditionalOnProperty를 활용하여 설정만 변경하면 원하는 구현체가 자동으로 등록되도록 구성했습니다.

기존
```yaml
http:
  client:
```

↓

개선

```yaml
http:
  client:
    implementation: webclient
```
또는
```yaml
http:
  client:
    implementation: restclient
```

덕분에 서비스 코드를 수정하지 않고도 HTTP Client 구현체를 여러 서버에 점진적으로 교체할 수 있게 되었습니다.

또한 기존 서비스들이 한 번에 모든 HTTP Client를 변경하는 것은 위험했기 때문에,
기존 구현체와 신규 구현체를 함께 지원할 수 있는 구조로 설계했습니다.

ClientFactory를 통해 구현체 생성 책임을 분리하고,
설정값 변경만으로 사용할 HTTP Client를 선택할 수 있도록 구성했습니다.

이를 통해 각 서비스별 안정적으로 점진적인 전환이 가능했습니다.

### 공통 예외 처리 및 장애 알림

외부 API 호출은 모두 Proxy를 거치도록 구성했습니다.

Proxy에서는 HTTP 호출 전후에 공통 로직을 수행하도록 하여, 서비스에서는 비즈니스 로직만 작성할 수 있도록 했습니다.

```text
RewardApi.send()
          │ 
          ▼
JDK Dynamic Proxy
 ┌───────────────────────┐
 │ Logging               │
 │ Exception Mapping     │
 │ Slack Notification    │
 └───────────────────────┘
          │ 
          ▼ 
RestClient / WebClient
```

HTTP Client마다 서로 다른 예외를 사용하는 문제도 함께 해결했습니다.

기존에는 구현체에 따라 서로 다른 예외가 발생했습니다.

WebClientResponseException
RestClientException
SocketTimeoutException
ConnectException
ReadTimeoutException

이를 모두 팀에서 사용하는 공통 HttpException으로 변환하도록 구성했습니다.

WebClientResponseException
RestClientException
SocketTimeoutException
ConnectException
ReadTimeoutException

            │
            ▼

      CustomHttpException

또한 장애 발생 시 단순 예외 메시지만 전달하는 것이 아니라,
장애 상황을 빠르게 분석할 수 있도록 공통 메시지 규격을 정의했습니다.

알림 메시지에는 다음 정보를 포함하도록 구성했습니다.

- 호출 대상(destination)
- HTTP Method
- Request URL
- Status Code
- Exception Type
- Exception Trace

이를 통해 어떤 외부 시스템과의 통신에서 문제가 발생했는지,
추가 로그 확인 없이도 장애 상황을 빠르게 판단할 수 있도록 개선했습니다.

### Fluent API 지원

외부 도메인이나 URL이 런타임에 결정되는 경우에는 인터페이스 기반 선언만으로는 대응하기 어려웠습니다.

이를 위해 Fluent API도 함께 제공하여 동적인 HTTP 호출에서도 동일한 예외 처리와 장애 알림 정책을 사용할 수 있도록 했습니다.

```java
httpClient
    .post(url)
    .body(request)
    .on4xxHandler((e) -> { ... })
    .on5xxHandler((e) -> { ... })
    .onErrorSendAlarm((e) -> { ... })
    .execute();
```

인터페이스 기반 호출과 Fluent API 모두 동일한 공통 정책을 적용받도록 구성했습니다.

## 기대 효과

이번 개선을 통해 다음과 같은 효과를 얻을 수 있었습니다.

- 서비스 코드 변경 없이 HTTP Client 구현체 교체 가능
- HTTP Client 구현체와 서비스 간 결합도 감소
- 외부 API 호출에 대한 예외 처리 정책 표준화
- 구현체별 예외를 하나의 HttpException으로 통합
- 장애 알림 및 로깅 정책 공통화
- 향후 새로운 HTTP Client 도입에도 유연하게 대응 가능한 구조 마련
- 장애 발생 시 필요한 컨텍스트 정보를 포함한 빠른 원인 파악 가능

## 마무리

운영 중인 공통 라이브러리를 개선하는 작업은 새로운 기능을 개발하는 것보다 더 신중한 접근이 필요했습니다.

기존 사용 방식과의 호환성을 유지하면서도 구현체를 유연하게 교체할 수 있는 구조를 고민했고, 그 결과 서비스 코드는 거의 변경하지 않으면서도 운영성과 유지보수성을 함께 개선할 수 있었습니다.

특히 이번 작업은 대규모 시스템 개편이나 복잡한 구조 변경이 아니었지만, 반복되고 있던 예외 처리와 장애 대응 방식을 표준화하는 것만으로도 운영 효율성과 시스템 안정성을 높일 수 있었던 의미 있는 개선이었습니다.

이번 작업을 통해 다시 한번 느낀 점은, 좋은 공통 라이브러리는 단순히 코드를 재사용하는 것이 아니라 운영 정책과 변경 비용까지 함께 추상화하는 것이라는 점이었습니다.

앞으로도 새로운 기술을 도입하는 것보다 현재 시스템에 가장 적합한 구조가 무엇인지, 그리고 불필요한 복잡도를 만들지 않으면서 지속적으로 개선할 수 있는 방법은 무엇인지 고민하며 점진적으로 발전시켜 나가려고 합니다.