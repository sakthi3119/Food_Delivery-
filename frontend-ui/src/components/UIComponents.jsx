/**
 * CARD Component - Apple-style card
 */
export function Card({ children, className = '', onClick }) {
    return (
        <div
            onClick={onClick}
            className={`bg-apple-card rounded-apple p-6 shadow-apple transition-all ${onClick ? 'cursor-pointer hover:shadow-apple-lg hover:scale-[1.01]' : ''
                } ${className}`}
        >
            {children}
        </div>
    )
}

/**
 * STAT CARD Component - Dashboard statistics
 */
export function StatCard({ title, value, icon }) {
    return (
        <Card>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-apple-text-secondary">{title}</p>
                    <p className="text-2xl font-semibold text-apple-text mt-1">{value}</p>
                </div>
                <div className="text-4xl opacity-20">{icon}</div>
            </div>
        </Card>
    )
}

/**
 * BUTTON Component - Apple-style button
 */
export function Button({ children, variant = 'primary', onClick, disabled, className = '' }) {
    const baseStyles = 'px-6 py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary: 'bg-apple-accent text-white hover:bg-blue-600 active:scale-95',
        secondary: 'bg-gray-100 text-apple-text hover:bg-gray-200 active:scale-95',
        outline: 'border border-apple-border text-apple-text hover:bg-gray-50 active:scale-95'
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    )
}

/**
 * BADGE Component - Status badge
 */
export function Badge({ children, variant = 'default' }) {
    const variants = {
        default: 'bg-gray-100 text-gray-700',
        success: 'bg-green-50 text-green-700',
        warning: 'bg-yellow-50 text-yellow-700',
        error: 'bg-red-50 text-red-700',
        info: 'bg-blue-50 text-blue-700'
    }

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
            {children}
        </span>
    )
}

/**
 * SECTION HEADER Component
 */
export function SectionHeader({ title, subtitle, action }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-2xl font-semibold text-apple-text">{title}</h2>
                {subtitle && <p className="text-sm text-apple-text-secondary mt-1">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    )
}
