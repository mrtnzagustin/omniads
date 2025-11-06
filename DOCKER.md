# Docker Setup Guide for OmniAds

This document provides instructions for running OmniAds using Docker and Docker Compose.

## Prerequisites

- Docker 20.10+ installed
- Docker Compose 2.0+ installed
- At least 4GB of free RAM
- Ports 3000, 5173, 5432, and 6379 available

## Quick Start

### 1. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` and set at minimum:
- `JWT_SECRET` - Use a long random string
- `DB_PASSWORD` - Use a secure password
- `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` - Add your AI provider API key

### 2. Start All Services

Start the entire stack with one command:

```bash
docker compose up -d
```

This will start:
- **PostgreSQL** on port 5432
- **Redis** on port 6379
- **Backend (NestJS)** on port 3000
- **Frontend (React + Nginx)** on port 80

### 3. Check Service Health

Verify all services are running:

```bash
docker compose ps
```

All services should show status as "Up" and "healthy".

### 4. View Logs

View logs from all services:

```bash
docker compose logs -f
```

View logs from a specific service:

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Docker Network                        │
│                      (omniads-network)                       │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │          │  │          │  │          │  │          │  │
│  │ Frontend │──│ Backend  │──│   DB     │  │  Redis   │  │
│  │  :80     │  │  :3000   │  │  :5432   │  │  :6379   │  │
│  │          │  │          │  │          │  │          │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Services

#### 1. Database (PostgreSQL 14)
- Container: `omniads-db`
- Port: 5432
- Volume: `postgres_data` (persistent storage)
- Health check: `pg_isready` every 10s

#### 2. Cache (Redis 7)
- Container: `omniads-redis`
- Port: 6379
- Volume: `redis_data` (persistent storage)
- Health check: `redis-cli ping` every 10s

#### 3. Backend (NestJS)
- Container: `omniads-backend`
- Port: 3000
- Depends on: db, redis
- Health check: HTTP GET `/health` every 30s
- Includes: AI integration (Anthropic/OpenAI), TypeORM, JWT auth

#### 4. Frontend (React + Vite + Nginx)
- Container: `omniads-frontend`
- Port: 80 (HTTP)
- Depends on: backend
- Health check: HTTP GET `/health` every 30s
- Features: SPA routing, API proxy to backend, static asset caching

## Development Workflow

### Building Images

Rebuild images after code changes:

```bash
docker compose build
```

Rebuild a specific service:

```bash
docker compose build backend
docker compose build frontend
```

### Starting Services

Start all services in detached mode:

```bash
docker compose up -d
```

Start specific services:

```bash
docker compose up -d db redis  # Only database and cache
docker compose up -d backend   # Backend (will also start dependencies)
```

Start with logs visible:

```bash
docker compose up
```

### Stopping Services

Stop all services:

```bash
docker compose down
```

Stop and remove volumes (⚠️ destroys data):

```bash
docker compose down -v
```

### Restarting Services

Restart all services:

```bash
docker compose restart
```

Restart a specific service:

```bash
docker compose restart backend
```

## Database Management

### Accessing the Database

Connect to PostgreSQL using psql:

```bash
docker compose exec db psql -U omniads -d omniads
```

### Running Migrations

Run migrations from the backend container:

```bash
docker compose exec backend npm run migration:run
```

Generate a new migration:

```bash
docker compose exec backend npm run migration:generate -- -n MigrationName
```

Revert the last migration:

```bash
docker compose exec backend npm run migration:revert
```

### Database Backup

Create a backup:

```bash
docker compose exec db pg_dump -U omniads omniads > backup_$(date +%Y%m%d_%H%M%S).sql
```

Restore from backup:

```bash
docker compose exec -T db psql -U omniads omniads < backup_20250105_120000.sql
```

## Debugging

### Accessing Container Shell

Backend:
```bash
docker compose exec backend sh
```

Frontend:
```bash
docker compose exec frontend sh
```

Database:
```bash
docker compose exec db sh
```

### Inspecting Logs

Real-time logs with timestamps:

```bash
docker compose logs -f --timestamps
```

Last 100 lines of backend logs:

```bash
docker compose logs --tail=100 backend
```

