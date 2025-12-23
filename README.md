# Food Delivery System - HLD Architecture

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)
- Java 17+ (for local development)

### Run the Entire System
```bash
docker-compose up --build
```

### Access Points
- **Frontend UI**: http://localhost:3001
- **NGINX Load Balancer**: http://localhost:80
- **API Gateway**: http://localhost:3000
- **Order Service**: http://localhost:8001
- **Delivery Service**: http://localhost:8002
- **Internal Comm Service**: http://localhost:9000

## 📁 Project Structure

```
food-delivery-system/
├── frontend-ui/              # React + Tailwind (Apple-style UI)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Screen components
│   │   ├── layouts/          # Layout wrapper
│   │   └── App.jsx           # Main app component
│   ├── tailwind.config.js    # Apple design system
│   └── package.json
│
├── api-gateway/              # Node.js Express
│   ├── server.js             # Route definitions
│   └── package.json
│
├── order-service-python/     # Python FastAPI
│   ├── main.py               # Restaurant & Order logic
│   └── requirements.txt
│
├── delivery-service-java/    # Java Spring Boot
│   ├── src/main/java/        # Delivery & Payment logic
│   └── pom.xml
│
├── internal-comm-service/    # Node.js
│   ├── server.js             # Backend-to-Backend messaging
│   └── package.json
│
├── nginx/                    # NGINX Load Balancer
│   ├── nginx.conf            # Load balancer config
│   └── Dockerfile
│
├── docker-compose.yml        # Orchestration
└── ARCHITECTURE.md           # System design docs
```

## 🎨 Frontend Screens

1. **Dashboard** (`/`)
   - Stats cards (Total Orders, Active Orders, Restaurants)
   - Restaurant grid with images and ratings
   - Click to navigate to restaurant details

2. **Restaurant Detail** (`/restaurant/:id`)
   - Restaurant header with info
   - Menu items grid
   - Add to cart functionality
   - Place order CTA (no actual API call)

3. **Orders** (`/orders`)
   - Active orders section
   - Past orders section
   - Order status badges
   - Click to view delivery status

4. **Delivery Status** (`/delivery/:orderId`)
   - Delivery partner info
   - Step-by-step tracking
   - Estimated delivery time
   - Current status highlight

## 🏗 Backend Services

### API Gateway (Port 3000)
**Routes:**
- `GET /api/restaurants` - List all restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `GET /api/restaurants/:id/menu` - Get restaurant menu
- `POST /api/orders` - Create order
- `GET /api/orders` - List orders
- `GET /api/delivery/:orderId` - Get delivery status
- `POST /api/payments` - Process payment

### Order Service (Port 8001)
**Endpoints:**
- `GET /restaurants` - Restaurant list
- `GET /restaurants/:id` - Restaurant details
- `GET /restaurants/:id/menu` - Menu items
- `POST /orders` - Create order
- `GET /orders` - Order list
- `PUT /orders/:id/status` - Update order status

### Delivery Service (Port 8002)
**Endpoints:**
- `GET /delivery/:orderId` - Delivery status
- `POST /delivery/assign` - Assign delivery partner
- `PUT /delivery/:orderId/status` - Update delivery status
- `POST /payments` - Process payment
- `GET /payments/:orderId` - Payment status

### Internal Comm Service (Port 9000)
**Events:**
- `POST /events/order-created` - Order creation event
- `POST /events/delivery-status-updated` - Delivery status event
- `POST /events/payment-completed` - Payment event
- `GET /events` - Event history
- `GET /health/services` - Service health check

## 🎯 System Flow Example

### Order Creation Flow:
1. User selects items on Restaurant Detail page
2. User clicks "Place Order" → Frontend (Mock - no API call)
3. API Gateway receives POST `/api/orders`
4. API Gateway → Order Service → Creates order
5. Order Service → Internal Comm Service → Publishes "order-created" event
6. Internal Comm Service → Delivery Service → Assigns delivery partner
7. Internal Comm Service → Order Service → Updates order status to "CONFIRMED"

### Delivery Update Flow:
1. Delivery Service updates status → Calls Internal Comm Service
2. Internal Comm Service → Order Service → Updates order status
3. User views Delivery Status page → Shows current step

## 🎨 Design System

### Colors
- Background: `#F5F5F7`
- Card: `#FFFFFF`
- Primary Text: `#1D1D1F`
- Secondary Text: `#6E6E73`
- Accent: `#007AFF`

### Typography
- Font: SF Pro (fallback: Inter, system-ui)
- Title: 22-24px Semibold
- Section: 16-17px Medium
- Body: 14-15px Regular

### Components
- Card radius: 14-16px
- Button radius: 10-12px
- Shadow: Subtle (opacity 4-6%)
- Input height: 44px (iOS standard)

## 🔧 Local Development

### Frontend Only
```bash
cd frontend-ui
npm install
npm run dev
# Access: http://localhost:3001
```

### API Gateway
```bash
cd api-gateway
npm install
npm start
```

### Order Service
```bash
cd order-service-python
pip install -r requirements.txt
python main.py
```

### Delivery Service
```bash
cd delivery-service-java
mvn spring-boot:run
```

## 📝 Notes

- **HLD Only**: No database, authentication, or deep business logic
- **Mock Data**: All data stored in-memory
- **No API Integration**: Frontend uses mock data (API ready but not connected)
- **Production Ready Structure**: Follows industry best practices for scalability
- **Interview Ready**: Clean architecture for system design discussions

## 🎓 Key Learning Points

1. **Microservices**: Multiple services in different languages
2. **API Gateway Pattern**: Single entry point for frontend
3. **Load Balancing**: NGINX distributing traffic
4. **Event-Driven**: Backend-to-backend async communication
5. **Clean UI**: Apple-grade design system with Tailwind
6. **Containerization**: Docker for each service
7. **Service Discovery**: Docker network for inter-service communication

## 🚧 Production Enhancements (Not Implemented)

- Database (PostgreSQL/MongoDB)
- Authentication & Authorization (JWT)
- Message Queue (RabbitMQ/Kafka)
- Caching (Redis)
- Logging & Monitoring (ELK Stack)
- API Rate Limiting
- Service Mesh (Istio)
- CI/CD Pipeline
