#!/bin/bash
# Docker cleanup script for EC2 instance
# Run this script to free up disk space before building Docker images

echo "=== Docker Cleanup Script ==="
echo "Current disk usage:"
df -h

echo ""
echo "Cleaning up Docker system..."
echo ""

# Remove all stopped containers
echo "1. Removing stopped containers..."
docker container prune -f

# Remove all unused images (not just dangling)
echo "2. Removing unused images..."
docker image prune -a -f

# Remove all unused volumes
echo "3. Removing unused volumes..."
docker volume prune -f

# Remove all unused networks
echo "4. Removing unused networks..."
docker network prune -f

# Remove build cache
echo "5. Removing build cache..."
docker builder prune -a -f

# Show disk usage after cleanup
echo ""
echo "Disk usage after cleanup:"
df -h

echo ""
echo "Docker disk usage:"
docker system df

echo ""
echo "Cleanup complete!"
