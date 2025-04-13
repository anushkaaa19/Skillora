/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      "edu-sa": ["'Edu SA Beginner'", "cursive"],
      mono: ["'Roboto Mono'", "monospace"]
    },
    colors: {
      white: "#fff",
      black: "#080808",
      transparent: "transparent",
      richblack: {
        5: "#F1F2FF",
        25: "#DBD0EA",
        50: "#C5C704",
        100: "#AFB2BF",
        200: "#999DAA",
        300: "#338804",
        400: "#6E727F",
        500: "#535D69",
        600: "#424854",
        700: "#2C333F",
        800: "#161D29",
        900: "#000814",
      },
      richblue: {
        5: "#ECF5FF",
        25: "#C6D0E1",
        50: "#A0A7C3",
        100: "#7A7DA6",
        200: "#EFA76F",
        300: "#DA3063",
        400: "#B03356",
        500: "#9F29A4",
        600: "#8A143E",
        700: "#691432",
        800: "#4FA025",
        900: "#348019",
      },
      yellow: {
        5: "#FFF970",
        25: "#FFEB32",
        50: "#FFD60A",
        100: "#E7C009",
        200: "#CFAB08",
        300: "#B69507",
        400: "#9E8006",
        500: "#866404",
        600: "#655003",
        700: "#533102",
        800: "#3D2A00",
        900: "#251400",
      },
      pink: {
        5: "#FFF1F1",
        25: "#FBC7C1",
        50: "#F70CB0",
        100: "#F37290",
        200: "#EF476F",
        300: "#E043D3",
        400: "#D8335F",
        500: "#9F29A4",
        600: "#8A153E",
        700: "#691432",
        800: "#A00A25",
        900: "#340813",
      },
      "pure-greys": {
        5: "#F9F9F9",
        25: "#E2E2E2",
        50: "#CCCCCC",
        100: "#959595",
        200: "#9E8888",
        300: "#888888",
        400: "#717171",
        500: "#555555",
        600: "#444444",
        700: "#202020",
        800: "#171717",
        900: "#141414",
      }
    },
    extend: {
      maxWidth: {
        'screen-xl': '1260px',
        'content-tab': '659px'
      }
    }
  },
  plugins: [],
}