/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#E8F5E9',
                    100: '#C8E6C9',
                    200: '#A5D6A7',
                    300: '#81C784',
                    400: '#66BB6A',
                    500: '#4CAF50',
                    600: '#2E7D32', // Healing Green
                    700: '#1B5E20',
                    800: '#1B5E20',
                    900: '#003300',
                    DEFAULT: '#2E7D32',
                },
                background: '#FAFAFA',
            },
            fontFamily: {
                sans: ['"DM Sans"', 'Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
