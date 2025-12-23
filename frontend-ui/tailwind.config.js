/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Apple-grade color palette
                'apple-bg': '#F5F5F7',
                'apple-card': '#FFFFFF',
                'apple-text': '#1D1D1F',
                'apple-text-secondary': '#6E6E73',
                'apple-accent': '#007AFF',
                'apple-border': 'rgba(0, 0, 0, 0.1)',
            },
            fontFamily: {
                'sf': ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'apple': '14px',
                'apple-lg': '16px',
            },
            boxShadow: {
                'apple': '0 2px 8px rgba(0, 0, 0, 0.04)',
                'apple-lg': '0 4px 16px rgba(0, 0, 0, 0.06)',
            },
        },
    },
    plugins: [],
}
