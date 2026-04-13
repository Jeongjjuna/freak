---
title: "[Example] Kafka 입문 - 왜 쓰고, 어떻게 동작하나"
date: "2025-09-08"
category: "Kafka"
tags: ["Kafka", "MessageQueue", "Backend", "분산시스템"]
excerpt: "RabbitMQ와 달리 Kafka는 로그 기반 메시지 큐다. 왜 대용량 스트리밍에서 Kafka가 선택받는지 구조부터 이해해본다."
---

## 1. Kafka vs 기존 메시지 큐

| 구분 | RabbitMQ | Kafka |
|------|----------|-------|
| 모델 | Push | Pull |
| 메시지 보관 | 소비 후 삭제 | 디스크에 보관 (기간 설정) |
| 처리량 | 중간 | 매우 높음 |
| 순서 보장 | 큐 단위 | 파티션 단위 |
| 재처리 | 어려움 | offset으로 재처리 가능 |

## 2. 핵심 개념

```
Producer → Topic → Consumer Group
              ↓
         Partition 0  → Consumer A
         Partition 1  → Consumer B
         Partition 2  → Consumer C
```

**Topic**: 메시지 카테고리
**Partition**: 병렬 처리 단위. 파티션 수 = 최대 병렬 컨슈머 수
**Offset**: 파티션 내 메시지 위치. 컨슈머가 직접 관리
**Consumer Group**: 같은 그룹 내에서 파티션을 나눠 소비

## 3. Spring Kafka 기본 설정

```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: my-service
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
```

## 4. Producer

```java
@Service
@RequiredArgsConstructor
public class OrderEventPublisher {
    private final KafkaTemplate<String, OrderEvent> kafkaTemplate;

    public void publish(OrderEvent event) {
        kafkaTemplate.send("order-events", event.getOrderId().toString(), event)
            .whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to send event: {}", event, ex);
                } else {
                    log.debug("Event sent: partition={}, offset={}",
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
                }
            });
    }
}
```

## 5. Consumer

```java
@Component
public class OrderEventConsumer {

    @KafkaListener(topics = "order-events", groupId = "inventory-service")
    public void consume(OrderEvent event, Acknowledgment ack) {
        try {
            inventoryService.reserve(event);
            ack.acknowledge();
        } catch (InsufficientStockException e) {
            // Dead Letter Topic으로 이동
            throw e;
        }
    }
}
```

## 6. 파티션 키 전략

같은 키는 항상 같은 파티션으로 가기 때문에 순서가 보장된다.

```java
// 같은 userId의 이벤트는 항상 같은 파티션 → 순서 보장
kafkaTemplate.send("order-events", order.getUserId().toString(), event);
```

파티션 수보다 컨슈머가 많으면 유휴 컨슈머가 생긴다.
