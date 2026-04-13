---
title: "[Example] Git 브랜치 전략 - Git Flow vs Trunk Based"
date: "2025-08-15"
category: "Git"
tags: ["Git", "Git Flow", "Trunk Based", "협업"]
excerpt: "팀마다 브랜치 전략이 다르다. Git Flow와 Trunk Based Development의 차이를 정리하고, 어떤 상황에 무엇을 선택해야 할지 생각해봤다."
---

## 1. Git Flow

```
main
└── develop
    ├── feature/login
    ├── feature/payment
    └── release/1.2.0
        └── hotfix/1.2.1
```

**main**: 프로덕션 코드
**develop**: 다음 릴리즈를 위한 통합 브랜치
**feature**: 기능 개발
**release**: QA 및 배포 준비
**hotfix**: 긴급 버그 수정

```bash
# 기능 개발 시작
git checkout -b feature/user-auth develop

# 완료 후 develop 병합
git checkout develop
git merge --no-ff feature/user-auth
git branch -d feature/user-auth

# 릴리즈
git checkout -b release/1.2.0 develop
# ... 버그 수정, 버전 업 ...
git checkout main && git merge --no-ff release/1.2.0
git tag -a v1.2.0
git checkout develop && git merge --no-ff release/1.2.0
```

**장점**: 릴리즈 관리가 명확하다.
**단점**: 브랜치가 많아 복잡하다. 머지 충돌이 잦다.

## 2. Trunk Based Development

모든 개발자가 `main`에 직접 커밋하거나, 수명이 짧은 브랜치(1~2일)만 사용한다.

```
main ←── feature/login (1일)
     ←── fix/null-check (반나절)
     ←── feature/payment (2일)
```

**핵심 원칙**:
- 브랜치 수명은 최대 2일
- 매일 최소 1번 main에 통합
- Feature Flag로 미완성 기능 숨기기

```java
// Feature Flag 예시
if (featureFlags.isEnabled("new-payment-ui", userId)) {
    return newPaymentService.process(req);
} else {
    return legacyPaymentService.process(req);
}
```

**장점**: 지속적 통합. 머지 충돌 최소화.
**단점**: 강력한 CI/CD와 테스트 커버리지가 전제됨.

## 3. 어떤 걸 써야 하나

| 상황 | 추천 |
|------|------|
| 정기 릴리즈, 여러 버전 유지 | Git Flow |
| CI/CD 잘 갖춰진 SaaS | Trunk Based |
| 소규모 팀, 빠른 배포 | Trunk Based |
| 엔터프라이즈, 긴 QA 사이클 | Git Flow |

## 4. 커밋 메시지 컨벤션

```
feat: 로그인 API 추가
fix: 토큰 만료 시 NPE 수정
refactor: UserService 레이어 분리
test: 결제 서비스 단위 테스트 추가
docs: API 문서 업데이트
chore: 의존성 업그레이드
```
