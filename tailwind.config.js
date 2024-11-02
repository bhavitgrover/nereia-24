module.exports = {
  content: [
    './views/**/*.ejs',
    './public/**/*.html',
    // Add other paths as needed
  ],
  theme: {
    extend: {
      colors: {
        'background': '#eeeefc',
        'primary': '#000',
        'accent-dark': '#11005e',
        'accent-light': '#9191e8',
        'violet': '#b7b7f0',
        'periwinkle': '#cacaf4'
      },
      fontFamily: {
        'raleway': ['Raleway', 'sans-serif'],
      },
      animation: {
        shimmer: "shimmer 2s linear infinite"
      },
      keyframes: {
        shimmer: {
          from: {
            "backgroundPosition": "0 0"
          },
          to: {
            "backgroundPosition": "-200% 0"
          }
        }
      },
    },
  },
  plugins: [],
}