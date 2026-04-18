export const CATEGORY_GROUPS = {
  Engineering: [
    'Architecture',
    // 시스템 구조와 설계 결정
    // - 헥사고날 / MSA / 이벤트 기반 아키텍처
    // - 도메인 모델링, Aggregate 경계, 트랜잭션 설계
    // - API 및 인터페이스 설계
    // - 테스트 전략 및 테스트 아키텍처 설계
    // - 안정성 설계 (Circuit Breaker, Retry, Timeout, Fallback, Rate Limit)
    // 예) Outbox Pattern 적용기, 외부 API 안정성 아키텍처, Fail Fast 전략

    'Troubleshooting',
    // 실제 문제 및 장애 해결 과정
    // - 장애 원인 분석 및 디버깅
    // - timeout, deadlock, N+1, connection pool 고갈
    // - Kafka consumer 이슈, 외부 API 호출 문제 등
    // 예) Connection Timeout 원인 추적, Kafka Lag 장애 분석

    'Performance',
    // 성능 개선 및 최적화 경험
    // - 캐싱 전략, DB 쿼리 튜닝
    // - 병목 분석 및 제거
    // - latency / throughput / TPS 개선
    // 예) Redis 캐싱 도입으로 DB 부하 감소, Query 튜닝 사례
  ],

  Learning: [
    'API',
    'SpringBoot',
    'SpringBatch',
    'SpringSecurity',
    'JPA',
    'MySQL',
    'RabbitMQ',
    'Kafka',
    'Redis',
    'Docker',
    'Git',
    'Kubernetes',
    'Security',
    'Testing'
  ]
} as const;

export type CategoryGroupName = keyof typeof CATEGORY_GROUPS;
