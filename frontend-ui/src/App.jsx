import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './layouts/Layout'
import Dashboard from './pages/Dashboard'
import RestaurantDetail from './pages/RestaurantDetail'
import Orders from './pages/Orders'
import DeliveryStatus from './pages/DeliveryStatus'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route path="/" element={
                        <Layout>
                            <Dashboard />
                        </Layout>
                    } />
                    <Route path="/restaurant/:id" element={
                        <Layout>
                            <RestaurantDetail />
                        </Layout>
                    } />
                    <Route path="/orders" element={
                        <ProtectedRoute>
                            <Layout>
                                <Orders />
                            </Layout>
                        </ProtectedRoute>
                    } />
                    <Route path="/delivery/:orderId" element={
                        <ProtectedRoute>
                            <Layout>
                                <DeliveryStatus />
                            </Layout>
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
