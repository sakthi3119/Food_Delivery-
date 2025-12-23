import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Card, Button, SectionHeader } from '../components/UIComponents'

// Mock data
const MOCK_RESTAURANT = {
    1: {
        id: 1,
        name: 'Spice Garden',
        cuisine: 'North Indian',
        rating: 4.5,
        deliveryTime: '25-35 min',
        address: 'MG Road, Bangalore',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=400&fit=crop'
    }
}

const MOCK_MENU = {
    1: [
        {
            id: 101,
            name: 'Butter Chicken',
            description: 'Creamy tomato-based curry with tender chicken pieces',
            price: 350,
            category: 'Main Course',
            image: '🍛'
        },
        {
            id: 102,
            name: 'Paneer Tikka Masala',
            description: 'Grilled cottage cheese in rich and spicy gravy',
            price: 320,
            category: 'Main Course',
            image: '🧆'
        },
        {
            id: 103,
            name: 'Garlic Naan',
            description: 'Soft leavened bread with fresh garlic and butter',
            price: 60,
            category: 'Breads',
            image: '🫓'
        },
        {
            id: 104,
            name: 'Gulab Jamun',
            description: 'Sweet milk solid dumplings soaked in sugar syrup',
            price: 80,
            category: 'Desserts',
            image: '🍡'
        },
        {
            id: 105,
            name: 'Dal Makhani',
            description: 'Creamy black lentils cooked with butter and cream',
            price: 280,
            category: 'Main Course',
            image: '🍲'
        },
        {
            id: 106,
            name: 'Tandoori Chicken',
            description: 'Marinated chicken cooked in traditional clay oven',
            price: 400,
            category: 'Starters',
            image: '🍗'
        }
    ]
}

export default function RestaurantDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [cart, setCart] = useState([])

    const restaurant = MOCK_RESTAURANT[id] || MOCK_RESTAURANT[1]
    const menu = MOCK_MENU[id] || MOCK_MENU[1]

    const addToCart = (item) => {
        setCart([...cart, item])
    }

    const getTotalAmount = () => {
        return cart.reduce((sum, item) => sum + item.price, 0)
    }

    const handlePlaceOrder = () => {
        if (cart.length === 0) {
            alert('Please add items to cart')
            return
        }
        // HLD: No actual API call
        alert(`Order placed successfully! Total: ₹${getTotalAmount()}`)
        navigate('/orders')
    }

    return (
        <div className="space-y-8">
            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-apple-text-secondary hover:text-apple-text transition-colors"
            >
                <span>←</span>
                <span className="text-sm font-medium">Back to restaurants</span>
            </button>

            {/* Restaurant Header */}
            <Card>
                <div className="aspect-[2/1] bg-gray-100 rounded-lg mb-6 overflow-hidden">
                    <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect fill="%23f0f0f0" width="800" height="400"/%3E%3C/svg%3E'
                        }}
                    />
                </div>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-apple-text">{restaurant.name}</h1>
                        <p className="text-apple-text-secondary mt-2">{restaurant.cuisine}</p>
                        <p className="text-sm text-apple-text-secondary mt-1">{restaurant.address}</p>
                    </div>

                    <div className="text-right">
                        <div className="flex items-center space-x-1">
                            <span className="text-yellow-500 text-xl">⭐</span>
                            <span className="font-semibold text-apple-text">{restaurant.rating}</span>
                        </div>
                        <p className="text-sm text-apple-text-secondary mt-1">{restaurant.deliveryTime}</p>
                    </div>
                </div>
            </Card>

            {/* Menu Section */}
            <div>
                <SectionHeader
                    title="Menu"
                    subtitle="Choose your favorite items"
                    action={
                        cart.length > 0 && (
                            <div className="text-right">
                                <p className="text-sm text-apple-text-secondary">Cart: {cart.length} items</p>
                                <p className="font-semibold text-apple-text">₹{getTotalAmount()}</p>
                            </div>
                        )
                    }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menu.map(item => (
                        <MenuItemCard key={item.id} item={item} onAdd={addToCart} />
                    ))}
                </div>
            </div>

            {/* Order CTA */}
            {cart.length > 0 && (
                <div className="sticky bottom-0 bg-white border-t border-apple-border p-4 -mx-4 shadow-apple-lg">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div>
                            <p className="text-sm text-apple-text-secondary">{cart.length} items</p>
                            <p className="text-xl font-semibold text-apple-text">₹{getTotalAmount()}</p>
                        </div>
                        <Button onClick={handlePlaceOrder}>
                            Place Order
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

function MenuItemCard({ item, onAdd }) {
    const [added, setAdded] = useState(false)

    const handleAdd = () => {
        onAdd(item)
        setAdded(true)
        setTimeout(() => setAdded(false), 1000)
    }

    return (
        <Card>
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-apple-text">{item.name}</h3>
                    <p className="text-xs text-apple-text-secondary mt-1 line-clamp-2">{item.description}</p>
                </div>
                <div className="text-3xl ml-3">{item.image}</div>
            </div>

            <div className="flex items-center justify-between mt-4">
                <span className="font-semibold text-apple-text">₹{item.price}</span>
                <button
                    onClick={handleAdd}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${added
                        ? 'bg-green-500 text-white'
                        : 'bg-apple-accent text-white hover:bg-blue-600 active:scale-95'
                        }`}
                >
                    {added ? '✓ Added' : '+ Add'}
                </button>
            </div>
        </Card>
    )
}
