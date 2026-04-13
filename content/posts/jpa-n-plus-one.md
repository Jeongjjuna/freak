---
title: "[Example] JPA N+1 문제, 제대로 이해하고 해결하기"
date: "2025-11-05"
category: "JPA"
tags: ["JPA", "Spring", "Hibernate", "성능최적화"]
excerpt: "JPA를 쓰다 보면 반드시 만나는 N+1 문제. 왜 발생하는지, 어떻게 해결하는지 실제 쿼리 로그와 함께 살펴본다."
---

## 1. N+1이 뭔가

Post를 조회했는데 쿼리가 N+1개 나가는 현상이다.

```java
// 이 코드 한 줄이
List<Post> posts = postRepository.findAll();

// 이런 쿼리를 만들어낸다
// SELECT * FROM post          → 1번
// SELECT * FROM comment WHERE post_id = 1   → N번
// SELECT * FROM comment WHERE post_id = 2
// ...
```

## 2. 왜 발생하나

기본 fetch 전략이 `LAZY`이기 때문이다. 연관 엔티티는 실제로 접근할 때 쿼리가 나간다.

```java
@Entity
public class Post {
    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY)
    private List<Comment> comments;
}
```

`EAGER`로 바꿔도 해결이 안 된다. JPQL은 fetch 전략을 무시하고 별도 쿼리를 날린다.

## 3. Fetch Join으로 해결

```java
@Query("SELECT p FROM Post p JOIN FETCH p.comments")
List<Post> findAllWithComments();
```

쿼리 한 방에 해결된다.

```sql
SELECT p.*, c.*
FROM post p
INNER JOIN comment c ON c.post_id = p.id
```

단, **컬렉션 Fetch Join은 페이징 불가**하다. `HibernateJpaDialect: HHH90003004` 경고와 함께 인메모리 페이징이 일어난다.

## 4. @EntityGraph

```java
@EntityGraph(attributePaths = {"comments", "tags"})
List<Post> findAll();
```

Fetch Join보다 선언적으로 쓸 수 있다. 하지만 여러 컬렉션을 동시에 사용하면 MultipleBagFetchException이 발생한다.

## 5. Batch Size로 해결

컬렉션 페이징이 필요할 때 쓰는 방법이다.

```java
@BatchSize(size = 100)
@OneToMany(mappedBy = "post")
private List<Comment> comments;
```

또는 전역 설정:

```yaml
spring:
  jpa:
    properties:
      hibernate:
        default_batch_fetch_size: 100
```

N+1 대신 `IN` 쿼리로 묶어서 처리한다.

```sql
-- N+1 대신
SELECT * FROM comment WHERE post_id IN (1, 2, 3, ..., 100)
```

## 6. 어떤 걸 써야 하나

| 상황 | 해결책 |
|------|------|
| 단건 조회, 컬렉션 없음 | Fetch Join |
| 목록 조회, 페이징 없음 | Fetch Join |
| 목록 조회, 페이징 있음 | BatchSize |
| 복잡한 조인 필요 | QueryDSL + DTO 프로젝션 |
