"""
ORDER SERVICE - Food Delivery System (with Database & Auth)
Language: Python (FastAPI)

Purpose: Manages restaurants, menus, orders, and authentication
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session

import os
import httpx

# Import database and models
from database import get_db, engine, Base
from models import User, Restaurant, MenuItem, Order as OrderModel
from auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    verify_token
)

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Order Service", version="2.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Configuration
INTERNAL_COMM_URL = os.getenv("INTERNAL_COMM_URL", "http://localhost:9000")

# ============================================
# PYDANTIC SCHEMAS
# ============================================

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str]
    phone: Optional[str]
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class RestaurantResponse(BaseModel):
    id: int
    name: str
    cuisine: str
    rating: float
    deliveryTime: str
    image: str
    isOpen: bool
    address: Optional[str]
    phone: Optional[str]
    
    class Config:
        from_attributes = True

class MenuItemResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    category: str
    image: str
    
    class Config:
        from_attributes = True

class OrderItemCreate(BaseModel):
    menuItemId: int
    quantity: int
    price: float

class OrderCreate(BaseModel):
    restaurantId: int
    items: List[OrderItemCreate]
    totalAmount: float
    deliveryAddress: str

class OrderResponse(BaseModel):
    id: int
    restaurantId: int
    restaurantName: str
    items: List[dict]
    totalAmount: float
    status: str
    deliveryAddress: str
    createdAt: datetime
    
    class Config:
        from_attributes = True

# ============================================
# AUTHENTICATION DEPENDENCY
# ============================================

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Verify JWT token and return current user"""
    token = credentials.credentials
    payload = verify_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    user_id: int = payload.get("user_id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user

# ============================================
# AUTH ENDPOINTS
# ============================================

@app.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    existing_username = db.query(User).filter(User.username == user_data.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=get_password_hash(user_data.password),
        full_name=user_data.full_name,
        phone=user_data.phone
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token = create_access_token(data={"user_id": new_user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@app.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"user_id": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@app.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current logged-in user info"""
    return current_user

# ============================================
# RESTAURANT ENDPOINTS (Public)
# ============================================

@app.get("/restaurants")
async def get_restaurants(db: Session = Depends(get_db)):
    """Fetch all restaurants"""
    restaurants = db.query(Restaurant).filter(Restaurant.is_open == True).all()
    
    # Convert to response format
    return [{
        "id": r.id,
        "name": r.name,
        "cuisine": r.cuisine,
        "rating": r.rating,
        "deliveryTime": r.delivery_time,
        "image": r.image,
        "isOpen": r.is_open,
        "address": r.address,
        "phone": r.phone
    } for r in restaurants]

@app.get("/restaurants/{restaurant_id}")
async def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    """Fetch restaurant by ID"""
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    return {
        "id": restaurant.id,
        "name": restaurant.name,
        "cuisine": restaurant.cuisine,
        "rating": restaurant.rating,
        "deliveryTime": restaurant.delivery_time,
        "image": restaurant.image,
        "isOpen": restaurant.is_open,
        "address": restaurant.address,
        "phone": restaurant.phone
    }

@app.get("/restaurants/{restaurant_id}/menu")
async def get_restaurant_menu(restaurant_id: int, db: Session = Depends(get_db)):
    """Fetch restaurant menu"""
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    menu_items = db.query(MenuItem).filter(
        MenuItem.restaurant_id == restaurant_id,
        MenuItem.is_available == True
    ).all()
    
    return [{ 
        "id": item.id,
        "name": item.name,
        "description": item.description,
        "price": item.price,
        "category": item.category,
        "image": item.image
    } for item in menu_items]

# ============================================
# ORDER ENDPOINTS (Protected)
# ============================================

@app.post("/orders", response_model=OrderResponse)
async def create_order(
    order: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new order (requires authentication)"""
    
    # Get restaurant
    restaurant = db.query(Restaurant).filter(Restaurant.id == order.restaurantId).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    # Create order
    new_order = OrderModel(
        user_id=current_user.id,
        restaurant_id=order.restaurantId,
        items=[item.dict() for item in order.items],
        total_amount=order.totalAmount,
        delivery_address=order.deliveryAddress,
        status="PENDING"
    )
    
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    # Notify internal comm service (async)
    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{INTERNAL_COMM_URL}/notify",
                json={
                    "type": "NEW_ORDER",
                    "orderId": new_order.id,
                    "restaurantId": restaurant.id
                },
                timeout=5.0
            )
    except Exception as e:
        print(f"Failed to notify internal comm: {e}")
    
    return {
        "id": new_order.id,
        "restaurantId": new_order.restaurant_id,
        "restaurantName": restaurant.name,
        "items": new_order.items,
        "totalAmount": new_order.total_amount,
        "status": new_order.status,
        "deliveryAddress": new_order.delivery_address,
        "createdAt": new_order.created_at
    }

@app.get("/orders", response_model=List[OrderResponse])
async def get_user_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all orders for current user"""
    
    orders = db.query(OrderModel).filter(
        OrderModel.user_id == current_user.id
    ).order_by(OrderModel.created_at.desc()).all()
    
    result = []
    for order in orders:
        restaurant = db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
        result.append({
            "id": order.id,
            "restaurantId": order.restaurant_id,
            "restaurantName": restaurant.name if restaurant else "Unknown",
            "items": order.items,
            "totalAmount": order.total_amount,
            "status": order.status,
            "deliveryAddress": order.delivery_address,
            "createdAt": order.created_at
        })
    
    return result

@app.get("/orders/{order_id}")
async def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific order"""
    
    order = db.query(OrderModel).filter(
        OrderModel.id == order_id,
        OrderModel.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    restaurant = db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
    
    return {
        "id": order.id,
        "restaurantId": order.restaurant_id,
        "restaurantName": restaurant.name if restaurant else "Unknown",
        "items": order.items,
        "totalAmount": order.total_amount,
        "status": order.status,
        "deliveryAddress": order.delivery_address,
        "createdAt": order.created_at,
        "paymentStatus": order.payment_status
    }

# ============================================
# DATABASE SEEDING ENDPOINT
# ============================================

@app.post("/seed-database")
async def seed_database_endpoint(db: Session = Depends(get_db)):
    """Seed database with initial data (one-time setup)"""
    
    try:
        # Check if already seeded
        if db.query(Restaurant).count() > 0:
            return {"message": "Database already seeded", "status": "skipped"}
        
        # Import seed functions
        from seed import seed_restaurants, seed_menu_items, seed_demo_user
        
        # Run seeding
        seed_restaurants(db)
        seed_menu_items(db)
        seed_demo_user(db)
        
        return {
            "message": "Database seeded successfully",
            "status": "success",
            "restaurants": db.query(Restaurant).count(),
            "menu_items": db.query(MenuItem).count(),
            "users": db.query(User).count()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Seeding failed: {str(e)}")

# ============================================
# HEALTH CHECK
# ============================================

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "order-service", "version": "2.0.0"}

# ============================================
# STARTUP EVENT
# ============================================

@app.on_event("startup")
async def startup_event():
    print("🚀 Order Service started with database support")
    print("📊 Database tables ready")
    print("🔐 Authentication enabled")
