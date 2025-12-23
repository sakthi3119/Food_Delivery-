/**
 * INTERNAL COMMUNICATION SERVICE
 * 
 * Purpose: Facilitates backend-to-backend communication
 * Responsibilities:
 * - Event publishing/subscribing
 * - Service-to-service data sync
 * - Async task coordination
 * - Service health monitoring
 * 
 * Architecture Flow:
 * Order Service ← Internal Comm Service → Delivery Service
 * 
 * Production: Replace with message queue (RabbitMQ/Kafka) for scalability
 */

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 9000;

// Service URLs
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:8001';
const DELIVERY_SERVICE_URL = process.env.DELIVERY_SERVICE_URL || 'http://localhost:8002';

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ============================================
// IN-MEMORY EVENT STORE (HLD)
// ============================================

/**
 * Event Store: Stores events for async processing
 * Production: Replace with Redis/Message Queue
 */
const eventStore = [];

/**
 * Subscribers: Maps event types to handler functions
 * Production: Use proper pub/sub pattern
 */
const subscribers = new Map();

// ============================================
// EVENT PUBLISHING
// ============================================

/**
 * POST /events/order-created
 * Publish order-created event
 * 
 * Flow:
 * 1. Order Service creates order
 * 2. Order Service notifies Internal Comm
 * 3. Internal Comm assigns delivery partner
 * 4. Internal Comm updates order status
 */
app.post('/events/order-created', async (req, res) => {
    const { orderId, restaurantId } = req.body;

    console.log(`📢 Event: Order Created - ID: ${orderId}`);

    // Store event
    eventStore.push({
        type: 'ORDER_CREATED',
        data: { orderId, restaurantId },
        timestamp: new Date().toISOString()
    });

    // HLD: Trigger delivery assignment
    try {
        // Assign delivery partner
        const deliveryResponse = await axios.post(`${DELIVERY_SERVICE_URL}/delivery/assign`, {
            orderId,
            deliveryAddress: '123 Customer Street',  // Mock address
            pickupAddress: 'Restaurant Location'
        });

        console.log(`✅ Delivery assigned for order ${orderId}`);

        // Update order status in Order Service
        await axios.put(`${ORDER_SERVICE_URL}/orders/${orderId}/status`, {
            status: 'CONFIRMED'
        });

        console.log(`✅ Order status updated to CONFIRMED`);

    } catch (error) {
        console.error(`❌ Failed to process order-created event:`, error.message);
    }

    res.json({ message: 'Event processed', orderId });
});

/**
 * POST /events/delivery-status-updated
 * Publish delivery status update event
 * 
 * Flow:
 * 1. Delivery Service updates status
 * 2. Delivery Service notifies Internal Comm
 * 3. Internal Comm updates order status
 */
app.post('/events/delivery-status-updated', async (req, res) => {
    const { orderId, status } = req.body;

    console.log(`📢 Event: Delivery Status Updated - Order: ${orderId}, Status: ${status}`);

    // Store event
    eventStore.push({
        type: 'DELIVERY_STATUS_UPDATED',
        data: { orderId, status },
        timestamp: new Date().toISOString()
    });

    // HLD: Update order status based on delivery status
    try {
        let orderStatus = 'PENDING';

        switch (status) {
            case 'ASSIGNED':
                orderStatus = 'CONFIRMED';
                break;
            case 'PICKED_UP':
                orderStatus = 'PREPARING';
                break;
            case 'ON_THE_WAY':
                orderStatus = 'OUT_FOR_DELIVERY';
                break;
            case 'DELIVERED':
                orderStatus = 'DELIVERED';
                break;
        }

        await axios.put(`${ORDER_SERVICE_URL}/orders/${orderId}/status`, {
            status: orderStatus
        });

        console.log(`✅ Order status updated to ${orderStatus}`);

    } catch (error) {
        console.error(`❌ Failed to process delivery-status-updated event:`, error.message);
    }

    res.json({ message: 'Event processed', orderId, status });
});

/**
 * POST /events/payment-completed
 * Publish payment completion event
 */
app.post('/events/payment-completed', async (req, res) => {
    const { orderId, paymentId, status } = req.body;

    console.log(`📢 Event: Payment Completed - Order: ${orderId}, Status: ${status}`);

    eventStore.push({
        type: 'PAYMENT_COMPLETED',
        data: { orderId, paymentId, status },
        timestamp: new Date().toISOString()
    });

    // HLD: Update order payment status
    try {
        if (status === 'SUCCESS') {
            await axios.put(`${ORDER_SERVICE_URL}/orders/${orderId}/status`, {
                status: 'PAID'
            });
            console.log(`✅ Order marked as PAID`);
        }
    } catch (error) {
        console.error(`❌ Failed to process payment-completed event:`, error.message);
    }

    res.json({ message: 'Event processed', orderId });
});

// ============================================
// EVENT SUBSCRIPTION (HLD)
// ============================================

/**
 * POST /subscribe
 * Subscribe to events (for future scalability)
 * 
 * Production: Implement proper pub/sub with message queues
 */
app.post('/subscribe', (req, res) => {
    const { eventType, callbackUrl } = req.body;

    if (!subscribers.has(eventType)) {
        subscribers.set(eventType, []);
    }

    subscribers.get(eventType).push(callbackUrl);

    res.json({
        message: 'Subscribed successfully',
        eventType,
        callbackUrl
    });
});

// ============================================
// EVENT HISTORY & MONITORING
// ============================================

/**
 * GET /events
 * Get all events (for monitoring/debugging)
 */
app.get('/events', (req, res) => {
    res.json({
        totalEvents: eventStore.length,
        events: eventStore.slice(-20)  // Last 20 events
    });
});

/**
 * GET /events/:orderId
 * Get events for specific order
 */
app.get('/events/:orderId', (req, res) => {
    const orderId = parseInt(req.params.orderId);

    const orderEvents = eventStore.filter(event =>
        event.data && event.data.orderId === orderId
    );

    res.json({
        orderId,
        eventCount: orderEvents.length,
        events: orderEvents
    });
});

// ============================================
// SERVICE HEALTH MONITORING
// ============================================

/**
 * GET /health/services
 * Check health of all connected services
 */
app.get('/health/services', async (req, res) => {
    const healthChecks = {
        orderService: 'unknown',
        deliveryService: 'unknown'
    };

    try {
        await axios.get(`${ORDER_SERVICE_URL}/health`, { timeout: 2000 });
        healthChecks.orderService = 'healthy';
    } catch (error) {
        healthChecks.orderService = 'unhealthy';
    }

    try {
        await axios.get(`${DELIVERY_SERVICE_URL}/health`, { timeout: 2000 });
        healthChecks.deliveryService = 'healthy';
    } catch (error) {
        healthChecks.deliveryService = 'unhealthy';
    }

    res.json(healthChecks);
});

// ============================================
// HEALTH CHECK & ROOT
// ============================================

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'internal-comm-service' });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Internal Communication Service',
        version: '1.0.0',
        endpoints: {
            events: '/events',
            subscribe: '/subscribe',
            healthCheck: '/health/services'
        },
        stats: {
            totalEvents: eventStore.length,
            subscribers: subscribers.size
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🔗 Internal Communication Service running on port ${PORT}`);
    console.log(`📡 Order Service: ${ORDER_SERVICE_URL}`);
    console.log(`🚚 Delivery Service: ${DELIVERY_SERVICE_URL}`);
});
