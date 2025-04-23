import { defineConfig } from 'father'

export default defineConfig({
  esm: {
    output: 'es',
  },
  cjs: {
    output: 'lib',
    platform: 'browser',
  },
  // umd: {
  //   output: 'dist',
  //   name: 'helper.min.js',
  //   externals: {
  //     axios: 'axios',
  //   },
  // },
})
