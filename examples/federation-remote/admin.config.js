/** @type {import('@glcc/admin').ProjectConfig} */
module.exports = {
  port: 3001,
  // doctor: false,
  publicPath: 'http://localhost:3001',
  // base: '/remote',
  federation: {
    name: 'remote',
    list: [
      {
        name: 'remoteTest',
        entry: 'http://localhost:3002',
      },
    ],
  },
}
