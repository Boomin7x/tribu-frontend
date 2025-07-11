/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-50': '#effef6',
        'primary-100': '#dafeeb',
        'primary-200': '#b7fbd9',
        'primary-300': '#7ef7bc',
        'primary-400': '#3fe996',
        'primary-500': '#16d176',
        'primary-600': '#0caf60',
        'primary-700': '#0d884d',
        'primary-800': '#106b40',
        'primary-900': '#0f5837',
        'primary-950': '#02311c',
  
        'secondary-50': '#f5f3ff',
        'secondary-100': '#ede9fe',
        'secondary-200': '#dfd7fd',
        'secondary-300': '#c7b7fb',
        'secondary-400': '#aa8ef7',
        'secondary-500': '#8f5ff3',
        'secondary-600': '#813ee9',
        'secondary-700': '#6d29ce',
        'secondary-800': '#5f24b3',
        'secondary-900': '#502092',
        'secondary-950': '#311263',
      },
    },
   
  },
  fontFamily: {
    display: ['Outfit', 'sans-serif'],
    body: ['Outfit', 'sans-serif'],
    serif: ['Outfit', 'sans-serif'],
    mono: ['Outfit', 'sans-serif'],
    sans: ['Outfit', 'sans-serif'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
  },
  plugins: [],
}

