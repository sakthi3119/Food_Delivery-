import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import Dashboard from './pages/Dashboard'
import RestaurantDetail from './pages/RestaurantDetail'
import Orders from './pages/Orders'
import DeliveryStatus from './pages/DeliveryStatus'

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/delivery/:orderId" element={<DeliveryStatus />} />
                </Routes>
            </Layout>
        </Router>
    )
}

export default App
