import type { Config } from "tailwindcss";
import { tokens } from "./shared/ui/tokens";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}", "./crm_ui/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Design System Tokens
      spacing: tokens.spacing,
      fontSize: tokens.fontSizes,
      fontWeight: tokens.fontWeights,
      zIndex: tokens.zIndex,
      maxWidth: tokens.containers,
      transitionDuration: tokens.durations,
      transitionTimingFunction: tokens.easing,
      boxShadow: tokens.shadows,
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
        sans: ['Cairo', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'primary': 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
        'light-gray': 'var(--light-gray)',
        // New Brand Colors (White + Sky Blue)
        brand: {
          bg: "var(--brand-bg)",
          sky: {
            light: "var(--brand-sky-light)",
            base: "var(--brand-sky-base)",
            accent: "var(--brand-sky-accent)",
          },
          text: {
            primary: "var(--brand-text-primary)",
            muted: "var(--brand-text-muted)",
          },
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primaryColor: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
