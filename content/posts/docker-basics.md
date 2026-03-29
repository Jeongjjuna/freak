---
title: "Docker 기초부터 실전까지 - 컨테이너 이해하기"
date: "2025-12-15"
category: "Docker"
tags: ["Docker", "Container", "DevOps", "인프라"]
excerpt: "Docker를 처음 접하면 가상머신과 뭐가 다른지, 왜 써야 하는지 막막하게 느껴진다. 이번 글에서는 Docker의 핵심 개념과 실제 사용법을 정리해본다."
---

## 1. 컨테이너 vs 가상머신

가상머신(VM)은 호스트 OS 위에 하이퍼바이저를 두고 게스트 OS를 통째로 올린다. 반면 컨테이너는 호스트 OS의 커널을 공유하고, 프로세스 격리만 수행한다.

| 구분 | VM | Container |
|------|-----|-----------|
| 부팅 시간 | 분 단위 | 초 단위 |
| 용량 | GB | MB |
| 격리 수준 | 완전 격리 | 프로세스 격리 |

## 2. Dockerfile 작성

```dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 레이어 캐시 활용

```dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

# 의존성 변경이 없으면 캐시 사용
COPY pom.xml .
RUN mvn dependency:resolve

COPY src ./src
RUN mvn package -DskipTests

ENTRYPOINT ["java", "-jar", "target/app.jar"]
```

## 3. Docker Compose

여러 컨테이너를 함께 관리할 때 사용한다.

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/mydb
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: mydb
    volumes:
      - mysql-data:/var/lib/mysql

volumes:
  mysql-data:
```

## 4. 자주 쓰는 명령어

```bash
# 이미지 빌드
docker build -t my-app:1.0 .

# 컨테이너 실행
docker run -d -p 8080:8080 --name my-container my-app:1.0

# 로그 확인
docker logs -f my-container

# 컨테이너 접속
docker exec -it my-container /bin/bash

# 컴포즈 실행
docker compose up -d

# 컴포즈 종료 및 삭제
docker compose down -v
```
