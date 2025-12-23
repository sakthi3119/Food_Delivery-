"""
ORDER SERVICE - Food Delivery System
Language: Python (FastAPI)

Purpose: Manages restaurants, menus, and orders
Responsibilities:
- Restaurant CRUD operations
- Menu management
- Order creation and tracking
- Restaurant availability

Architecture Flow:
API Gateway → Order Service ← Internal Comm Service
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os
import httpx

app = FastAPI(title="Order Service", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
INTERNAL_COMM_URL = os.getenv("INTERNAL_COMM_URL", "http://localhost:9000")

# ============================================
# DATA MODELS (Pydantic)
# ============================================

class Restaurant(BaseModel):
    id: int
    name: str
    cuisine: str
    rating: float
    deliveryTime: str
    image: str
    isOpen: bool

class MenuItem(BaseModel):
    id: int
    name: str
    description: str
    price: float
    category: str
    image: str

class OrderItem(BaseModel):
    menuItemId: int
    quantity: int
    price: float

class Order(BaseModel):
    restaurantId: int
    items: List[OrderItem]
    totalAmount: float
    deliveryAddress: str

class OrderResponse(BaseModel):
    id: int
    restaurantId: int
    restaurantName: str
    items: List[OrderItem]
    totalAmount: float
    status: str
    createdAt: str

# ============================================
# IN-MEMORY DATA STORE (HLD - No Database)
# ============================================

# Mock Restaurants Data
restaurants_db = [
    {
        "id": 1,
        "name": "Spice Garden",
        "cuisine": "North Indian",
        "rating": 4.5,
        "deliveryTime": "25-35 min",
        "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
        "isOpen": True
    },
    {
        "id": 2,
        "name": "Biryani House",
        "cuisine": "Hyderabadi",
        "rating": 4.7,
        "deliveryTime": "30-40 min",
        "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
        "isOpen": True
    },
    {
        "id": 3,
        "name": "Dosa Corner",
        "cuisine": "South Indian",
        "rating": 4.3,
        "deliveryTime": "20-30 min",
        "image": "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400",
        "isOpen": True
    },
    {
        "id": 4,
        "name": "Tandoor Palace",
        "cuisine": "Punjabi",
        "rating": 4.6,
        "deliveryTime": "35-45 min",
        "image": "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400",
        "isOpen": True
    },
    {
        "id": 5,
        "name": "Mumbai Chaat House",
        "cuisine": "Street Food",
        "rating": 4.4,
        "deliveryTime": "30-40 min",
        "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
        "isOpen": True
    },
    {
        "id": 6,
        "name": "Kerala Kitchen",
        "cuisine": "Kerala Cuisine",
        "rating": 4.8,
        "deliveryTime": "25-35 min",
        "image": "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400",
        "isOpen": True
    }
]

# Mock Menu Data
menu_db = {
    1: [  # Spice Garden (North Indian)
        {"id": 101, "name": "Butter Chicken", "description": "Creamy tomato-based curry with tender chicken", "price": 350, "category": "Main Course", "image": "🍛"},
        {"id": 102, "name": "Paneer Tikka Masala", "description": "Grilled cottage cheese in rich gravy", "price": 320, "category": "Main Course", "image": "🧆"},
        {"id": 103, "name": "Garlic Naan", "description": "Soft bread with garlic and butter", "price": 60, "category": "Breads", "image": "🫓"},
        {"id": 104, "name": "Dal Makhani", "description": "Creamy black lentils", "price": 280, "category": "Main Course", "image": "🍲"},
        {"id": 105, "name": "Gulab Jamun", "description": "Sweet dumplings in sugar syrup", "price": 80, "category": "Desserts", "image": "🍡"}
    ],
    2: [  # Biryani House (Hyderabadi)
        {"id": 201, "name": "Hyderabadi Biryani", "description": "Aromatic rice with spiced meat", "price": 450, "category": "Biryani", "image": "🍛"},
        {"id": 202, "name": "Chicken Dum Biryani", "description": "Slow-cooked chicken biryani", "price": 400, "category": "Biryani", "image": "🍛"},
        {"id": 203, "name": "Raita", "description": "Yogurt with cucumber and spices", "price": 60, "category": "Sides", "image": "🥗"},
        {"id": 204, "name": "Double Ka Meetha", "description": "Traditional Hyderabadi dessert", "price": 120, "category": "Desserts", "image": "🍮"}
    ],
    3: [  # Dosa Corner (South Indian)
        {"id": 301, "name": "Masala Dosa", "description": "Crispy dosa with potato filling", "price": 120, "category": "Dosa", "image": "🌮"},
        {"id": 302, "name": "Idli Sambar", "description": "Steamed rice cakes with lentil curry", "price": 80, "category": "Breakfast", "image": "🍚"},
        {"id": 303, "name": "Filter Coffee", "description": "South Indian filter coffee", "price": 40, "category": "Beverages", "image": "☕"},
        {"id": 304, "name": "Vada", "description": "Crispy lentil fritters", "price": 60, "category": "Snacks", "image": "🍩"}
    ],
    4: [  # Tandoor Palace (Punjabi)
        {"id": 401, "name": "Tandoori Chicken", "description": "Marinated chicken in clay oven", "price": 400, "category": "Starters", "image": "🍗"},
        {"id": 402, "name": "Paneer Tikka", "description": "Grilled cottage cheese", "price": 280, "category": "Starters", "image": "🧆"},
        {"id": 403, "name": "Tandoori Roti", "description": "Whole wheat bread from tandoor", "price": 30, "category": "Breads", "image": "🫓"},
        {"id": 404, "name": "Dal Tadka", "description": "Yellow lentils with tempering", "price": 200, "category": "Main Course", "image": "🍲"}
    ],
    5: [  # Mumbai Chaat House (Street Food)
        {"id": 501, "name": "Pani Puri", "description": "Crispy puris with spicy water", "price": 80, "category": "Chaat", "image": "🫓"},
        {"id": 502, "name": "Pav Bhaji", "description": "Spiced vegetable curry with bread", "price": 150, "category": "Street Food", "image": "🍛"},
        {"id": 503, "name": "Vada Pav", "description": "Potato fritter in bread bun", "price": 60, "category": "Street Food", "image": "🍔"},
        {"id": 504, "name": "Bhel Puri", "description": "Puffed rice with chutneys", "price": 70, "category": "Chaat", "image": "🥗"}
    ],
    6: [  # Kerala Kitchen
        {"id": 601, "name": "Fish Curry", "description": "Traditional Kerala fish curry", "price": 380, "category": "Main Course", "image": "🐟"},
        {"id": 602, "name": "Appam", "description": "Rice pancake with coconut milk", "price": 80, "category": "Breads", "image": "🥞"},
        {"id": 603, "name": "Avial", "description": "Mixed vegetables in coconut gravy", "price": 180, "category": "Main Course", "image": "🥗"},
        {"id": 604, "name": "Payasam", "description": "Sweet rice pudding", "price": 100, "category": "Desserts", "image": "🍮"}
    ]
}

# Mock Orders Data
orders_db = []
order_counter = 1

# ============================================
# RESTAURANT ENDPOINTS
# ============================================

@app.get("/restaurants", response_model=List[Restaurant])
async def get_restaurants():
    """
    HLD: Fetch all restaurants
    Production: Query from database with filters (cuisine, location, rating)
    """
    return restaurants_db

@app.get("/restaurants/{restaurant_id}")
async def get_restaurant(restaurant_id: int):
    """
    HLD: Fetch restaurant by ID
    Production: Database query with caching
    """
    restaurant = next((r for r in restaurants_db if r["id"] == restaurant_id), None)
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return restaurant

@app.get("/restaurants/{restaurant_id}/menu", response_model=List[MenuItem])
async def get_restaurant_menu(restaurant_id: int):
    """
    HLD: Fetch restaurant menu
    Production: Join query with inventory availability
    """
    if restaurant_id not in menu_db:
        raise HTTPException(status_code=404, detail="Menu not found")
    return menu_db[restaurant_id]

# ============================================
# ORDER ENDPOINTS
# ============================================

@app.post("/orders", response_model=OrderResponse)
async def create_order(order: Order):
    """
    HLD: Create new order
    Production Flow:
    1. Validate restaurant and menu items
    2. Check inventory availability
    3. Calculate total with taxes and fees
    4. Save to database
    5. Notify Internal Comm Service
    6. Trigger payment processing
    """
    global order_counter
    
    # Get restaurant name
    restaurant = next((r for r in restaurants_db if r["id"] == order.restaurantId), None)
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    # Create order object
    new_order = {
        "id": order_counter,
        "restaurantId": order.restaurantId,
        "restaurantName": restaurant["name"],
        "items": [item.dict() for item in order.items],
        "totalAmount": order.totalAmount,
        "deliveryAddress": order.deliveryAddress,
        "status": "PENDING",
        "createdAt": datetime.now().isoformat()
    }
    
    orders_db.append(new_order)
    order_counter += 1
    
    # Notify Internal Comm Service (async - fire and forget)
    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{INTERNAL_COMM_URL}/events/order-created",
                json={"orderId": new_order["id"], "restaurantId": order.restaurantId},
                timeout=2.0
            )
    except Exception as e:
        print(f"Failed to notify internal comm: {e}")
    
    return new_order

@app.get("/orders", response_model=List[OrderResponse])
async def get_orders(userId: Optional[int] = None):
    """
    HLD: Fetch all orders (optionally filtered by userId)
    Production: Database query with pagination and user authentication
    """
    # In production, filter by authenticated user
    return orders_db

@app.get("/orders/{order_id}")
async def get_order(order_id: int):
    """
    HLD: Fetch order details by ID
    Production: Database query with authorization check
    """
    order = next((o for o in orders_db if o["id"] == order_id), None)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# ============================================
# INTERNAL COMMUNICATION ENDPOINTS
# ============================================

@app.put("/orders/{order_id}/status")
async def update_order_status(order_id: int, status: str):
    """
    HLD: Update order status (called by Internal Comm Service)
    Production: Database update with state machine validation
    """
    order = next((o for o in orders_db if o["id"] == order_id), None)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order["status"] = status
    return {"message": "Order status updated", "orderId": order_id, "status": status}

# ============================================
# HEALTH CHECK
# ============================================

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "order-service"}

@app.get("/")
async def root():
    return {
        "message": "Order Service - Food Delivery System",
        "version": "1.0.0",
        "endpoints": {
            "restaurants": "/restaurants",
            "menu": "/restaurants/{id}/menu",
            "orders": "/orders"
        }
    }

# ============================================
# SERVER STARTUP
# ============================================

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
