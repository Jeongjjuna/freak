# Freak Blog

Next.js 기반 정적 블로그. 마크다운 파일로 포스트를 작성합니다.

## 포스트 작성 규칙

포스트는 `content/posts/` 디렉토리에 `.md` 파일로 작성합니다.

### Frontmatter 구조

```yaml
---
title: "포스트 제목"
date: "YYYY-MM-DD"
category: "카테고리"
tags: ["태그1", "태그2", "태그3"]
excerpt: "포스트 요약 (카드 미리보기에 표시됩니다)"
thumbnail: "/images/thumbnails/custom.png"  # 선택사항
---
```

| 필드 | 필수 | 설명 |
|------|------|------|
| `title` | ✅ | 포스트 제목 |
| `date` | ✅ | 발행일 (`YYYY-MM-DD` 형식) |
| `category` | ✅ | 카테고리 (단일 문자열) |
| `tags` | ✅ | 태그 배열 |
| `excerpt` | ✅ | 포스트 요약 |
| `thumbnail` | ❌ | 썸네일 이미지 경로 (생략 시 카테고리 기반 자동 적용) |

---

### 카테고리 설정

단일 문자열로 지정합니다. 카테고리는 별도 설정 파일 없이 frontmatter에서 자동으로 수집됩니다.

**현재 사용 중인 카테고리:**

| 카테고리 | 썸네일 자동 적용 |
|----------|-----------------|
| `Spring` | spring.png |
| `JPA` | jpa.png |
| `Docker` | docker.png |
| `Kubernetes` | kubernetes.png |
| `Kafka` | kafka.png |
| `Redis` | redis.png |
| `Git` | git.png |
| `Security` | security.png |
| `DevOps` | devops.png |
| `Backend` | backend.png |
| `Database` | database.png |
| `Testing` | testing.png |

> **새 카테고리 추가 시:** `public/images/thumbnails/{카테고리_소문자}.png` 파일도 함께 추가하면 썸네일이 자동 적용됩니다.

> **카테고리 이모지**는 `src/lib/categoryEmoji.ts`에서 관리합니다.

---

### 태그 설정

배열 형식으로 지정합니다. 카테고리보다 세분화된 기술 키워드를 사용합니다.

```yaml
tags: ["Spring Boot", "JPA", "Hibernate", "성능최적화"]
```

---

### 썸네일 설정

**자동 적용 (권장):** `thumbnail` 필드를 생략하면 카테고리 이름을 소문자로 변환하여 자동 적용됩니다.

```
category: "Docker"  →  /images/thumbnails/docker.png
category: "Spring"  →  /images/thumbnails/spring.png
```

**직접 지정:** 특정 이미지를 사용하려면 `thumbnail` 필드에 경로를 명시합니다.

```yaml
thumbnail: "/images/thumbnails/spring-boot-java.png"
```

썸네일 이미지는 `public/images/thumbnails/` 디렉토리에 저장합니다.

---

### 본문 이미지 삽입

이미지 파일은 포스트 slug에 맞춰 디렉토리를 만들어 저장합니다.

```
public/images/posts/{포스트-slug}/image.png
```

마크다운에서 `public/` 이하 경로를 절대경로로 참조합니다.

```markdown
![이미지 설명](/images/posts/spring-transaction/proxy-flow.png)
```

**예시 — `spring-transaction.md` 포스트에 이미지 추가:**

```
public/images/posts/spring-transaction/proxy-flow.png
                                        ↓
![Spring 트랜잭션 흐름](/images/posts/spring-transaction/proxy-flow.png)
```

---

### 파일명 규칙

포스트 파일명은 URL slug로 사용됩니다. 영문 소문자와 하이픈(-)만 사용합니다.

```
content/posts/spring-transaction.md       → /freak/posts/spring-transaction
content/posts/docker-basics.md            → /freak/posts/docker-basics
content/posts/jpa-n-plus-one.md           → /freak/posts/jpa-n-plus-one
```
