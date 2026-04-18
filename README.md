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

카테고리는 **Engineering**과 **Learning** 두 개의 대그룹으로 나뉘어 관리됩니다. 사이드바에서는 이 그룹별로 카테고리가 묶여서 표시됩니다.

| 그룹 | 카테고리 (Frontmatter `category` 필드값) |
|------|-----------------------------------------|
| **Engineering** | `Backend`, `Database`, `JPA`, `Kafka`, `Redis`, `Security`, `Spring Boot, JAVA`, `Spring` |
| **Learning** | `devOps`, `Docker`, `Git`, `Kubernetes`, `Testing` |

**카테고리별 썸네일 자동 적용:**

| 카테고리 | 썸네일 파일명 (`public/images/thumbnails/`) |
|----------|-----------------|
| `Spring` | `spring.png` |
| `JPA` | `jpa.png` |
| `Docker` | `docker.png` |
| `Kubernetes` | `kubernetes.png` |
| `Kafka` | `kafka.png` |
| `Redis` | `redis.png` |
| `Git` | `git.png` |
| `Security` | `security.png` |
| `devOps` | `devops.png` |
| `Backend` | `backend.png` |
| `Database` | `database.png` |
| `Testing` | `testing.png` |
| `Spring Boot, JAVA` | `spring-boot-java.png` |

> **새 카테고리 추가 시:**
> 1. `src/lib/categories.ts` 파일의 `CATEGORY_GROUPS` 객체에 카테고리 이름을 추가하세요. (새로운 그룹을 키로 추가할 수도 있습니다.)
> 2. `public/images/thumbnails/{카테고리_소문자}.png` 파일을 추가하면 썸네일이 자동 적용됩니다.
> 3. `src/lib/categoryEmoji.ts`에서 카테고리에 맞는 이모지를 설정할 수 있습니다.

---

### 태그 설정

배열 형식으로 지정합니다. 카테고리보다 세분화된 기술 키워드를 사용합니다.

```yaml
tags: ["Spring Boot", "JPA", "Hibernate", "성능최적화"]
```

---

### 썸네일 설정

썸네일은 다음 우선순위에 따라 결정됩니다.

1.  **전체 경로 직접 지정 (최우선)**
    `thumbnail` 필드에 `/`로 시작하는 경로를 입력하면 해당 이미지를 그대로 사용합니다.
    ```yaml
    thumbnail: "/images/posts/my-post/cover.png"
    ```

2.  **파일명만 지정**
    파일명(확장자 포함)만 입력하면 `public/images/thumbnails/` 디렉토리에서 해당 파일을 찾습니다.
    ```yaml
    thumbnail: "custom-thumb.png"  # → /images/thumbnails/custom-thumb.png
    ```

3.  **자동 지정 (필드 생략 시)**
    `thumbnail` 필드를 생략하거나 비워두면 **카테고리**에 맞춰 아래와 같이 이미지가 자동 선택됩니다.

    | 카테고리 (Frontmatter) | 적용 이미지 (`/images/thumbnails/`) |
    | :--- | :--- |
    | `Architecture` | `spring.png` |
    | `SpringBoot` | `spring-boot-java.png` |
    | `SpringSecurity` | `security.png` |
    | `MySQL` | `database.png` |
    | `API` | `backend.png` |
    | `RabbitMQ` | `devops.png` |
    | **그 외 카테고리** | `{카테고리명_소문자}.png` |

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
