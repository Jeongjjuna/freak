---
title: "[Example] 메시지 브로커가 뭔데, RabbitMQ 이해하기"
date: "2026-01-08"
category: "devOps"
tags: ["RabbitMQ", "메시지큐", "MSA", "DevOps"]
excerpt: "그간 RabbitMQ를 많이 사용해왔지만 어떻게 동작하는지 자세히 학습해본적이 없어 이번 기회에 정리해보려 한다. 요즘 시스템 아키텍처를 이야기하면 REST API, gRPC, Kafka, RabbitMQ 이런 단어를 쉽게 접한다."
---

## 1. 메시지 브로커란?

메시지 브로커는 **생산자(Producer)**와 **소비자(Consumer)** 사이에서 메시지를 중개하는 미들웨어다.

직접 통신 대신 브로커를 거치면:
- 생산자는 소비자의 상태를 신경 쓰지 않아도 된다
- 소비자가 처리 불가 상태여도 메시지가 유실되지 않는다
- 시스템 간 결합도를 낮출 수 있다

## 2. RabbitMQ 핵심 개념

### Exchange

Producer가 메시지를 발행하는 곳. Exchange는 라우팅 규칙에 따라 Queue로 메시지를 전달한다.

| 타입 | 동작 |
|------|------|
| Direct | 라우팅 키가 정확히 일치하는 Queue로 전달 |
| Fanout | 연결된 모든 Queue로 브로드캐스트 |
| Topic | 패턴 매칭으로 Queue 선택 |
| Headers | 메시지 헤더 기반 라우팅 |

### Queue

메시지가 쌓이는 공간. Consumer가 연결되어 메시지를 꺼내간다.

### Binding

Exchange와 Queue를 연결하는 규칙.

## 3. 기본 흐름

```
Producer → Exchange → (Binding) → Queue → Consumer
```

```java
// 메시지 발행 예시
rabbitTemplate.convertAndSend("my.exchange", "my.routing.key", message);

// 메시지 수신 예시
@RabbitListener(queues = "my.queue")
public void handleMessage(String message) {
    System.out.println("Received: " + message);
}
```

## 4. Acknowledgement

Consumer가 메시지를 받았다고 확인 응답을 보내야 Queue에서 메시지가 제거된다.

- `auto ack`: 메시지를 전달하자마자 삭제 (유실 위험)
- `manual ack`: Consumer가 처리 완료 후 명시적으로 ack 전송

```java
@RabbitListener(queues = "my.queue", ackMode = "MANUAL")
public void handleMessage(String message, Channel channel,
        @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws Exception {
    // 처리 로직
    channel.basicAck(tag, false);
}
```
