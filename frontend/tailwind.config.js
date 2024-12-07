/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        'logo-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'document-slide': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'line-fade': {
          '0%': { transform: 'translateX(-5px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'accent-slide': {
          '0%': { transform: 'translate(-3px, 3px)', opacity: '0' },
          '100%': { transform: 'translate(0, 0)', opacity: '1' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        draw: {
          '0%': { opacity: '0', 'stroke-dashoffset': '100' },
          '100%': { opacity: '1', 'stroke-dashoffset': '0' },
        },
        accent: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'logo': 'logo-pulse 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'document': 'document-slide 0.5s ease-out',
        'line-1': 'line-fade 0.5s ease-out 0.2s forwards',
        'line-2': 'line-fade 0.5s ease-out 0.4s forwards',
        'line-3': 'line-fade 0.5s ease-out 0.6s forwards',
        'accent': 'accent-slide 0.5s ease-out 0.3s forwards',
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 3s ease-in-out infinite',
        'draw': 'draw 1.5s ease-in-out forwards',
        'draw-delayed': 'draw 1.5s ease-in-out 0.3s forwards',
        'accent': 'accent 2s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      backdropBlur: {
        'md': '12px',
        'lg': '16px',
      },
      transitionProperty: {
        'width': 'width'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [forms],
}
