import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Layout({ children }) {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout, isAuthenticated } = useAuth()
    const [showMenu, setShowMenu] = useState(false)

    const isActive = (path) => location.pathname === path

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-apple-bg">
            {/* Header - macOS style */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-apple-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-apple-accent rounded-lg flex items-center justify-center text-white font-semibold text-lg">
                                F
                            </div>
                            <span className="text-lg font-semibold text-apple-text">Food Delivery</span>
                        </Link>

                        {/* Navigation */}
                        <div className="flex items-center space-x-1">
                            <nav className="flex items-center space-x-1 mr-4">
                                <NavLink to="/" active={isActive('/')}>
                                    Dashboard
                                </NavLink>
                                {isAuthenticated && (
                                    <NavLink to="/orders" active={isActive('/orders')}>
                                        Orders
                                    </NavLink>
                                )}
                            </nav>

                            {/* Auth Section */}
                            {isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                            {user?.username?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                            {user?.username}
                                        </span>
                                    </button>

                                    {showMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">{user?.full_name || user?.username}</p>
                                                <p className="text-xs text-gray-500">{user?.email}</p>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-apple-border mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-sm text-apple-text-secondary">
                        Food Delivery System · HLD Architecture Demo
                    </p>
                </div>
            </footer>
        </div>
    )
}

function NavLink({ to, active, children }) {
    return (
        <Link
            to={to}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active
                ? 'bg-apple-accent text-white'
                : 'text-apple-text-secondary hover:text-apple-text hover:bg-gray-100'
                }`}
        >
            {children}
        </Link>
    )
}
