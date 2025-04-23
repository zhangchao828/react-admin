const postcssEnv = require('postcss-preset-env')
const px2vwPlugin = require('@zswl/plugins/postcss-px2vw')
const { getConfig } = require('@zswl/shared/project')

const { px2vw, tailwindConfig } = getConfig()

const spacing = Array.from({ length: 2000 }).reduce(
  (p, c, index) => {
    return { ...p, [index]: `${index}px` }
  },
  { 0.5: '0.5px' }
)
module.exports = {
  plugins: [
    tailwindConfig &&
      require('tailwindcss')({
        content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
        corePlugins: {
          preflight: false,
        },
        theme: {
          extend: {
            spacing,
            lineHeight: spacing,
            borderWidth: spacing,
            borderRadius: spacing,
            fontSize: spacing,
          },
        },
        ...tailwindConfig,
      }),
    postcssEnv({
      autoprefixer: {
        flexbox: 'no-2009',
        remove: false,
      },
      stage: 3,
    }),
    px2vw &&
      px2vwPlugin({
        ...px2vw,
      }),
  ].filter(Boolean),
}
