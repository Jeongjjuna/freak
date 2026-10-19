---
title: "Nginx 무중단 배포 실습: 트래픽 전환과 Upstream"
date: "2026-10-13"
thumbnail: "backend.png"
category: "Review"
tags: ["Nginx", "Backend", "Deployment", "LoadBalancing"]
excerpt: "Nginx upstream 을 활용한 무중단 배포 방식 정리"
---


# 배경
사내에는 Kubernetes 기반 서버뿐 아니라 VM 기반으로 운영되는 서버들도 많이 있습니다.
이 중 일부 VM 서비스는 배포 과정에서 일시적인 순단이 발생하고 있어, 이를 개선하기 위해 무중단 배포 방식을 검토했습니다.

- Kubernetes 환경: Graceful Shutdown과 Rolling Update를 통한 배포
- VM 환경: 배포 과정에서 일부 요청이 실패할 수 있는 구조


## 기존 방식의 한계
기존에는 물리적인 Load Balancer(LB)가 각 VM 내부의 Nginx로 트래픽을 전달하고 있었습니다.

nginx -s quit은 Nginx가 처리 중인 요청을 마무리한 뒤 종료하는 명령입니다.
하지만 앞단의 LB가 해당 VM을 트래픽 분산 대상에서 제외하지 않으면, Nginx가 종료되는 동안에도 요청이 전달될 수 있습니다.

LB는 일반적으로 헬스체크 등을 통해 비정상 서버를 분산 대상에서 제외하지만,
헬스체크 주기나 설정에 따라 반영되기까지 시간이 걸릴 수 있습니다.
실제 테스트에서도 이 과정에서 일부 502 오류가 발생하는 것을 확인했습니다.

일시적인 순단을 허용할 수 있는 서비스라면 큰 문제가 아닐 수도 있습니다.
하지만 요청 재시도나 최종 일관성이 보장되지 않는 레거시 시스템이라면 배포 중 발생하는 요청 실패도 신중하게 다뤄야 합니다.

## 개선방향

기존 LB와 VM 구성을 유지하면서, 배포 대상 VM의 Nginx가 전달하는 트래픽을 다른 VM으로 전환하는 방식으로 개선했습니다.

예를 들어 VM 1을 배포한다면 다음과 같이 진행합니다.

1. VM 1의 Nginx upstream을 VM 2로 변경하고 reload합니다.
2. nginx -t로 설정을 검증한 뒤 reload하고, 정상적으로 적용됐는지 확인합니다.
2. VM 1의 Spring Boot를 배포합니다.
3. 배포 후 정상 동작을 확인하고 upstream을 원래대로 복구합니다.

![img1.png](/images/posts/nginx-deployment-practice/img1.png)


- 아래는 nginx upstream 전환 예시입니다.
```nginx
events {
    worker_connections 1024;
}

http {
    upstream springboot_servers {
        # VM1의 Spring Boot (배포 대상)
        # server host.docker.internal:8080;
    
        # VM2의 Spring Boot (배포 중 트래픽 전환 대상)
        server host.docker.internal:8081;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            proxy_pass http://springboot_servers;

            # upsatream 연결실패에도 재시도하지 않도록 설정.(HTTP Status 확인을 위함)
            proxy_next_upstream off;

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

이렇게 하면 LB 설정을 변경하지 않고도 배포 대상 VM으로 들어오는 요청을 다른 VM으로 우회할 수 있습니다.
다만, VM1의 트래픽이 다른 VM2, 3 등으로 분산되어서 RPS 가 증가할 수 있기 때문에 이러한 점은 인지하고 있어야합니다.

## upstream 전환과 Graceful Shutdown
Nginx의 upstream 설정을 변경하고 reload하면, 새 설정을 적용한 worker는 신규 요청을 변경된 upstream으로 전달합니다.
따라서 애플리케이션을 배포하기 전에 upstream 전환이 정상적으로 적용됐는지 확인해야 합니다.

(재현 및 테스트 완료 - 실습 내용은 추후 첨부 예정)

다만 Nginx의 graceful reload와 Application Server의 Graceful Shutdown은 별개의 동작입니다.
트래픽을 전환하는 것뿐 아니라, 애플리케이션에서 처리 중인 요청을 안전하게 마무리하는 과정까지 되어야 무중단 배포라고 할 수 있을 것 같습니다.

Spring Boot의 Graceful Shutdown은 추후 다른 글에서 정리해보겠습니다.

## proxy_next_upstream
Nginx는 upstream 요청에서 오류가 발생했을 때 다른 서버로 재시도할 수 있습니다.
proxy_next_upstream으로 재시도 조건을 지정할 수 있으며, 기본적으로 네트워크 오류(error)와 시간 초과(timeout) 등이 포함됩니다.

요청을 처리한 서버에서 응답을 전달하는 도중 오류가 발생하면, 실제 비즈니스 로직이 실행됐는지 확실하지 않을 수 있습니다.
이때 요청을 재시도하면 동일한 작업이 중복 실행될 가능성이 있습니다.

GET 요청과 같이 멱등성이 보장되는 요청이라면 문제없겠지만, 일부 레거시 API의 멱등성이 보장되지 않는 상황을 고려해 이번에는 proxy_next_upstream off로 설정했습니다.
물론 재시도를 끄면 일시적인 네트워크 오류로 요청이 실패할 가능성도 있습니다만, 
이번에는 배포 과정에서 발생하는 요청 실패를 줄이는 데 집중하고, 이후에는 TCP 연결 수립 실패처럼 요청이 upstream에 전달되지 않은 경우와,
요청이 전달된 뒤 응답에 실패한 경우를 구분해 재시도 조건을 더 세밀하게 설정하는 방법도 살펴보기로 했습니다.(Nginx 지원 설정들을 조금 더 자세히 살펴보면 좋을 것 같습니다.)

## 기타

무중단 배포를 구현하는 방법은 여러 가지가 있지만,
현재 인프라 구조를 최대한 유지하면서 간단한 스크립트 수정만으로 배포 방식을 개선해봤습니다.