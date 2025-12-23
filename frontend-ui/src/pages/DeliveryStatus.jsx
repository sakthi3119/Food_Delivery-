import { useParams, useNavigate } from 'react-router-dom'
import { Card, Badge, SectionHeader } from '../components/UIComponents'

// Mock data
const MOCK_DELIVERY = {
    1: {
        orderId: 1,
        status: 'DELIVERED',
        currentStep: 4
    },
    2: {
        orderId: 2,
        status: 'ON_THE_WAY',
        currentStep: 3
    },
    3: {
        orderId: 3,
        status: 'PREPARING',
        currentStep: 1
    },
    4: {
        orderId: 4,
        status: 'CONFIRMED',
        currentStep: 0
    }
}

const DELIVERY_STEPS = [
    { id: 0, title: 'Order Confirmed', description: 'Restaurant has received your order' },
    { id: 1, title: 'Preparing', description: 'Your food is being prepared' },
    { id: 2, title: 'Picked Up', description: 'Delivery partner has picked up your order' },
    { id: 3, title: 'On the Way', description: 'Your order is on its way' },
    { id: 4, title: 'Delivered', description: 'Order has been delivered' }
]

const MOCK_PARTNER = {
    name: 'John Delivery',
    phone: '+1 (555) 123-4567',
    vehicleType: 'Bike',
    rating: 4.8
}

export default function DeliveryStatus() {
    const { orderId } = useParams()
    const navigate = useNavigate()

    const delivery = MOCK_DELIVERY[orderId] || MOCK_DELIVERY[2]

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => navigate('/orders')}
                className="flex items-center space-x-2 text-apple-text-secondary hover:text-apple-text transition-colors"
            >
                <span>←</span>
                <span className="text-sm font-medium">Back to orders</span>
            </button>

            {/* Page Header */}
            <div className="text-center">
                <h1 className="text-3xl font-semibold text-apple-text">Delivery Status</h1>
                <p className="text-apple-text-secondary mt-1">Order #{delivery.orderId}</p>
            </div>

            {/* Delivery Partner Card */}
            {delivery.currentStep >= 2 && (
                <Card>
                    <h3 className="font-semibold text-apple-text mb-4">Delivery Partner</h3>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-apple-accent rounded-full flex items-center justify-center text-white text-xl font-semibold">
                            {MOCK_PARTNER.name[0]}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-apple-text">{MOCK_PARTNER.name}</p>
                            <div className="flex items-center space-x-3 mt-1">
                                <span className="text-sm text-apple-text-secondary">{MOCK_PARTNER.vehicleType}</span>
                                <span className="flex items-center space-x-1 text-sm">
                                    <span className="text-yellow-500">⭐</span>
                                    <span className="text-apple-text-secondary">{MOCK_PARTNER.rating}</span>
                                </span>
                            </div>
                        </div>
                        <a
                            href={`tel:${MOCK_PARTNER.phone}`}
                            className="px-4 py-2 bg-apple-accent text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                        >
                            📞 Call
                        </a>
                    </div>
                </Card>
            )}

            {/* Tracking Steps */}
            <Card>
                <SectionHeader title="Tracking" subtitle="Follow your order's journey" />

                <div className="space-y-6">
                    {DELIVERY_STEPS.map((step, index) => (
                        <TrackingStep
                            key={step.id}
                            step={step}
                            isCompleted={index <= delivery.currentStep}
                            isActive={index === delivery.currentStep}
                            isLast={index === DELIVERY_STEPS.length - 1}
                        />
                    ))}
                </div>
            </Card>

            {/* Estimated Time */}
            {delivery.currentStep < 4 && (
                <Card className="text-center">
                    <div className="text-4xl mb-3">⏱️</div>
                    <h3 className="font-semibold text-apple-text mb-1">Estimated Delivery</h3>
                    <p className="text-2xl font-semibold text-apple-accent">
                        {delivery.currentStep === 3 ? '5-10 min' : '25-30 min'}
                    </p>
                </Card>
            )}

            {/* Delivered Message */}
            {delivery.currentStep === 4 && (
                <Card className="text-center bg-green-50 border border-green-200">
                    <div className="text-5xl mb-3">✅</div>
                    <h3 className="text-xl font-semibold text-green-900 mb-2">Order Delivered!</h3>
                    <p className="text-green-700">Thank you for ordering. Enjoy your meal!</p>
                </Card>
            )}
        </div>
    )
}

function TrackingStep({ step, isCompleted, isActive, isLast }) {
    return (
        <div className="flex items-start space-x-4">
            {/* Icon */}
            <div className="relative">
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted
                            ? 'bg-apple-accent border-apple-accent text-white'
                            : isActive
                                ? 'bg-white border-apple-accent text-apple-accent'
                                : 'bg-white border-gray-300 text-gray-400'
                        }`}
                >
                    {isCompleted ? '✓' : step.id + 1}
                </div>

                {/* Connector Line */}
                {!isLast && (
                    <div
                        className={`absolute left-1/2 top-full w-0.5 h-6 -translate-x-1/2 ${isCompleted ? 'bg-apple-accent' : 'bg-gray-200'
                            }`}
                    />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
                <h4
                    className={`font-medium ${isCompleted || isActive ? 'text-apple-text' : 'text-apple-text-secondary'
                        }`}
                >
                    {step.title}
                </h4>
                <p className="text-sm text-apple-text-secondary mt-1">{step.description}</p>
                {isActive && (
                    <Badge variant="info" className="mt-2">
                        Current Status
                    </Badge>
                )}
            </div>
        </div>
    )
}
