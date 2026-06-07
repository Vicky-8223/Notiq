#!/bin/bash

docker exec -it notiq-kafka kafka-topics \
--create \
--topic notification-request \
--bootstrap-server localhost:9092 \
--partitions 3 \
--replication-factor 1

docker exec -it notiq-kafka kafka-topics \
--create \
--topic notification-retry \
--bootstrap-server localhost:9092 \
--partitions 3 \
--replication-factor 1

docker exec -it notiq-kafka kafka-topics \
--create \
--topic notification-dlq \
--bootstrap-server localhost:9092 \
--partitions 1 \
--replication-factor 1

