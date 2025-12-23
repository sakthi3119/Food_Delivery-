/**
 * API GATEWAY - Food Delivery System
 * 
 * Purpose: Single entry point for all frontend requests
 * Routes requests to appropriate backend services
 * 
 * Architecture Flow:
 * Frontend → NGINX → API Gateway → Backend Services
 */

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Service URLs
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:8001';
const DELIVERY_SERVICE_URL = process.env.DELIVERY_SERVICE_URL || 'http://localhost:8002';
const INTERNAL_COMM_URL = process.env.INTERNAL_COMM_URL || 'http://localhost:9000';

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ============================================
// AUTHENTICATION ROUTES (→ Order Service)
// ============================================

/**
 * POST /api/auth/register
 * Register a new user
 */
app.post('/api/auth/register', async (req, res) => {
    try {
        const response = await axios.post(`${ORDER_SERVICE_URL}/auth/register`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Registration failed' });
    }
});

/**
 * POST /api/auth/login
 * Login user
 */
app.post('/api/auth/login', async (req, res) => {
    try {
        const response = await axios.post(`${ORDER_SERVICE_URL}/auth/login`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Login failed' });
    }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
app.get('/api/auth/me', async (req, res) => {
    try {
        const token = req.headers.authorization;
        const response = await axios.get(`${ORDER_SERVICE_URL}/auth/me`, {
            headers: { Authorization: token }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to get user info' });
    }
});

// ============================================
// RESTAURANT ROUTES (→ Order Service)
// ============================================

/**
 * GET /api/restaurants
 * Fetch all restaurants
 */
app.get('/api/restaurants', async (req, res) => {
    try {
        const response = await axios.get(`${ORDER_SERVICE_URL}/restaurants`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch restaurants' });
    }
});

/**
 * GET /api/restaurants/:id
 * Fetch restaurant details by ID
 */
app.get('/api/restaurants/:id', async (req, res) => {
    try {
        const response = await axios.get(`${ORDER_SERVICE_URL}/restaurants/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch restaurant details' });
    }
});

/**
 * GET /api/restaurants/:id/menu
 * Fetch restaurant menu
 */
app.get('/api/restaurants/:id/menu', async (req, res) => {
    try {
        const response = await axios.get(`${ORDER_SERVICE_URL}/restaurants/${req.params.id}/menu`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch menu' });
    }
});

// ============================================
// ORDER ROUTES (→ Order Service)
// ============================================

/**
 * POST /api/orders
 * Create new order
 * Triggers: Internal Comm Service to notify Delivery Service
 */
app.post('/api/orders', async (req, res) => {
    try {
        // Create order in Order Service
        const response = await axios.post(`${ORDER_SERVICE_URL}/orders`, req.body);

        // Notify Internal Comm Service (async event)
        axios.post(`${INTERNAL_COMM_URL}/events/order-created`, {
            orderId: response.data.id,
            restaurantId: req.body.restaurantId
        }).catch(err => console.error('Event notification failed:', err));

        res.status(201).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
});

/**
 * GET /api/orders
 * Fetch all orders for user
 */
app.get('/api/orders', async (req, res) => {
    try {
        const response = await axios.get(`${ORDER_SERVICE_URL}/orders`, {
            params: req.query
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

/**
 * GET /api/orders/:id
 * Fetch order details by ID
 */
app.get('/api/orders/:id', async (req, res) => {
    try {
        const response = await axios.get(`${ORDER_SERVICE_URL}/orders/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order details' });
    }
});

// ============================================
// DELIVERY ROUTES (→ Delivery Service)
// ============================================

/**
 * GET /api/delivery/:orderId
 * Get delivery status for order
 */
app.get('/api/delivery/:orderId', async (req, res) => {
    try {
        const response = await axios.get(`${DELIVERY_SERVICE_URL}/delivery/${req.params.orderId}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch delivery status' });
    }
});

/**
 * POST /api/delivery/assign
 * Assign delivery partner to order
 */
app.post('/api/delivery/assign', async (req, res) => {
    try {
        const response = await axios.post(`${DELIVERY_SERVICE_URL}/delivery/assign`, req.body);
        res.status(201).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to assign delivery' });
    }
});

// ============================================
// PAYMENT ROUTES (→ Delivery Service)
// ============================================

/**
 * POST /api/payments
 * Process payment for order
 */
app.post('/api/payments', async (req, res) => {
    try {
        const response = await axios.post(`${DELIVERY_SERVICE_URL}/payments`, req.body);
        res.status(201).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to process payment' });
    }
});

/**
 * GET /api/payments/:orderId
 * Get payment status
 */
app.get('/api/payments/:orderId', async (req, res) => {
    try {
        const response = await axios.get(`${DELIVERY_SERVICE_URL}/payments/${req.params.orderId}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payment status' });
    }
});

// ============================================
// HEALTH CHECK & ROOT
// ============================================

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'api-gateway' });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Food Delivery API Gateway',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            auth: '/api/auth/*',
            restaurants: '/api/restaurants',
            orders: '/api/orders',
            delivery: '/api/delivery',
            payments: '/api/payments'
        }
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
    console.log(`📡 Order Service: ${ORDER_SERVICE_URL}`);
    console.log(`🚚 Delivery Service: ${DELIVERY_SERVICE_URL}`);
    console.log(`🔗 Internal Comm: ${INTERNAL_COMM_URL}`);
});
