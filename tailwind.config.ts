import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          cyan: '#06b6d4',
          blue: '#3b82f6',
        },
        dark: {
          base: '#0a0a0f',
          lighter: '#1a1a1f',
        },
      },
      backdropBlur: {
        'glass': '10px',
      },
      typography: {
        invert: {
          css: {
            '--tw-prose-body': '#e5e7eb',
            '--tw-prose-headings': '#ffffff',
            '--tw-prose-links': '#06b6d4',
            '--tw-prose-bold': '#ffffff',
            '--tw-prose-code': '#06b6d4',
            '--tw-prose-quotes': '#9ca3af',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
