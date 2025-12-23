import { useNavigate } from 'react-router-dom'
import { Card, StatCard, SectionHeader } from '../components/UIComponents'

// Mock data (HLD - no API calls)
const MOCK_STATS = {
    totalOrders: 127,
    activeOrders: 8,
    totalRestaurants: 45
}

const MOCK_RESTAURANTS = [
    {
        id: 1,
        name: 'Spice Garden',
        cuisine: 'North Indian',
        rating: 4.5,
        deliveryTime: '25-35 min',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop'
    },
    {
        id: 2,
        name: 'Biryani House',
        cuisine: 'Hyderabadi',
        rating: 4.7,
        deliveryTime: '30-40 min',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop'
    },
    {
        id: 3,
        name: 'Dosa Corner',
        cuisine: 'South Indian',
        rating: 4.3,
        deliveryTime: '20-30 min',
        image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop'
    },
    {
        id: 4,
        name: 'Tandoor Palace',
        cuisine: 'Punjabi',
        rating: 4.6,
        deliveryTime: '35-45 min',
        image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400&h=300&fit=crop'
    },
    {
        id: 5,
        name: 'Mumbai Chaat House',
        cuisine: 'Street Food',
        rating: 4.4,
        deliveryTime: '30-40 min',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop'
    },
    {
        id: 6,
        name: 'Kerala Kitchen',
        cuisine: 'Kerala Cuisine',
        rating: 4.8,
        deliveryTime: '25-35 min',
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop'
    }
]

export default function Dashboard() {
    const navigate = useNavigate()

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-semibold text-apple-text">Welcome back</h1>
                <p className="text-apple-text-secondary mt-1">Discover amazing restaurants near you</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Orders" value={MOCK_STATS.totalOrders} icon="📦" />
                <StatCard title="Active Orders" value={MOCK_STATS.activeOrders} icon="🚀" />
                <StatCard title="Restaurants" value={MOCK_STATS.totalRestaurants} icon="🍽️" />
            </div>

            {/* Restaurants Section */}
            <div>
                <SectionHeader
                    title="Restaurants"
                    subtitle="Popular restaurants in your area"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_RESTAURANTS.map(restaurant => (
                        <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                            onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

function RestaurantCard({ restaurant, onClick }) {
    return (
        <Card onClick={onClick}>
            {/* Image */}
            <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24"%3E' + restaurant.cuisine + '%3C/text%3E%3C/svg%3E'
                    }}
                />
            </div>

            {/* Info */}
            <div>
                <h3 className="font-semibold text-apple-text text-lg">{restaurant.name}</h3>
                <p className="text-sm text-apple-text-secondary mt-1">{restaurant.cuisine}</p>

                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium text-apple-text">{restaurant.rating}</span>
                    </div>
                    <span className="text-sm text-apple-text-secondary">{restaurant.deliveryTime}</span>
                </div>
            </div>
        </Card>
    )
}
