# Notiq Infra

Local infrastructure setup for the Notiq project using Docker Compose.

## Services Set Up So Far

| Service | Container Name | Image | Host Port | Container Port | Purpose |
| --- | --- | --- | --- | --- | --- |
| Postgres | `notiq-postgres` | `postgres:16` | `5432` | `5432` | Main relational database |
| Redis | `notiq-redis` | `redis:7` | `6379` | `6379` | Cache / queue support |
| Zookeeper | `notiq-zookeeper` | `confluentinc/cp-zookeeper:7.6.1` | `2181` | `2181` | Kafka coordination |
| Kafka | `notiq-kafka` | `confluentinc/cp-kafka:7.6.1` | `9092` | `9092` | Message broker |

## Environment Variables

The project uses `.env` for local configuration.

```env
POSTGRES_DB=notiq
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432
REDIS_PORT=6379
ZOOKEEPER_PORT=2181
KAFKA_PORT=9092
KAFKA_BROKER_ID=1
```

## Docker Compose Setup

The current `docker-compose.yml` sets up:

- Postgres with persistent volume `postgres_data`
- Redis with persistent volume `redis_data`
- Zookeeper for Kafka coordination
- Kafka with persistent volume `kafka_data`
- Shared Docker bridge network `notiq-network`
- Restart policy `unless-stopped` for all services

## Kafka Topics

The `scripts/create-topics.sh` script creates these Kafka topics:

| Topic | Partitions | Replication Factor |
| --- | --- | --- |
| `notification-request` | 3 | 1 |
| `notification-retry` | 3 | 1 |
| `notification-dlq` | 1 | 1 |

## Useful Commands

Start all services:

```bash
docker compose up -d
```

Stop all services:

```bash
docker compose down
```

Reset all services and remove volumes:

```bash
./scripts/reset.sh
```

Create Kafka topics:

```bash
./scripts/create-topics.sh
```

Validate the Docker Compose file:

```bash
docker compose config
```

## Notes

- If port `2181` is already allocated, Zookeeper cannot start. Change `ZOOKEEPER_PORT` in `.env` or stop the process/container using that port.
- If Docker shows `Access is denied` on Windows, run the terminal with Docker permissions or check Docker Desktop user access.
