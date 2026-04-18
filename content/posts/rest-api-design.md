---
title: "[Example] REST API 설계 원칙과 실전 가이드"
date: "2025-08-30"
category: "API"
tags: ["REST", "API", "Backend", "설계"]
excerpt: "REST API를 만들 때 URL을 어떻게 짜야 하는지, 상태 코드는 뭘 써야 하는지 매번 헷갈린다. 실전에서 바로 쓸 수 있는 기준을 정리했다."
---

## 1. URL 설계

리소스는 명사, 동사는 HTTP 메서드로 표현한다.

```
# 나쁜 예
GET  /getUsers
POST /createUser
POST /deleteUser/1

# 좋은 예
GET    /users
POST   /users
DELETE /users/{id}
```

계층 관계는 슬래시로 표현한다.

```
GET  /users/{userId}/orders          # 특정 사용자의 주문 목록
GET  /users/{userId}/orders/{orderId} # 특정 주문
POST /users/{userId}/orders          # 주문 생성
```

## 2. HTTP 메서드

| 메서드 | 용도 | 멱등성 |
|--------|------|--------|
| GET | 조회 | ✓ |
| POST | 생성 | ✗ |
| PUT | 전체 수정 | ✓ |
| PATCH | 부분 수정 | △ |
| DELETE | 삭제 | ✓ |

## 3. 상태 코드

```
200 OK          → 조회, 수정 성공
201 Created     → 생성 성공 (Location 헤더 포함)
204 No Content  → 삭제 성공

400 Bad Request      → 요청 형식 오류, 유효성 검증 실패
401 Unauthorized     → 인증 필요
403 Forbidden        → 인증은 됐지만 권한 없음
404 Not Found        → 리소스 없음
409 Conflict         → 중복 (이미 존재하는 이메일 등)
422 Unprocessable    → 비즈니스 로직 오류

500 Internal Server Error → 서버 내부 오류
```

## 4. 응답 형식 통일

```json
{
  "data": {
    "id": 1,
    "name": "홍길동",
    "email": "hong@example.com"
  }
}
```

에러 응답:

```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "사용자를 찾을 수 없습니다.",
    "details": [
      {
        "field": "userId",
        "message": "존재하지 않는 ID입니다."
      }
    ]
  }
}
```

## 5. 페이지네이션

```
# 오프셋 기반
GET /posts?page=2&size=20

# 커서 기반 (대용량 데이터에 적합)
GET /posts?cursor=eyJpZCI6MTAwfQ&size=20
```

응답에 페이지 메타 포함:

```json
{
  "data": [...],
  "meta": {
    "page": 2,
    "size": 20,
    "totalElements": 500,
    "totalPages": 25,
    "hasNext": true
  }
}
```

## 6. API 버전 관리

```
# URI 버전 (가장 명확함)
GET /v1/users
GET /v2/users

# 헤더 버전
GET /users
Accept: application/vnd.myapp.v2+json
```
