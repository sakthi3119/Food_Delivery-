# Food Delivery System - Architecture Overview

## 🏗 System Architecture Flow

```
┌─────────────┐
│   Frontend  │ (React + Tailwind - Apple UI)
└──────┬──────┘
       │ HTTP/REST
       ▼
┌─────────────────┐
│  NGINX LB       │ (Load Balancer)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Gateway    │ (Node.js/Express - Port 3000)
└────────┬────────┘
         │
         ├─────────────────────┬─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Order Service   │  │ Delivery Service │  │  Internal Comm   │
│  (Python/FastAPI)│  │ (Java/SpringBoot)│  │  Service (Node)  │
│  Port 8001       │  │  Port 8002       │  │  Port 9000       │
└──────────────────┘  └──────────────────┘  └──────────────────┘
         │                     │                     │
         └─────────────────────┴─────────────────────┘
                    Backend-to-Backend Communication
```

## 📊 Data Flow Explanation

### User Request Flow
1. **User** → Interacts with React frontend (macOS/iOS inspired UI)
2. **Frontend** → Sends REST API requests to NGINX
3. **NGINX** → Distributes load across API Gateway instances
4. **API Gateway** → Routes requests to appropriate backend services:
   - `/api/restaurants/*` → Order Service (Python)
   - `/api/orders/*` → Order Service (Python)
   - `/api/delivery/*` → Delivery Service (Java)
   - `/api/payments/*` → Delivery Service (Java)

### Backend-to-Backend Communication
5. **Internal Comm Service** → Facilitates inter-service communication:
   - Order Service → Delivery Service (when order placed)
   - Delivery Service → Order Service (status updates)
   - Any service can publish/consume events via Internal Comm Service

## 🎯 Service Responsibilities

### API Gateway (Node.js/Express)
- **Port**: 3000
- **Role**: Single entry point for frontend
- **Responsibilities**:
  - Request routing to backend services
  - Request/response transformation
  - Basic validation
  - CORS handling
  
### Order Service (Python/FastAPI)
- **Port**: 8001
- **Role**: Restaurant & Order Management
- **Responsibilities**:
  - Restaurant CRUD operations
  - Menu management
  - Order creation & tracking
  - Restaurant availability

### Delivery Service (Java/Spring Boot)
- **Port**: 8002
- **Role**: Delivery & Payment Processing
- **Responsibilities**:
  - Delivery partner assignment
  - Delivery tracking
  - Payment processing
  - Transaction management

### Internal Communication Service (Node.js)
- **Port**: 9000
- **Role**: Backend-to-Backend messaging
- **Responsibilities**:
  - Event publishing/subscribing
  - Service-to-service data sync
  - Async task coordination
  - Service health monitoring

### NGINX Load Balancer
- **Port**: 80
- **Role**: Traffic distribution
- **Responsibilities**:
  - Load balancing across API Gateway instances
  - SSL termination (production)
  - Request routing
  - Rate limiting

## 🎨 Frontend Architecture

### Tech Stack
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Design**: macOS + iOS inspired
- **State**: React Hooks (no Redux - keeping it simple)

### Screens
1. **Dashboard** - Restaurant list with stats
2. **Restaurant Detail** - Menu items and ordering
3. **Orders** - Order history and tracking
4. **Delivery Status** - Real-time delivery tracking

### Design System
- **Colors**: Apple-grade minimal palette (#007AFF accent)
- **Typography**: SF Pro inspired (Inter fallback)
- **Components**: Clean cards, smooth transitions
- **Layout**: Responsive mobile-first

## 🔒 Security Notes (HLD Only)
- Authentication: Placeholder (JWT tokens in production)
- Authorization: Role-based (not implemented)
- Data validation: Basic input validation
- Rate limiting: NGINX level

## 📦 Deployment Strategy
- **Containerization**: Docker + Docker Compose
- **Scalability**: Horizontal scaling via NGINX
- **Monitoring**: Health check endpoints (not implemented)
- **Logging**: Console logs (structured logging in production)

## 🚀 Running the System
```bash
docker-compose up --build
```

Access points:
- Frontend: http://localhost:3001
- NGINX: http://localhost:80
- API Gateway: http://localhost:3000
- Order Service: http://localhost:8001
- Delivery Service: http://localhost:8002
- Internal Comm: http://localhost:9000
