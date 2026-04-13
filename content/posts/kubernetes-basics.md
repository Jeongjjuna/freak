---
title: "[Example] Kubernetes 핵심 개념 정리 - Pod부터 Ingress까지"
date: "2025-10-28"
category: "Kubernetes"
tags: ["Kubernetes", "K8s", "DevOps", "Container"]
excerpt: "Docker를 쓰다 보면 자연스럽게 Kubernetes로 넘어가게 된다. 처음엔 개념이 많아 막막하지만, 핵심 리소스 몇 가지만 이해하면 전체 그림이 보인다."
---

## 1. 핵심 개념 한눈에 보기

```
Cluster
└── Node (실제 서버)
    └── Pod (컨테이너 묶음)
        └── Container
```

**Pod**: 배포의 최소 단위. 같은 Pod의 컨테이너는 localhost로 통신한다.
**Deployment**: Pod를 선언적으로 관리. 롤링 업데이트, 롤백 지원.
**Service**: Pod에 고정된 IP와 DNS를 부여.
**Ingress**: 외부 HTTP/HTTPS 트래픽을 서비스로 라우팅.

## 2. Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: my-app:1.0.0
          ports:
            - containerPort: 8080
          resources:
            requests:
              cpu: "250m"
              memory: "256Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
```

## 3. Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-svc
spec:
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 8080
  type: ClusterIP
```

`ClusterIP`: 클러스터 내부 통신용
`NodePort`: 외부에서 노드 IP로 직접 접근
`LoadBalancer`: 클라우드 로드밸런서 연결

## 4. Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /users
            pathType: Prefix
            backend:
              service:
                name: user-svc
                port:
                  number: 80
          - path: /orders
            pathType: Prefix
            backend:
              service:
                name: order-svc
                port:
                  number: 80
```

## 5. 자주 쓰는 명령어

```bash
# 리소스 확인
kubectl get pods
kubectl get deployments
kubectl describe pod my-pod

# 로그
kubectl logs -f my-pod
kubectl logs -f my-pod -c my-container  # 멀티컨테이너

# 스케일
kubectl scale deployment my-app --replicas=5

# 롤링 업데이트
kubectl set image deployment/my-app my-app=my-app:2.0.0

# 롤백
kubectl rollout undo deployment/my-app
```
