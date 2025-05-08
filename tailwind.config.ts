import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#121212',
          darker: '#0a0a0a',
        },
        card: {
          light: '#ffffff',
          DEFAULT: '#f8f8f8',
          hover: '#f0f0f0',
        },
        primary: {
          light: '#4da3ff',
          DEFAULT: '#0078ff',
          dark: '#0055cc',
        },
        text: {
          primary: '#171717',
          secondary: '#525252',
          light: '#f8f8f8',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        divider: '#e5e5e5',
      },
      borderRadius: {
        card: '0.75rem',
        button: '0.5rem',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        button: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        'button-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
      zIndex: {
        header: '10',
        modal: '50',
        dropdown: '30',
        tooltip: '40',
      },
    },
  },
  plugins: [],
};

export default config;