### Health Check Status

Check health of all services:

```bash
docker compose ps
```

Inspect health check details:

```bash
docker inspect omniads-backend | jq '.[0].State.Health'
```

### Network Debugging

List Docker networks:

```bash
docker network ls
```

Inspect OmniAds network:

```bash
docker network inspect omniads_omniads-network
```

## Testing

### Running Backend Tests

Run all backend tests:

```bash
docker compose exec backend npm test
```

Run tests with coverage:

```bash
docker compose exec backend npm run test:cov
```

Watch mode:

```bash
docker compose exec backend npm run test:watch
```

### Running Frontend Tests

Run all frontend tests:

```bash
docker compose exec frontend npm test
```

Run tests with coverage:

```bash
docker compose exec frontend npm run test:coverage
```

## Production Deployment

### Environment Variables

For production, ensure these are properly configured:

```bash
# Security
JWT_SECRET=<64-character-random-string>
DB_PASSWORD=<strong-password>

# AI Provider
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=<your-key>
AI_MOCK_MODE=false

# Database
DB_HOST=db
DB_PORT=5432
DB_USERNAME=omniads
DB_DATABASE=omniads

# Node Environment
NODE_ENV=production
```

### HTTPS Configuration

For production, add an HTTPS reverse proxy (nginx or traefik) in front of the frontend service.

Example with nginx:

```yaml
# Add to docker-compose.yml
nginx-proxy:
  image: nginx:alpine
  ports:
    - "443:443"
    - "80:80"
  volumes:
    - ./nginx-ssl.conf:/etc/nginx/conf.d/default.conf
    - ./ssl:/etc/ssl
  depends_on:
    - frontend
```

### Resource Limits

Add resource limits for production:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### Health Monitoring

Monitor container health:

```bash
watch docker compose ps
```

Set up alerts for unhealthy containers using Docker health checks with your monitoring system (Prometheus, Datadog, etc.).

## Troubleshooting

### Port Already in Use

If you see "port is already allocated":

```bash
# Find process using the port
lsof -i :3000
lsof -i :5432

# Kill the process or change the port in .env
```

### Database Connection Failed

1. Check database is healthy:
   ```bash
   docker compose ps db
   ```

2. Check database logs:
   ```bash
   docker compose logs db
   ```

3. Verify environment variables:
   ```bash
   docker compose exec backend env | grep DB_
   ```

### Frontend Can't Connect to Backend

1. Check backend health:
   ```bash
   curl http://localhost:3000/health
   ```

2. Check nginx proxy configuration:
   ```bash
   docker compose exec frontend cat /etc/nginx/conf.d/default.conf
   ```

3. Check backend logs for errors:
   ```bash
   docker compose logs backend
   ```

### Out of Disk Space

Clean up unused Docker resources:

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes (⚠️ destroys data)
docker volume prune
```

### Reset Everything

Complete reset (⚠️ destroys all data):

```bash
docker compose down -v
docker system prune -a --volumes
docker compose up -d --build
```

## Performance Tuning

### Backend Performance

- Increase Node.js memory: Add `NODE_OPTIONS=--max-old-space-size=4096` to backend environment
- Enable connection pooling: Configure TypeORM connection pool size
- Optimize AI caching: Increase `AI_CACHE_TTL_SECONDS` for frequently accessed data

### Database Performance

- Increase shared_buffers: Add to db service:
  ```yaml
  command: postgres -c shared_buffers=512MB -c max_connections=200
  ```

- Add indexes: Review slow queries and add appropriate indexes

### Redis Performance

- Increase memory limit: Add to redis service:
  ```yaml
  command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
  ```

## CI/CD Integration

### GitHub Actions

Example workflow:

```yaml
name: Docker Build

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build images
        run: docker compose build
      - name: Run tests
        run: |
          docker compose up -d
          docker compose exec -T backend npm test
          docker compose exec -T frontend npm test
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [OmniAds README](./README.md)
- [Constitution](./specify/memory/constitution.md)

## Support

For issues with Docker setup:
1. Check this documentation
2. Review Docker logs: `docker compose logs`
3. Check Docker status: `docker compose ps`
4. Create an issue in the repository
