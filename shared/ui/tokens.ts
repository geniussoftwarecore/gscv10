/**
 * Design Tokens - Centralized design system tokens
 * Extracted from existing CSS variables and patterns to maintain visual consistency
 */

// Spacing Scale (based on Tailwind defaults + custom patterns)
export const spacing = {
  xs: '0.25rem',    // 4px - for micro spacing
  sm: '0.5rem',     // 8px - for small gaps
  base: '0.75rem',  // 12px - for standard spacing
  md: '1rem',       // 16px - for medium spacing
  lg: '1.5rem',     // 24px - for large spacing
  xl: '2rem',       // 32px - for extra large spacing
  '2xl': '3rem',    // 48px - for section spacing
  '3xl': '4rem',    // 64px - for major sections
  '4xl': '6rem',    // 96px - for hero sections
} as const;

// Border Radius (based on CSS variables)
export const radius = {
  none: '0',
  sm: 'calc(var(--radius) - 4px)',     // ~16px
  base: 'calc(var(--radius) - 2px)',   // ~18px  
  md: 'var(--radius)',                 // 20px (1.3rem)
  lg: 'calc(var(--radius) + 2px)',     // ~22px
  xl: 'calc(var(--radius) + 4px)',     // ~24px
  full: '9999px',
} as const;

// Shadow Scale (based on existing patterns)
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow: '0 0 30px rgba(var(--primary-rgb), 0.3)',
  lift: '0 20px 40px rgba(0, 0, 0, 0.1)',
} as const;

// Typography Scale (based on existing font patterns)
export const fontSizes = {
  xs: '0.75rem',     // 12px
  sm: '0.875rem',    // 14px
  base: '1rem',      // 16px
  lg: '1.125rem',    // 18px
  xl: '1.25rem',     // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
  '6xl': '3.75rem',  // 60px
} as const;

// Font Weights
export const fontWeights = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// Z-Index Scale (based on existing patterns)
export const zIndex = {
  hide: '-1',
  auto: 'auto',
  base: '0',
  docked: '10',
  dropdown: '1000',
  sticky: '1100',
  banner: '1200',
  overlay: '1300',
  modal: '1400',
  popover: '1500',
  skipLink: '1600',
  toast: '1700',
  tooltip: '1800',
} as const;

// Container Widths (based on existing breakpoints)
export const containers = {
  xs: '20rem',      // 320px
  sm: '24rem',      // 384px
  md: '28rem',      // 448px
  lg: '32rem',      // 512px
  xl: '36rem',      // 576px
  '2xl': '42rem',   // 672px
  '3xl': '48rem',   // 768px
  '4xl': '56rem',   // 896px
  '5xl': '64rem',   // 1024px
  '6xl': '72rem',   // 1152px
  '7xl': '80rem',   // 1280px
  full: '100%',
} as const;

// Animation Durations (based on existing patterns)
export const durations = {
  instant: '0ms',
  fast: '150ms',
  base: '300ms',
  slow: '500ms',
  slower: '700ms',
  slowest: '1000ms',
} as const;

// Animation Easing (based on existing patterns)
export const easing = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  bounce: 'cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
} as const;

// Component-specific tokens
export const components = {
  button: {
    height: {
      sm: '2.25rem',    // h-9 (36px)
      base: '2.5rem',   // h-10 (40px)
      lg: '2.75rem',    // h-11 (44px)
    },
    padding: {
      sm: '0.75rem',    // px-3
      base: '1rem',     // px-4
      lg: '2rem',       // px-8
    },
  },
  input: {
    height: '2.5rem',   // h-10 (40px)
    padding: '0.75rem', // px-3
  },
  card: {
    padding: '1.5rem',  // p-6 (24px)
  },
  table: {
    cellPadding: '1rem', // p-4 (16px)
    headerHeight: '3rem', // h-12 (48px)
  },
} as const;

// Export all tokens as a single object for easy importing
export const tokens = {
  spacing,
  radius,
  shadows,
  fontSizes,
  fontWeights,
  zIndex,
  containers,
  durations,
  easing,
  components,
} as const;

export type Tokens = typeof tokens;