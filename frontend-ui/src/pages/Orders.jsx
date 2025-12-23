import { useNavigate } from 'react-router-dom'
import { Card, Badge, SectionHeader } from '../components/UIComponents'

// Mock data
const MOCK_ORDERS = [
    {
        id: 1,
        restaurantName: 'Spice Garden',
        items: ['Butter Chicken', 'Garlic Naan', 'Dal Makhani'],
        totalAmount: 850,
        status: 'DELIVERED',
        orderDate: '2024-12-20',
        deliveryAddress: 'Flat 4B, Koramangala, Bangalore'
    },
    {
        id: 2,
        restaurantName: 'Biryani House',
        items: ['Hyderabadi Biryani', 'Raita', 'Gulab Jamun'],
        totalAmount: 650,
        status: 'ON_THE_WAY',
        orderDate: '2024-12-22',
        deliveryAddress: 'Flat 4B, Koramangala, Bangalore'
    },
    {
        id: 3,
        restaurantName: 'Dosa Corner',
        items: ['Masala Dosa', 'Filter Coffee'],
        totalAmount: 280,
        status: 'PREPARING',
        orderDate: '2024-12-22',
        deliveryAddress: 'Flat 4B, Koramangala, Bangalore'
    },
    {
        id: 4,
        restaurantName: 'Tandoor Palace',
        items: ['Paneer Tikka', 'Tandoori Roti', 'Dal Tadka'],
        totalAmount: 720,
        status: 'CONFIRMED',
        orderDate: '2024-12-22',
        deliveryAddress: 'Flat 4B, Koramangala, Bangalore'
    },
    {
        id: 5,
        restaurantName: 'Mumbai Chaat House',
        items: ['Pani Puri', 'Pav Bhaji'],
        totalAmount: 320,
        status: 'DELIVERED',
        orderDate: '2024-12-19',
        deliveryAddress: 'Flat 4B, Koramangala, Bangalore'
    }
]

const STATUS_CONFIG = {
    PENDING: { label: 'Pending', variant: 'default' },
    CONFIRMED: { label: 'Confirmed', variant: 'info' },
    PREPARING: { label: 'Preparing', variant: 'warning' },
    ON_THE_WAY: { label: 'On the Way', variant: 'info' },
    DELIVERED: { label: 'Delivered', variant: 'success' },
    CANCELLED: { label: 'Cancelled', variant: 'error' }
}

export default function Orders() {
    const navigate = useNavigate()

    const activeOrders = MOCK_ORDERS.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status))
    const pastOrders = MOCK_ORDERS.filter(o => ['DELIVERED', 'CANCELLED'].includes(o.status))

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-semibold text-apple-text">Your Orders</h1>
                <p className="text-apple-text-secondary mt-1">Track and manage your orders</p>
            </div>

            {/* Active Orders */}
            {activeOrders.length > 0 && (
                <div>
                    <SectionHeader
                        title="Active Orders"
                        subtitle={`${activeOrders.length} orders in progress`}
                    />

                    <div className="space-y-4">
                        {activeOrders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onClick={() => navigate(`/delivery/${order.id}`)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Past Orders */}
            {pastOrders.length > 0 && (
                <div>
                    <SectionHeader title="Past Orders" />

                    <div className="space-y-4">
                        {pastOrders.map(order => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {MOCK_ORDERS.length === 0 && (
                <Card className="text-center py-12">
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className="text-lg font-semibold text-apple-text mb-2">No orders yet</h3>
                    <p className="text-apple-text-secondary mb-6">Start ordering from your favorite restaurants</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-apple-accent text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                    >
                        Browse Restaurants
                    </button>
                </Card>
            )}
        </div>
    )
}

function OrderCard({ order, onClick }) {
    const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING

    return (
        <Card onClick={onClick}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-apple-text text-lg">{order.restaurantName}</h3>
                    <p className="text-sm text-apple-text-secondary mt-1">Order #{order.id}</p>
                    <p className="text-xs text-apple-text-secondary mt-1">{order.orderDate}</p>
                </div>
                <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
            </div>

            <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-apple-text-secondary">
                        <span className="w-1.5 h-1.5 bg-apple-text-secondary rounded-full"></span>
                        <span>{item}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-apple-border">
                <span className="text-sm text-apple-text-secondary">{order.deliveryAddress}</span>
                <span className="font-semibold text-apple-text">₹{order.totalAmount}</span>
            </div>
        </Card>
    )
}
