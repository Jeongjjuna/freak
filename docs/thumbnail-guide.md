# 썸네일 사용 가이드

블로그 포스트와 피드 카드에 표시되는 썸네일 이미지를 설정하는 방법입니다.

## 1. 썸네일 결정 우선순위
시스템은 다음 순서에 따라 썸네일 이미지를 결정합니다.

1.  **Front-matter의 `thumbnail` 필드**: 직접 지정한 경로 또는 파일명
2.  **본문 내 첫 번째 이미지**: 포스트 본문에 포함된 첫 번째 `![]()` 또는 `<img>` 태그의 이미지
3.  **카테고리별 기본 이미지**: 위 항목이 없을 경우 카테고리 이름에 따라 자동으로 매칭되는 기본 이미지
4.  **공통 기본 이미지**: 매칭되는 카테고리가 없을 경우 사용되는 기본 이미지

---

## 2. Front-matter에서 설정하기 (추천)
마크다운 파일 최상단의 Front-matter 영역에 `thumbnail` 필드를 추가하여 설정할 수 있습니다.

### A. 기본 제공 이미지 사용
`public/images/thumbnails/` 폴더에 이미 준비된 이미지를 사용할 때는 **파일명**만 입력하면 됩니다. (`.png` 확장자 포함)

```yaml
---
title: "나의 포스트"
category: "SpringBoot"
thumbnail: "spring-boot-java.png"
---
```

**사용 가능한 기본 이미지 리스트:**
- `backend.png`
- `books.png`
- `database.png`
- `devops.png`
- `docker.png`
- `frontend.png`
- `git.png`
- `jpa.png`
- `kafka.png`
- `kotlin.png`
- `kubernetes.png`
- `redis.png`
- `review.png`
- `security.png`
- `spring-boot-java.png`
- `spring.png`
- `testing.png`

### B. 외부 이미지 또는 커스텀 이미지 사용
전체 URL을 입력하거나, `/`로 시작하는 절대 경로를 입력합니다.

```yaml
---
thumbnail: "https://example.com/my-image.jpg"
# 또는
thumbnail: "/images/custom/my-thumb.png"
---
```

---

## 3. 카테고리별 자동 매칭 규칙
`thumbnail` 필드를 비워두면, `category` 필드값에 따라 자동으로 기본 이미지가 할당됩니다.

| 카테고리 (대소문자 구분 없음) | 매칭되는 이미지 |
| :--- | :--- |
| `Architecture` | `spring.png` |
| `SpringBoot` | `spring-boot-java.png` |
| `SpringSecurity`, `Security` | `security.png` |
| `JPA` | `jpa.png` |
| `MySQL`, `Database` | `database.png` |
| `API`, `Backend` | `backend.png` |
| `RabbitMQ`, `Kafka`, `DevOps` | `devops.png` (또는 각 이름) |
| `Kotlin` | `kotlin.png` |
| `Frontend` | `frontend.png` |
| `Books` | `books.png` |
| `Review` | `review.png` |
| `Git` | `git.png` |
| `Redis` | `redis.png` |
| `Docker` | `docker.png` |
| `Kubernetes` | `kubernetes.png` |
| `Testing` | `testing.png` |
| `Troubleshooting`, `Performance`, `Algorithm`, `Linux` | `backend.png` (기본값) |
| `SpringBatch` | `spring.png` |

> **Tip:** 카테고리 이름과 이미지 파일명이 같으면 (예: category가 `Kafka`이고 `kafka.png`가 있으면) 자동으로 연결됩니다.

## 5. 새로운 카테고리 추가 시 수정 가이드

카테고리를 새롭게 추가할 경우, 다음 파일들을 순서대로 수정해야 합니다.

### 1단계: 카테고리 정의 추가 (`app/utils/categories.ts`)
사이드바나 목록에 노출될 수 있도록 카테고리 그룹에 이름을 추가합니다.

```typescript
export const CATEGORY_GROUPS = {
  Learning: [
    // ... 기존 카테고리
    'NewCategory', // 여기에 추가
  ],
  // ...
}
```

### 2단계: 썸네일 매칭 설정 (`app/utils/image.ts`)
카테고리 이름과 썸네일 이미지 파일명이 다를 경우, `mapping` 객체에 연결 설정을 추가합니다. (카테고리명은 모두 소문자로 작성)

```typescript
const mapping: Record<string, string> = {
  newcategory: 'matching-image-name', // .png 제외한 파일명
}
```

### 3단계: 가이드 문서 업데이트 (`docs/thumbnail-guide.md`)
현재 이 문서의 `3. 카테고리별 자동 매칭 규칙` 표에 새로운 카테고리를 추가하여 다른 사용자들도 알 수 있게 합니다.
