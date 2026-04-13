---
title: "[Example] Testcontainers로 실제 DB 쓰는 통합 테스트 작성하기"
date: "2025-07-10"
category: "Testing"
tags: ["Testcontainers", "Testing", "Spring", "JPA"]
excerpt: "H2로 테스트하다 프로덕션에서 터지는 경험을 한 번쯤 해봤을 것이다. Testcontainers를 쓰면 실제 MySQL로 테스트할 수 있다."
---

## 1. H2 테스트의 문제점

- MySQL 전용 함수 (`DATE_FORMAT`, `REGEXP_LIKE` 등) 사용 불가
- JSON 타입, 전문검색 등 MySQL 특화 기능 테스트 불가
- 실제 인덱스 동작 확인 불가
- 마이그레이션 스크립트(Flyway/Liquibase) 검증 불가

## 2. 의존성 추가

```gradle
testImplementation 'org.testcontainers:junit-jupiter:1.19.3'
testImplementation 'org.testcontainers:mysql:1.19.3'
```

## 3. 기본 설정

```java
@SpringBootTest
@Testcontainers
class UserRepositoryTest {

    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mysql::getJdbcUrl);
        registry.add("spring.datasource.username", mysql::getUsername);
        registry.add("spring.datasource.password", mysql::getPassword);
    }

    @Autowired
    UserRepository userRepository;

    @Test
    void 사용자를_이메일로_조회한다() {
        userRepository.save(new User("홍길동", "hong@example.com"));

        Optional<User> found = userRepository.findByEmail("hong@example.com");

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("홍길동");
    }
}
```

## 4. 공유 컨테이너로 테스트 속도 개선

매 테스트 클래스마다 컨테이너를 새로 띄우면 느리다. 하나를 공유하면 전체 테스트 시간이 크게 줄어든다.

```java
// AbstractIntegrationTest.java
@SpringBootTest
@Testcontainers
public abstract class AbstractIntegrationTest {

    static final MySQLContainer<?> mysql;

    static {
        mysql = new MySQLContainer<>("mysql:8.0")
            .withDatabaseName("testdb")
            .withReuse(true);  // 컨테이너 재사용
        mysql.start();
    }

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mysql::getJdbcUrl);
        registry.add("spring.datasource.username", mysql::getUsername);
        registry.add("spring.datasource.password", mysql::getPassword);
    }
}

// 실제 테스트
class OrderServiceTest extends AbstractIntegrationTest {
    @Test
    void 주문_생성_테스트() { ... }
}
```

## 5. @Sql로 테스트 데이터 관리

```java
@Test
@Sql("/sql/insert-users.sql")
@Sql(scripts = "/sql/cleanup.sql", executionPhase = AFTER_TEST_METHOD)
void 사용자_목록_조회() {
    List<User> users = userRepository.findAll();
    assertThat(users).hasSize(3);
}
```

```sql
-- /sql/insert-users.sql
INSERT INTO users (name, email) VALUES ('홍길동', 'hong@test.com');
INSERT INTO users (name, email) VALUES ('김철수', 'kim@test.com');
INSERT INTO users (name, email) VALUES ('이영희', 'lee@test.com');
```

## 6. Redis, Kafka도 동일하게

```java
@Container
static GenericContainer<?> redis = new GenericContainer<>("redis:7")
    .withExposedPorts(6379);

@Container
static KafkaContainer kafka = new KafkaContainer(
    DockerImageName.parse("confluentinc/cp-kafka:7.4.0")
);
```
