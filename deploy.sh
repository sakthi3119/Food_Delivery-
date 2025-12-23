#!/bin/bash

echo "🚀 Food Delivery System - Production Deployment"
echo "================================================"
echo ""

# Check if docker is installed
if ! command -v docker &> /dev/null
then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Build images
echo "📦 Building Docker images..."
docker-compose -f docker-compose.prod.yml build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""

# Stop old containers
echo "🛑 Stopping old containers..."
docker-compose -f docker-compose.prod.yml down

echo ""

# Start new containers
echo "🔄 Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "================================================"
echo "🌐 Access Points:"
echo "================================================"
echo "Frontend:       http://localhost:80"
echo "API Gateway:    http://localhost:8080"
echo "Order Service:  http://localhost:8001"
echo "Delivery:       http://localhost:8002"
echo "Internal Comm:  http://localhost:9000"
echo ""
echo "📊 Container Status:"
echo "================================================"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "📝 View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "🛑 Stop all:  docker-compose -f docker-compose.prod.yml down"
