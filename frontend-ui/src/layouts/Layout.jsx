import { Link, useLocation } from 'react-router-dom'

export default function Layout({ children }) {
    const location = useLocation()

    const isActive = (path) => location.pathname === path

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
                        <nav className="flex items-center space-x-1">
                            <NavLink to="/" active={isActive('/')}>
                                Dashboard
                            </NavLink>
                            <NavLink to="/orders" active={isActive('/orders')}>
                                Orders
                            </NavLink>
                        </nav>
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
