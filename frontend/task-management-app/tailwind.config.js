/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}",
  "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Dynamic colors will be injected via inline styles
        // These are fallback colors
        primary: '#4CAF50',
        'text-primary': '#2e5a2e',
        'text-secondary': '#688f68',
        'text-dark': '#1b361b',
        background: '#e8f5e9',
        'card-bg': '#f1f8f2',
        'input-bg': '#f4faf5',
        border: '#c8e6c9',
      },
      fontFamily: {
        regular: ['System'],
        medium: ['System'],
        semibold: ['System'],
        bold: ['System'],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'md': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '28px',
        '4xl': '32px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '40px',
        '3xl': '48px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
    },
  },
  plugins: [],
}






