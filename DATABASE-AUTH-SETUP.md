# 🚀 Database & Authentication Setup Guide

## Overview
We've upgraded the Food Delivery System with:
- ✅ PostgreSQL database integration
- ✅ JWT-based authentication
- ✅ User registration and login
- ✅ Protected order endpoints
- ✅ Real data instead of mocks

## 📦 What's Been Added

### New Files:
1. `database.py` - SQLAlchemy database connection
2. `models.py` - Database models (User, Restaurant, MenuItem, Order)
3. `auth.py` - JWT authentication utilities
4. `seed.py` - Database seeding script
5. `main_new.py` - Updated API with database & auth

### Updated Files:
- `requirements.txt` - Added SQLAlchemy, psycopg2, jose, passlib

## 🔧 Setup Steps

### Step 1: Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Database Name: `fooddelivery`
4. Database User: Auto-generated
5. Region: Same as your services
6. Plan: **Free**
7. Click **"Create Database"**
8. Copy the **Internal Database URL**

### Step 2: Update Order Service Environment Variables

In Render dashboard, go to `food-delivery-order` service:

1. Click **"Environment"** tab
2. Add new variable:
   - Key: `DATABASE_URL`
   - Value: `<paste internal database URL>`
3. Add SECRET_KEY:
   - Key: `SECRET_KEY`
   - Value: `your-super-secret-key-change-this`
4. Click **"Save Changes"**

### Step 3: Deploy Updated Code

```bash
# Backup old main.py
mv order-service-python/main.py order-service-python/main_old.py

# Use new version with database
mv order-service-python/main_new.py order-service-python/main.py

# Commit and push
git add .
git commit -m "Add database and authentication support"
git push
```

### Step 4: Seed the Database

After deployment, run the seed script:

**Option A: Via Render Shell**
1. Go to `food-delivery-order` service
2. Click **"Shell"** tab
3. Run: `python seed.py`

**Option B: Via HTTP endpoint** (add to main.py if needed)

### Step 5: Test Authentication

**Register a new user:**
```bash
curl -X POST https://food-delivery-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "full_name": "Test User"
  }'
```

**Login:**
```bash
curl -X POST https://food-delivery-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Create Order (with auth token):**
```bash
curl -X POST https://food-delivery-api.onrender.com/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token-here>" \
  -d '{
    "restaurantId": 1,
    "items": [{"menuItemId": 101, "quantity": 2, "price": 350}],
    "totalAmount": 700,
    "deliveryAddress": "123 Main St"
  }'
```

## 📊 Database Schema

### Users Table
- id (Primary Key)
- email (Unique)
- username (Unique)
- hashed_password
- full_name
- phone
- created_at
- is_active

### Restaurants Table
- id (Primary Key)
- name
- cuisine
- rating
- delivery_time
- image
- is_open
- address
- phone
- created_at

### Menu Items Table
- id (Primary Key)
- restaurant_id (Foreign Key → restaurants)
- name
- description
- price
- category
- image
- is_available
- created_at

### Orders Table
- id (Primary Key)
- user_id (Foreign Key → users)
- restaurant_id (Foreign Key → restaurants)
- items (JSON)
- total_amount
- delivery_address
- status
- payment_status
- created_at
- updated_at

## 🔐 Authentication Flow

1. User registers → Receives JWT token
2. User logs in → Receives JWT token
3. Token included in `Authorization: Bearer <token>` header
4. Protected endpoints verify token
5. Token expires after 7 days

## 🎯 API Changes

### Public Endpoints (No Auth Required):
- GET `/restaurants` - List restaurants
- GET `/restaurants/{id}` - Get restaurant details
- GET `/restaurants/{id}/menu` - Get menu
- POST `/auth/register` - Register user
- POST `/auth/login` - Login user

### Protected Endpoints (Auth Required):
- POST `/orders` - Create order
- GET `/orders` - Get user's orders
- GET `/orders/{id}` - Get order details
- GET `/auth/me` - Get current user info

## 🚨 Important Notes

1. **Database Backups**: Render's free PostgreSQL doesn't include backups. Consider upgrading or using a backup service.

2. **Connection Pooling**: For production, add connection pooling configuration.

3. **Migrations**: For schema changes, consider using Alembic for database migrations.

4. **Security**: 
   - Change SECRET_KEY in production
   - Use HTTPS only
   - Rate limit authentication endpoints

## 🎨 Frontend Updates Needed

You'll need to update the frontend to:
1. Add Login/Register pages
2. Store JWT token (localStorage/sessionStorage)
3. Include token in API requests
4. Handle authentication errors (redirect to login)
5. Protected routes for orders

## 📝 Demo Credentials

After running seed script:
- Email: `demo@fooddelivery.com`
- Password: `demo123`

## 🔄 Next Steps

1. Set up database on Render
2. Deploy updated code
3. Run seed script
4. Update frontend with auth
5. Test complete flow
