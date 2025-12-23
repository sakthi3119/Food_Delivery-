"""
Database seeding script
Populate database with initial restaurant and menu data
"""

from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Restaurant, MenuItem, User
from auth import get_password_hash

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")


def seed_restaurants(db: Session):
    """Seed restaurant data"""
    
    # Check if data already exists
    if db.query(Restaurant).count() > 0:
        print("⚠️  Restaurants already exist, skipping seed")
        return
    
    restaurants_data = [
        {
            "name": "Spice Garden",
            "cuisine": "North Indian",
            "rating": 4.5,
            "delivery_time": "25-35 min",
            "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
            "is_open": True,
            "address": "123 MG Road, Bangalore",
            "phone": "+91 9876543210"
        },
        {
            "name": "Biryani House",
            "cuisine": "Hyderabadi",
            "rating": 4.7,
            "delivery_time": "30-40 min",
            "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
            "is_open": True,
            "address": "456 Park Street, Hyderabad",
            "phone": "+91 9876543211"
        },
        {
            "name": "Dosa Corner",
            "cuisine": "South Indian",
            "rating": 4.3,
            "delivery_time": "20-30 min",
            "image": "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400",
            "is_open": True,
            "address": "789 Temple Road, Chennai",
            "phone": "+91 9876543212"
        },
        {
            "name": "Tandoor Palace",
            "cuisine": "Punjabi",
            "rating": 4.6,
            "delivery_time": "35-45 min",
            "image": "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400",
            "is_open": True,
            "address": "321 Mall Road, Delhi",
            "phone": "+91 9876543213"
        },
        {
            "name": "Mumbai Chaat House",
            "cuisine": "Street Food",
            "rating": 4.4,
            "delivery_time": "30-40 min",
            "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
            "is_open": True,
            "address": "567 Marine Drive, Mumbai",
            "phone": "+91 9876543214"
        },
        {
            "name": "Kerala Kitchen",
            "cuisine": "Kerala Cuisine",
            "rating": 4.8,
            "delivery_time": "25-35 min",
            "image": "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400",
            "is_open": True,
            "address": "890 Beach Road, Kochi",
            "phone": "+91 9876543215"
        }
    ]
    
    for rest_data in restaurants_data:
        restaurant = Restaurant(**rest_data)
        db.add(restaurant)
    
    db.commit()
    print(f"✅ Seeded {len(restaurants_data)} restaurants")


