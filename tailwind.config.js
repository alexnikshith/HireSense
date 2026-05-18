/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(210 20% 98%)",
        foreground: "hsl(0 0% 10%)",
        primary: {
          DEFAULT: "hsl(0 0% 0%)", /* Black */
          foreground: "hsl(0 0% 100%)",
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(0 0% 10%)",
        },
        border: "hsl(214 32% 91%)",
        muted: {
          DEFAULT: "hsl(210 40% 96%)",
          foreground: "hsl(215 16% 47%)",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
