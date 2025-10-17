export default {
  content: ['index.html', './src/**/*.{js,jsx,ts,tsx,vue,html}'],
  theme: {
    extend: {
      keyframes: {
        shine: {
          '0%': { 'background-position': '100%' },
          '100%': { 'background-position': '-100%' },
        },
      },
      animation: {
        shine: 'shine 5s linear infinite',
      },
      colors: {
        // Background colors
        background: 'var(--color-background)',
        'background-secondary': 'var(--color-background-secondary)',

        // Foreground colors
        foreground: 'var(--color-foreground)',
        'foreground-secondary': 'var(--color-foreground-secondary)',
        'foreground-tertiary': 'var(--color-foreground-tertiary)',

        // Border colors
        border: 'var(--color-border)',

        // Accent colors
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        accent: 'var(--color-primary)', // Add accent as alias
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
      },
      spacing: {
        // Custom spacing scale
        1: 'var(--space-1)', // 4px
        2: 'var(--space-2)', // 8px
        3: 'var(--space-3)', // 12px
        4: 'var(--space-4)', // 16px
        5: 'var(--space-5)', // 20px
        6: 'var(--space-6)', // 24px
        8: 'var(--space-8)', // 32px
        10: 'var(--space-10)', // 40px
        12: 'var(--space-12)', // 48px
        16: 'var(--space-16)', // 64px
        20: 'var(--space-20)', // 80px
      },
      borderRadius: {
        // Custom border radius
        sm: 'var(--radius-sm)', // 4px
        md: 'var(--radius-md)', // 6px
        lg: 'var(--radius-lg)', // 8px
        xl: 'var(--radius-xl)', // 12px
      },
      boxShadow: {
        // Custom shadows
        small: 'var(--shadow-small)',
        medium: 'var(--shadow-medium)',
        large: 'var(--shadow-large)',
        // Keep default shadows too
        sm: 'var(--shadow-small)',
        md: 'var(--shadow-medium)',
        lg: 'var(--shadow-large)',
      },
      fontFamily: {
        // Custom font families
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      fontSize: {
        // Custom font sizes
        xs: 'var(--text-xs)', // 12px
        sm: 'var(--text-sm)', // 14px
        base: 'var(--text-base)', // 16px
        lg: 'var(--text-lg)', // 18px
        xl: 'var(--text-xl)', // 20px
        '2xl': 'var(--text-2xl)', // 24px
        '3xl': 'var(--text-3xl)', // 30px
        '4xl': 'var(--text-4xl)', // 36px
        '5xl': 'var(--text-5xl)', // 48px
      },
      lineHeight: {
        // Custom line heights
        tight: 'var(--leading-tight)', // 1.25
        snug: 'var(--leading-snug)', // 1.375
        normal: 'var(--leading-normal)', // 1.5
        relaxed: 'var(--leading-relaxed)', // 1.625
        loose: 'var(--leading-loose)', // 2
      },
    },
  },
  plugins: [],
};