def seed_menu_items(db: Session):
    """Seed menu items for restaurants"""
    
    # Check if data already exists
    if db.query(MenuItem).count() > 0:
        print("⚠️  Menu items already exist, skipping seed")
        return
    
    menus = {
        "Spice Garden": [
            {"name": "Butter Chicken", "description": "Creamy tomato-based curry with tender chicken", "price": 350, "category": "Main Course", "image": "🍛"},
            {"name": "Paneer Tikka Masala", "description": "Grilled cottage cheese in rich gravy", "price": 320, "category": "Main Course", "image": "🧆"},
            {"name": "Garlic Naan", "description": "Soft bread with garlic and butter", "price": 60, "category": "Breads", "image": "🫓"},
            {"name": "Dal Makhani", "description": "Creamy black lentils", "price": 280, "category": "Main Course", "image": "🍲"},
            {"name": "Gulab Jamun", "description": "Sweet dumplings in sugar syrup", "price": 80, "category": "Desserts", "image": "🍡"}
        ],
        "Biryani House": [
            {"name": "Hyderabadi Biryani", "description": "Aromatic rice with spiced meat", "price": 450, "category": "Biryani", "image": "🍛"},
            {"name": "Chicken Dum Biryani", "description": "Slow-cooked chicken biryani", "price": 400, "category": "Biryani", "image": "🍛"},
            {"name": "Raita", "description": "Yogurt with cucumber and spices", "price": 60, "category": "Sides", "image": "🥗"},
            {"name": "Double Ka Meetha", "description": "Traditional Hyderabadi dessert", "price": 120, "category": "Desserts", "image": "🍮"}
        ],
        "Dosa Corner": [
            {"name": "Masala Dosa", "description": "Crispy dosa with potato filling", "price": 120, "category": "Dosa", "image": "🌮"},
            {"name": "Idli Sambar", "description": "Steamed rice cakes with lentil curry", "price": 80, "category": "Breakfast", "image": "🍚"},
            {"name": "Filter Coffee", "description": "South Indian filter coffee", "price": 40, "category": "Beverages", "image": "☕"},
            {"name": "Vada", "description": "Crispy lentil fritters", "price": 60, "category": "Snacks", "image": "🍩"}
        ],
        "Tandoor Palace": [
            {"name": "Tandoori Chicken", "description": "Marinated chicken in clay oven", "price": 400, "category": "Starters", "image": "🍗"},
            {"name": "Paneer Tikka", "description": "Grilled cottage cheese", "price": 280, "category": "Starters", "image": "🧆"},
            {"name": "Tandoori Roti", "description": "Whole wheat bread from tandoor", "price": 30, "category": "Breads", "image": "🫓"},
            {"name": "Dal Tadka", "description": "Yellow lentils with tempering", "price": 200, "category": "Main Course", "image": "🍲"}
        ],
        "Mumbai Chaat House": [
            {"name": "Pani Puri", "description": "Crispy puris with spicy water", "price": 80, "category": "Chaat", "image": "🫓"},
            {"name": "Pav Bhaji", "description": "Spiced vegetable curry with bread", "price": 150, "category": "Street Food", "image": "🍛"},
            {"name": "Vada Pav", "description": "Potato fritter in bread bun", "price": 60, "category": "Street Food", "image": "🍔"},
            {"name": "Bhel Puri", "description": "Puffed rice with chutneys", "price": 70, "category": "Chaat", "image": "🥗"}
        ],
        "Kerala Kitchen": [
            {"name": "Fish Curry", "description": "Traditional Kerala fish curry", "price": 380, "category": "Main Course", "image": "🐟"},
            {"name": "Appam", "description": "Rice pancake with coconut milk", "price": 80, "category": "Breads", "image": "🥞"},
            {"name": "Avial", "description": "Mixed vegetables in coconut gravy", "price": 180, "category": "Main Course", "image": "🥗"},
            {"name": "Payasam", "description": "Sweet rice pudding", "price": 100, "category": "Desserts", "image": "🍮"}
        ]
    }
    
    # Get all restaurants
    restaurants = db.query(Restaurant).all()
    
    for restaurant in restaurants:
        if restaurant.name in menus:
            for item_data in menus[restaurant.name]:
                menu_item = MenuItem(
                    restaurant_id=restaurant.id,
                    **item_data
                )
                db.add(menu_item)
    
    db.commit()
    print("✅ Seeded menu items for all restaurants")


def seed_demo_user(db: Session):
    """Create a demo user for testing"""
    
    # Check if user exists
    if db.query(User).filter(User.email == "demo@fooddelivery.com").first():
        print("⚠️  Demo user already exists, skipping")
        return
    
    demo_user = User(
        email="demo@fooddelivery.com",
        username="demouser",
        hashed_password=get_password_hash("demo123"),
        full_name="Demo User",
        phone="+91 9999999999"
    )
    
    db.add(demo_user)
    db.commit()
    print("✅ Created demo user (email: demo@fooddelivery.com, password: demo123)")


def seed_database():
    """Main seeding function"""
    print("\n🌱 Starting database seeding...")
    print("="*50)
    
    # Create tables
    create_tables()
    
    # Create session
    db = SessionLocal()
    
    try:
        # Seed data
        seed_restaurants(db)
        seed_menu_items(db)
        seed_demo_user(db)
        
        print("="*50)
        print("✅ Database seeding completed successfully!\n")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
