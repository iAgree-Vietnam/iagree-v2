/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        header:
          "0 1px 2px -2px rgba(0, 0, 0, 0.09), 0 3px 6px 0 rgba(0, 0, 0, 0.07), 0 5px 12px 4px rgba(0, 0, 0, 0.05)",
      },
      colors: {
        // primary: "#1D4ED8",
        // secondary: "#F97316",
        red: "#E14141",
        warn: "#E59F1E",
        purple: "#6C0999",
        green: "#09993E",
        blue: "#094399",
        brown: "#995109",
        black: "#25272D",
        gray: "#979797",
        blurGray: "#EFF0F3",
      },
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1440px",
        "2xl": "1536px",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          md: "1.5rem",
          lg: "2rem",
        },
        screens: {
          "2xl": "1200px",
        },
      },
      /// theme dark light
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.black"),
          },
        },
        dark: {
          css: {
            color: theme("colors.blurGray"),
            a: { color: theme("colors.green") },
          },
        },
      }),
    },
  },
  plugins: [],
};
