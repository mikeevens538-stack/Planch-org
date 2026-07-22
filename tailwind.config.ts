import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F3EEE3",
        paper2: "#EAE2D2",
        ink: "#15130F",
        cobalt: "#2A3EE8",
        coral: "#FF5C39",
        emerald: "#0FA968",
        magenta: "#E23F82",
      },
      fontFamily: {
        display: ["var(--font-archivo)", "sans-serif"],
        body: ["var(--font-grotesk)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
