#!/bin/bash
set -e

IMAGE="$1"
DATABASE_URL="$2"
EMAIL_USER="$3"
EMAIL_PASS="$4"
GOOGLE_CLIENT_ID="$5"
GOOGLE_CLIENT_SECRET="$6"
NEXTAUTH_URL="$7"
NEXTAUTH_SECRET="$8"

echo "Pulling latest image: $IMAGE"
docker pull "$IMAGE"

echo "Stopping existing container..."
docker stop dreamhome || true
docker rm dreamhome || true

echo "Starting new container..."
docker run -d \
  --name dreamhome \
  --restart=always \
  -p 80:3000 \
  -e NODE_ENV=production \
  -e NEXT_TELEMETRY_DISABLED=1 \
  -e DATABASE_URL="$DATABASE_URL" \
  -e EMAIL_USER="$EMAIL_USER" \
  -e EMAIL_PASS="$EMAIL_PASS" \
  -e GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID" \
  -e GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET" \
  -e NEXTAUTH_URL="$NEXTAUTH_URL" \
  -e NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
  "$IMAGE"

echo "Deployment complete!"
echo "Container status:"
docker ps | grep dreamhome || echo "Container check failed"

echo "Container logs (last 10 lines):"
docker logs --tail 10 dreamhome || echo "Log check failed"