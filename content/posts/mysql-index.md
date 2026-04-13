---
title: "[Example] MySQL 인덱스 제대로 이해하기 - 왜 느린지 EXPLAIN으로 파악하기"
date: "2025-09-22"
category: "Database"
tags: ["MySQL", "Index", "Database", "성능최적화"]
excerpt: "쿼리가 느리다고 인덱스를 무작정 추가하면 오히려 역효과가 난다. 인덱스 구조와 EXPLAIN 읽는 법을 정리했다."
---

## 1. B-Tree 인덱스 구조

MySQL InnoDB의 기본 인덱스는 B-Tree다. 루트 → 브랜치 → 리프 순으로 탐색한다.

리프 노드에는 실제 데이터(클러스터드 인덱스) 또는 PK 값(세컨더리 인덱스)이 저장된다.

```sql
-- 풀 테이블 스캔: 1000만 건 전체 읽음
SELECT * FROM orders WHERE status = 'PENDING';

-- 인덱스 추가 후: B-Tree 탐색으로 해당 건만 읽음
CREATE INDEX idx_orders_status ON orders(status);
```

## 2. EXPLAIN 읽기

```sql
EXPLAIN SELECT * FROM orders
WHERE user_id = 1 AND status = 'PENDING'
ORDER BY created_at DESC
LIMIT 10;
```

| 컬럼 | 주목할 값 |
|------|---------|
| type | `ALL` (풀스캔) → `ref`, `range` 로 개선 |
| key | 실제 사용된 인덱스 |
| rows | 예상 조회 행 수 (적을수록 좋음) |
| Extra | `Using filesort`, `Using temporary` 는 위험 신호 |

## 3. 복합 인덱스와 선두 컬럼

복합 인덱스는 선두 컬럼부터 순서대로 사용된다.

```sql
CREATE INDEX idx_user_status_date ON orders(user_id, status, created_at);

-- 사용됨 ✓
WHERE user_id = 1
WHERE user_id = 1 AND status = 'PENDING'
WHERE user_id = 1 AND status = 'PENDING' AND created_at > '2025-01-01'

-- 사용 안 됨 ✗
WHERE status = 'PENDING'
WHERE created_at > '2025-01-01'
```

## 4. 인덱스가 무시되는 경우

```sql
-- 함수 사용
WHERE YEAR(created_at) = 2025   -- ✗
WHERE created_at >= '2025-01-01' AND created_at < '2026-01-01'  -- ✓

-- 타입 불일치
WHERE user_id = '1'  -- user_id가 INT인데 문자열 비교 → ✗

-- LIKE 앞쪽 와일드카드
WHERE name LIKE '%홍길동'  -- ✗
WHERE name LIKE '홍길동%'  -- ✓

-- OR 조건 (두 컬럼에 각각 인덱스가 있어야 함)
WHERE user_id = 1 OR status = 'PENDING'
```

## 5. 커버링 인덱스

인덱스만으로 쿼리를 처리할 수 있으면 테이블 접근 없이 결과 반환이 가능하다.

```sql
CREATE INDEX idx_covering ON orders(user_id, status, id, amount);

-- Extra: Using index (테이블 접근 없음)
SELECT id, amount FROM orders WHERE user_id = 1 AND status = 'PAID';
```

조회 성능이 크게 개선된다. 단, 인덱스 크기가 커지므로 쓰기 성능과 트레이드오프.
