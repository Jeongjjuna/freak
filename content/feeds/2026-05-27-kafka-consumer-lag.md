---
date: "2026-05-28T18:45:00+09:00"
tags: ["Kafka", "Troubleshooting", "메시지큐"]
---

Kafka consumer lag 모니터링할 때 자주 놓치는 포인트 정리:

1. **lag 자체보다 변화율(derivative)** 을 봐야 한다. 절대값 1만 건은 throughput 이 큰 토픽에선 아무것도 아닐 수 있음.
2. consumer group 단위로 봐야지, partition 평균을 보면 hot partition 을 놓친다.
3. `__consumer_offsets` 토픽도 모니터링 대상. 여기 lag 가 생기면 다른 토픽의 commit 이 지연됨.

오늘 잡은 장애도 결국 1·2번이 원인이었다. partition 0번만 lag 가 폭주하는데 평균값으론 안 보였음.
