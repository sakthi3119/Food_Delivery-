# Railway.app Deployment Guide

## 🚂 Deploy Each Service Separately

Railway requires deploying each microservice as a separate service. Follow these steps:

### **Step 1: Create New Project**
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository

### **Step 2: Deploy API Gateway**
1. Click **"+ New Service"** → **"GitHub Repo"**
2. Select your repo
3. **Root Directory**: `api-gateway`
4. **Environment Variables**:
   - `PORT`: `3000`
   - `ORDER_SERVICE_URL`: (will add after deploying order service)
   - `DELIVERY_SERVICE_URL`: (will add after deploying delivery service)
   - `INTERNAL_COMM_URL`: (will add after deploying internal comm)
   - `NODE_ENV`: `production`
5. Click **"Deploy"**

### **Step 3: Deploy Order Service**
1. Click **"+ New Service"** → **"GitHub Repo"**
2. Select your repo
3. **Root Directory**: `order-service-python`
4. **Environment Variables**:
   - `PORT`: `8001`
5. Click **"Deploy"**
6. Copy the public URL (e.g., `https://order-service.railway.app`)

### **Step 4: Deploy Delivery Service**
1. Click **"+ New Service"** → **"GitHub Repo"**
2. Select your repo
3. **Root Directory**: `delivery-service-java`
4. **Build Command**: `mvn clean package`
5. **Start Command**: `java -jar target/*.jar`
6. **Environment Variables**:
   - `SERVER_PORT`: `8002`
7. Click **"Deploy"**
8. Copy the public URL

### **Step 5: Deploy Internal Comm Service**
1. Click **"+ New Service"** → **"GitHub Repo"**
2. Select your repo
3. **Root Directory**: `internal-comm-service`
4. **Environment Variables**:
   - `PORT`: `9000`
   - `NODE_ENV`: `production`
5. Click **"Deploy"**
6. Copy the public URL

### **Step 6: Deploy Frontend**
1. Click **"+ New Service"** → **"GitHub Repo"**
2. Select your repo
3. **Root Directory**: `frontend-ui`
4. **Dockerfile Path**: `frontend-ui/Dockerfile.prod`
5. **Environment Variables**:
   - `VITE_API_URL`: (API Gateway URL from Step 2)
6. Click **"Deploy"**

### **Step 7: Update Environment Variables**
Go back to **API Gateway** service and update:
- `ORDER_SERVICE_URL`: Order service URL
- `DELIVERY_SERVICE_URL`: Delivery service URL
- `INTERNAL_COMM_URL`: Internal comm service URL

Then redeploy the API Gateway.

---

## 🎯 Quick Alternative: Use Docker on Railway

If the above is too complex, you can use **one service with Docker Compose**:

1. **Enable Railway's Docker support**
2. Deploy with `Dockerfile` at root
3. Use internal networking

---

## 💡 Even Easier: Use Render.com Instead

Railway's free tier is limited. For better free tier, use **Render.com** with the `render.yaml` file already created in your project.

1. Go to [render.com](https://render.com)
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repo
4. Render will auto-deploy all services!

**Render.com is much simpler for multi-service apps!**
