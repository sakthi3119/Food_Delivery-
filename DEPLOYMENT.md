# DEPLOYMENT GUIDE - Food Delivery System

## 📦 Docker Deployment Options

### Option 1: Local Production Build

Build and run production images locally:

```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Run in production mode
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

Access: http://localhost:80

---

## 🌐 Option 2: Deploy to Docker Hub

### Step 1: Tag and Push Images

```bash
# Login to Docker Hub
docker login

# Build and tag images
docker build -t yourusername/food-delivery-frontend:latest ./frontend-ui -f ./frontend-ui/Dockerfile.prod
docker build -t yourusername/food-delivery-api-gateway:latest ./api-gateway
docker build -t yourusername/food-delivery-order-service:latest ./order-service-python
docker build -t yourusername/food-delivery-delivery-service:latest ./delivery-service-java
docker build -t yourusername/food-delivery-internal-comm:latest ./internal-comm-service
docker build -t yourusername/food-delivery-nginx:latest ./nginx

# Push to Docker Hub
docker push yourusername/food-delivery-frontend:latest
docker push yourusername/food-delivery-api-gateway:latest
docker push yourusername/food-delivery-order-service:latest
docker push yourusername/food-delivery-delivery-service:latest
docker push yourusername/food-delivery-internal-comm:latest
docker push yourusername/food-delivery-nginx:latest
```

### Step 2: Pull on Server

On your production server:

```bash
# Pull images
docker pull yourusername/food-delivery-frontend:latest
docker pull yourusername/food-delivery-api-gateway:latest
docker pull yourusername/food-delivery-order-service:latest
docker pull yourusername/food-delivery-delivery-service:latest
docker pull yourusername/food-delivery-internal-comm:latest
docker pull yourusername/food-delivery-nginx:latest

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

---

## ☁️ Option 3: Deploy to Cloud Platforms

### A) AWS EC2 Deployment

**Step 1: Launch EC2 Instance**
- AMI: Ubuntu 22.04 LTS
- Instance Type: t3.medium (2 vCPU, 4 GB RAM)
- Security Group: Open ports 80, 443, 22

**Step 2: Install Docker on EC2**

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Docker
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Logout and login again
exit
ssh -i your-key.pem ubuntu@your-ec2-ip
```

**Step 3: Deploy Application**

```bash
# Clone your repository
git clone https://github.com/yourusername/food-delivery-system.git
cd food-delivery-system

# Run production build
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker ps
```

Access: http://your-ec2-public-ip

---

### B) AWS ECS (Elastic Container Service)

**Step 1: Create ECR Repositories**

```bash
# Install AWS CLI
aws configure

# Create repositories
aws ecr create-repository --repository-name food-delivery-frontend
aws ecr create-repository --repository-name food-delivery-api-gateway
aws ecr create-repository --repository-name food-delivery-order-service
aws ecr create-repository --repository-name food-delivery-delivery-service
aws ecr create-repository --repository-name food-delivery-internal-comm
aws ecr create-repository --repository-name food-delivery-nginx
```

**Step 2: Push Images to ECR**

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag food-delivery-frontend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/food-delivery-frontend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/food-delivery-frontend:latest
# Repeat for all services
```

**Step 3: Create ECS Cluster**
- Use AWS Console or CLI to create ECS cluster
- Create task definitions for each service
- Create services with load balancer

---

### C) Azure Container Instances

```bash
# Login to Azure
az login

# Create resource group
az group create --name food-delivery-rg --location eastus

# Create container registry
az acr create --resource-group food-delivery-rg --name fooddeliveryacr --sku Basic

# Login to ACR
az acr login --name fooddeliveryacr

# Tag and push images
docker tag food-delivery-frontend:latest fooddeliveryacr.azurecr.io/frontend:latest
docker push fooddeliveryacr.azurecr.io/frontend:latest
# Repeat for all services

# Deploy using Azure Container Instances or AKS
az container create --resource-group food-delivery-rg \
  --name food-delivery-app \
  --image fooddeliveryacr.azurecr.io/frontend:latest \
  --dns-name-label food-delivery-app \
  --ports 80
```

---

### D) Google Cloud Run

```bash
# Install gcloud CLI
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/food-delivery-frontend ./frontend-ui

# Deploy to Cloud Run
gcloud run deploy food-delivery-frontend \
  --image gcr.io/YOUR_PROJECT_ID/food-delivery-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Repeat for all services
```

---

## 🚀 Option 4: Deploy to DigitalOcean

**Step 1: Create Droplet**
- Ubuntu 22.04
- Basic Plan ($12/mo - 2GB RAM)

**Step 2: Install Docker**

```bash
# SSH into droplet
ssh root@your-droplet-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y
```

**Step 3: Deploy**

```bash
# Clone repo
git clone https://github.com/yourusername/food-delivery-system.git
cd food-delivery-system

# Run
docker-compose -f docker-compose.prod.yml up -d
```

Access: http://your-droplet-ip

---

## 🔧 Option 5: Deploy to Railway / Render

### Railway.app

1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically on git push
4. Railway handles Docker builds

### Render.com

1. Create Web Service
2. Point to Dockerfile
3. Set environment variables
4. Deploy

---

## 🎯 Quick Deploy Script

Create `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Building Docker images..."
docker-compose -f docker-compose.prod.yml build

echo "📦 Stopping old containers..."
docker-compose -f docker-compose.prod.yml down

echo "🔄 Starting new containers..."
docker-compose -f docker-compose.prod.yml up -d

echo "✅ Deployment complete!"
echo "🌐 Frontend: http://localhost:80"
echo "📊 Backend: http://localhost:8080"

docker-compose -f docker-compose.prod.yml ps
```

Make executable and run:

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📊 Monitoring Deployed Services

```bash
# View all running containers
docker ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# View logs for specific service
docker logs food-delivery-frontend-prod -f

# Check resource usage
docker stats

# Restart specific service
docker-compose -f docker-compose.prod.yml restart api-gateway

# Update and redeploy
git pull
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 🔒 Production Checklist

- [ ] Update API URLs in frontend environment
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Add SSL/TLS certificates (Let's Encrypt)
- [ ] Set up domain name
- [ ] Configure firewall rules
- [ ] Enable container auto-restart
- [ ] Set up logging (ELK/CloudWatch)
- [ ] Configure monitoring (Prometheus/Grafana)
- [ ] Set up backups
- [ ] Add health check endpoints
- [ ] Configure rate limiting
- [ ] Set up CI/CD pipeline

---

## 🌟 Recommended: One-Click Deploy

**Best for Beginners:**

1. **DigitalOcean App Platform** - Click "Deploy to DO"
2. **Railway** - Push to GitHub, auto-deploys
3. **Render** - Free tier available, easy setup
4. **Heroku** - Simple deployment (though not Docker-native)

**Best for Production:**

1. **AWS ECS/Fargate** - Scalable, managed
2. **Google Cloud Run** - Serverless containers
3. **Azure Container Apps** - Fully managed
4. **AWS EC2** - Full control

Choose based on your budget and scaling needs!
