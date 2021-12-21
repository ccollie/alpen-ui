module.exports = {
  content: ['./public/index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // See options here: https://github.com/ecklf/tailwindcss-radix?ref=reactjsexample.com#options
    // require('tailwindcss-radix')(),
  ],
};
